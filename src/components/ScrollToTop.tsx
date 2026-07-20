"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

export default function ScrollToTop() {
	const pathname = usePathname();

	useLayoutEffect(() => {
		const root = document.documentElement;
		const previousScrollBehavior = root.style.scrollBehavior;
		const previousOverflowAnchor = root.style.overflowAnchor;
		let frameId = 0;
		let frameCount = 0;

		root.style.scrollBehavior = "auto";
		root.style.overflowAnchor = "none";

		const holdAtTop = () => {
			window.scrollTo(0, 0);
			frameCount += 1;

			// ScrollTrigger adds its pin spacer after the route has rendered. Keep the
			// viewport at the top until those layout measurements have settled.
			if (frameCount < 12) {
				frameId = window.requestAnimationFrame(holdAtTop);
				return;
			}

			root.style.scrollBehavior = previousScrollBehavior;
			root.style.overflowAnchor = previousOverflowAnchor;
		};

		holdAtTop();

		return () => {
			window.cancelAnimationFrame(frameId);
			root.style.scrollBehavior = previousScrollBehavior;
			root.style.overflowAnchor = previousOverflowAnchor;
		};
	}, [pathname]);

	return null;
}
