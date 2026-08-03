"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import ContactModal from "@/components/ContactModal";
import { useI18n } from "@/context/I18nContext";
import { useAppReady } from "@/hooks/useAppReady";

gsap.registerPlugin(ScrollTrigger);

export default function FloatingTelegramButton() {
	const { t } = useI18n();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const isAppReady = useAppReady();

	// The morph animation is what makes the button visible, so it may only be
	// armed once we know it can run. Without an anchor to morph from — or with
	// reduced motion — the button stays a plain fixed CTA instead of vanishing.
	useLayoutEffect(() => {
		if (!isAppReady) return;

		const button = buttonRef.current;
		const heroAnchor = document.querySelector<HTMLElement>(".home_hero-btn-anchor");
		if (!button || !heroAnchor) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		button.classList.add("floating_tg_morph");

		const context = gsap.context(() => {
			const label = button.querySelector(".floating_tg_label");
			const icon = button.querySelector(".floating_tg_icon");
			const edge = () => window.innerWidth <= 560 ? 12 : window.innerWidth <= 900 ? 16 : 38;
			const size = () => window.innerWidth <= 560 ? 58 : window.innerWidth <= 900 ? 68 : 90;
			const heroRect = () => heroAnchor.getBoundingClientRect();
			const heroTop = () => heroRect().top + window.scrollY;
			const heroStyle = () => window.getComputedStyle(heroAnchor);

			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: document.documentElement,
					start: "top top-=32",
					end: "+=1",
					toggleActions: "play none none reverse",
					invalidateOnRefresh: true,
				},
			});

			timeline
				.fromTo(button, {
					autoAlpha: 1,
					left: () => heroRect().left,
					top: heroTop,
					width: () => heroRect().width,
					height: () => heroRect().height,
					borderTopLeftRadius: 6,
					borderTopRightRadius: 20,
					borderBottomRightRadius: 6,
					borderBottomLeftRadius: 20,
					borderWidth: () => heroStyle().borderWidth,
					fontSize: () => heroStyle().fontSize,
					fontFamily: () => heroStyle().fontFamily,
					fontWeight: () => heroStyle().fontWeight,
					lineHeight: () => heroStyle().lineHeight,
					letterSpacing: () => heroStyle().letterSpacing,
				}, {
					left: () => window.innerWidth - edge() - size(),
					top: () => window.innerHeight - edge() - size(),
					width: size,
					height: size,
					borderWidth: 2.282,
					borderTopLeftRadius: () => size() / 2,
					borderTopRightRadius: () => size() / 2,
					borderBottomRightRadius: () => size() / 2,
					borderBottomLeftRadius: () => size() / 2,
					ease: "power3.inOut",
					duration: 0.42,
				}, 0)
				.fromTo(label, { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 0.9, ease: "power2.in", duration: 0.14 }, 0.02)
				.fromTo(icon, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 0.16 }, 0.22);

			return () => {
				timeline.scrollTrigger?.kill();
				timeline.kill();
			};
		}, button);

		return () => {
			context.revert();
			button.classList.remove("floating_tg_morph");
		};
	}, [isAppReady]);

	return (
		<>
			<button ref={buttonRef} className="floating_tg_btn" type="button" aria-label={t("common.message")} onClick={() => setIsFormOpen(true)}>
				<span className="floating_tg_label">{t("common.message")}</span>
				<span className="floating_tg_icon-wrap" aria-hidden="true">
					<Image className="floating_tg_icon" src="/tg_btn.svg" alt="" width={52} height={41} fetchPriority="high" loading="eager" />
				</span>
			</button>
			<ContactModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
		</>
	);
}
