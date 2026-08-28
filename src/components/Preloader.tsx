"use client";

import { useEffect, useState } from "react";

import { markAppReady } from "@/lib/appReady";
import LoadingScreen from "./loading/LoadingScreen";

/** Keeps the intro from flashing for a single frame on a warm cache. */
const MIN_VISIBLE_MS = 1600;
/** Hard ceiling — a stalled request must never hold the visitor on the splash. */
const MAX_VISIBLE_MS = 4000;

/**
 * Owns the boot splash. The screen itself (components/loading) runs its own
 * progress off `window.load`; this wrapper adds the two things the site needs
 * around it.
 *
 * The ceiling: the screen's auto mode waits for `window.load` with no deadline,
 * so a single hanging request would park a visitor at 92% indefinitely. Handing
 * it an explicit `progress` switches it to controlled mode, which is how the
 * timeout forces the finish.
 *
 * The handoff: every intro animation on the site is gated on `data-app-ready`
 * (see lib/appReady), so the reveal has to be announced when the splash leaves —
 * otherwise the hero assembles itself underneath it and is already over by the
 * time anyone sees the page.
 */
export default function Preloader() {
	const [forceDone, setForceDone] = useState(false);

	useEffect(() => {
		// performance.now() counts from navigation start, so a page that was
		// already fast keeps the splash for the remainder of the ceiling only.
		const timer = window.setTimeout(() => setForceDone(true), Math.max(0, MAX_VISIBLE_MS - performance.now()));
		return () => window.clearTimeout(timer);
	}, []);

	return (
		<LoadingScreen
			progress={forceDone ? 100 : undefined}
			minDuration={MIN_VISIBLE_MS}
			onDone={markAppReady}
		/>
	);
}
