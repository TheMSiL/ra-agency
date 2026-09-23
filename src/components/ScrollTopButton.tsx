"use client";

import { useEffect, useState } from "react";
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

	useEffect(() => {
		if (isStudio) return;

		const update = () => setVisible(window.scrollY > window.innerHeight * SHOW_AFTER_RATIO);

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
			type="button"
			className={`scroll_top-btn${visible ? " is-visible" : ""}`}
			onClick={scrollUp}
			aria-label={t("common.toTop")}
			tabIndex={visible ? 0 : -1}
			aria-hidden={!visible}
		>
			<svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
				<path d="M12 19V5M12 5l-7 7M12 5l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</button>
	);
}
