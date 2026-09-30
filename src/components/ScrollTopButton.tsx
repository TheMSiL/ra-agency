"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { useI18n } from "@/context/I18nContext";

/** Roughly a screen and a half down — far enough that the header is long gone. */
const SHOW_AFTER_RATIO = 1.5;

/**
 * Not to be confused with ScrollToTop, which resets the scroll position on
 * navigation and renders nothing. This is the visible button.
 *
 * It sits bottom-left because the Telegram CTA owns bottom-right, and it hides
 * itself while the burger menu is open for the same reason that button does.
 */
export default function ScrollTopButton() {
	const { t } = useI18n();
	const pathname = usePathname();
	const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");
	const [visible, setVisible] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (isStudio) return;

		const update = () => {
			const scrollable = document.documentElement.scrollHeight - window.innerHeight;
			const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
			// Written straight to a custom property: the ring moves on every scroll
			// frame, and a React render per frame would be wasted work.
			buttonRef.current?.style.setProperty("--scroll-progress", String(progress * 100));
			setVisible(window.scrollY > window.innerHeight * SHOW_AFTER_RATIO);
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, [isStudio]);

	if (isStudio) return null;

	const scrollUp = () => {
		// Long pages here are pinned by ScrollTrigger, and a smooth scroll across a
		// pin is a slow ride through every frame of the animation. Honour the
		// preference, and jump when the visitor has asked for less motion.
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
	};

	return (
		<button
			ref={buttonRef}
			type="button"
			className={`scroll_top-btn${visible ? " is-visible" : ""}`}
			onClick={scrollUp}
			aria-label={t("common.toTop")}
			tabIndex={visible ? 0 : -1}
			aria-hidden={!visible}
		>
			<svg className="scroll_top-ring" viewBox="0 0 60 60" aria-hidden="true">
				<circle className="scroll_top-ring-track" cx="30" cy="30" r="28" />
				<circle className="scroll_top-ring-fill" cx="30" cy="30" r="28" pathLength="100" />
			</svg>
			<span className="scroll_top-core" aria-hidden="true">
				{/* Two stacked chevrons: on hover the first slides out the top and the
				    second follows it in from below, so the arrow reads as moving up. */}
				<span className="scroll_top-track">
					{[0, 1].map((i) => (
						<svg key={i} className="scroll_top-icon" viewBox="0 0 24 24" width="20" height="20" fill="none">
							<path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					))}
				</span>
			</span>
		</button>
	);
}
