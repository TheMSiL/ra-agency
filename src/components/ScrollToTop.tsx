"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

const STORAGE_KEY = "scroll-positions";

/** Frames the viewport is pinned for even on a plain forward navigation. */
const MIN_HOLD_FRAMES = 12;
/** Upper bound for a restore (~1.5s): long enough for pins to settle, short
    enough that a page which never grows tall enough does not trap the viewport. */
const MAX_RESTORE_FRAMES = 90;

const currentKey = () => window.location.pathname + window.location.search;

function readStored(): Record<string, number> {
	try {
		return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, number>;
	} catch {
		return {};
	}
}

// Set by the browser's back/forward buttons, consumed by the next route change.
// Registered at module scope so it is in place before Next's own popstate
// handler starts rendering the destination page.
let pendingHistoryNavigation = false;

if (typeof window !== "undefined") {
	window.addEventListener("popstate", () => {
		pendingHistoryNavigation = true;
	});
}

/**
 * Starts every new page at the top, but sends back/forward navigation to where
 * the visitor left that page. Positions are kept per URL for the session, so
 * the same works after a full reload or coming back from another site.
 */
export default function ScrollToTop() {
	const pathname = usePathname();
	const positions = useRef<Record<string, number> | null>(null);
	const activeKey = useRef<string | null>(null);
	const isFirstRun = useRef(true);

	useEffect(() => {
		let saveTimer = 0;

		const persist = () => {
			try {
				window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions.current ?? {}));
			} catch {
				// Private mode or a full quota: restoring still works within the tab.
			}
		};

		const record = () => {
			if (!positions.current || !activeKey.current) return;
			positions.current[activeKey.current] = window.scrollY;
			window.clearTimeout(saveTimer);
			saveTimer = window.setTimeout(persist, 200);
		};

		window.addEventListener("scroll", record, { passive: true });
		window.addEventListener("pagehide", persist);

		return () => {
			window.clearTimeout(saveTimer);
			window.removeEventListener("scroll", record);
			window.removeEventListener("pagehide", persist);
		};
	}, []);

	useLayoutEffect(() => {
		positions.current ??= readStored();

		const key = currentKey();
		activeKey.current = key;

		let isHistoryNavigation = pendingHistoryNavigation;
		pendingHistoryNavigation = false;

		if (isFirstRun.current) {
			isFirstRun.current = false;
			const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
			isHistoryNavigation = entry?.type === "back_forward";
		}

		// Taken once up front: while the page is still growing, scroll events
		// record clamped positions for this key, and the hold must not chase them.
		const target = isHistoryNavigation ? (positions.current[key] ?? 0) : 0;
		const root = document.documentElement;
		const previousScrollBehavior = root.style.scrollBehavior;
		const previousOverflowAnchor = root.style.overflowAnchor;
		let frameId = 0;
		let frameCount = 0;

		root.style.scrollBehavior = "auto";
		root.style.overflowAnchor = "none";

		// Once the visitor starts scrolling themselves, stop fighting them.
		const userEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

		const release = () => {
			window.cancelAnimationFrame(frameId);
			root.style.scrollBehavior = previousScrollBehavior;
			root.style.overflowAnchor = previousOverflowAnchor;
			userEvents.forEach((type) => window.removeEventListener(type, release));
		};

		userEvents.forEach((type) => window.addEventListener(type, release, { passive: true }));

		const hold = () => {
			window.scrollTo(0, target);
			frameCount += 1;

			// ScrollTrigger adds its pin spacer after the route has rendered, so the
			// page may not be tall enough for the target yet. Keep placing the
			// viewport until those layout measurements have settled.
			const reached = Math.abs(window.scrollY - target) < 2;
			const keepHolding =
				frameCount < MIN_HOLD_FRAMES || (!reached && frameCount < MAX_RESTORE_FRAMES);

			if (keepHolding) {
				frameId = window.requestAnimationFrame(hold);
				return;
			}

			if (positions.current) positions.current[key] = window.scrollY;
			release();
		};

		hold();

		return release;
	}, [pathname]);

	return null;
}
