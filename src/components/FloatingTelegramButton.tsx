"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import ContactModal from "@/components/ContactModal";

gsap.registerPlugin(ScrollTrigger);

export default function FloatingTelegramButton() {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useLayoutEffect(() => {
		const button = buttonRef.current;
		const heroButton = document.querySelector<HTMLElement>(".home_hero-btn");
		if (!button || !heroButton) return;

		const context = gsap.context(() => {
			const label = button.querySelector(".floating_tg_label");
			const icon = button.querySelector(".floating_tg_icon");
			const getHeroRect = () => heroButton.getBoundingClientRect();
			const getHeroStyle = () => window.getComputedStyle(heroButton);
			const edge = () => window.innerWidth <= 560 ? 12 : window.innerWidth <= 900 ? 16 : 38;
			const size = () => window.innerWidth <= 560 ? 58 : window.innerWidth <= 900 ? 68 : 90;
			const morphEase = gsap.parseEase("power2.inOut");

			gsap.set(button, { autoAlpha: 0 });
			gsap.set(icon, { autoAlpha: 0, scale: 0.55 });

			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: document.documentElement,
					start: "top top-=2",
					end: "+=1",
					toggleActions: "play none none reverse",
					invalidateOnRefresh: true,
					onEnter: () => {
						const rect = getHeroRect();
						gsap.set(button, {
							autoAlpha: 1,
							left: rect.left,
							top: rect.top,
							width: rect.width,
							height: rect.height,
							borderRadius: getHeroStyle().borderRadius,
							borderWidth: getHeroStyle().borderWidth,
						});
						gsap.set(heroButton, { autoAlpha: 0, transition: "none" });
					},
				},
			});

			timeline
				.to(button, {
					left: () => window.innerWidth - edge() - size(),
					top: () => window.innerHeight - edge() - size(),
					width: size,
					height: size,
					borderWidth: 2.282,
					ease: "power2.inOut",
					duration: 1.2,
				}, 0)
				.to(label, { autoAlpha: 0, scale: 0.88, duration: 0.48 }, 0.12)
				.to(icon, { autoAlpha: 1, scale: 1, duration: 0.52 }, 0.58);

			timeline.eventCallback("onUpdate", () => {
				if (timeline.reversed()) {
					const progress = morphEase(timeline.progress());
					const rect = getHeroRect();
					const floatingLeft = window.innerWidth - edge() - size();
					const floatingTop = window.innerHeight - edge() - size();
					gsap.set(button, {
						left: rect.left + (floatingLeft - rect.left) * progress,
						top: rect.top + (floatingTop - rect.top) * progress,
					});
				}

				const buttonRect = button.getBoundingClientRect();
				const aspectRatio = buttonRect.width / buttonRect.height;
				const roundProgress = gsap.utils.clamp(0, 1, (1.3 - aspectRatio) / 0.3);
				const circleRadius = buttonRect.height / 2;
				const smallCorner = 6 + (circleRadius - 6) * roundProgress;
				const largeCorner = 20 + (circleRadius - 20) * roundProgress;

				gsap.set(button, {
					borderRadius: `${smallCorner}px ${largeCorner}px ${smallCorner}px ${largeCorner}px`,
				});
			});

			timeline.eventCallback("onReverseComplete", () => {
				gsap.set(heroButton, {
					autoAlpha: 1,
					transition: "border-radius 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
				});
				gsap.set(button, { autoAlpha: 0 });
			});

			return () => timeline.kill();
		}, button);

		return () => {
			context.revert();
			gsap.set(heroButton, { clearProps: "opacity,visibility,transition" });
		};
	}, []);

	return (
		<>
			<button ref={buttonRef} className="floating_tg_btn floating_tg_morph" type="button" aria-label="Open contact form" onClick={() => setIsFormOpen(true)}>
				<span className="floating_tg_label">Message us on Telegram</span>
				<span className="floating_tg_icon-wrap" aria-hidden="true">
					<Image className="floating_tg_icon" src="/tg_btn.svg" alt="" width={52} height={41} priority />
				</span>
			</button>
			<ContactModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
		</>
	);
}
