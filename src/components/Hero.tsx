"use client";

import { gsap } from "gsap";
import Image from "./VersionedImage";
import { useLayoutEffect, useRef, useState } from "react";

import Button from "./Button";
import ContactModal from "./ContactModal";
import Header from "./Header";
import TypewriterText from "./TypewriterText";

type HeroType = "home" | "tg" | "meta" | "google";

const serviceContent: Record<Exclude<HeroType, "home">, { title: string; text: string; background: string }> = {
	tg: {
		title: "Telegram ads",
		text: "We launch, optimize, and scale official Telegram Ads with a laser focus on hard metrics. No vanity metrics — only verified signups, active deposits, and player purchases.",
		background: "/tg_bg.png",
	},
	meta: {
		title: "Meta ads",
		text: "We build and scale performance campaigns across Facebook and Instagram, optimizing every step of the funnel for conversions, CPA, and ROAS.",
		background: "/meta_bg.png",
	},
	google: {
		title: "Google ads",
		text: "We launch and scale Google Ads with a focus on real results — leads, purchases, and revenue growth. We work with products where the goal is not just traffic, but paying customers.",
		background: "/google_bg.png",
	},
};

export default function Hero({ type = "home" }: { type?: HeroType }) {
	const heroRef = useRef<HTMLElement>(null);
	const [isContactOpen, setIsContactOpen] = useState(false);
	const isHome = type === "home";
	const content = isHome ? null : serviceContent[type];

	useLayoutEffect(() => {
		const hero = heroRef.current;
		let updateRoiDepth: (() => void) | undefined;

		if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const context = gsap.context(() => {
			const revealItems = hero.querySelectorAll(".hero_reveal");
			const button = hero.querySelector(".home_hero-btn");
			const roiPills = Array.from(hero.querySelectorAll<HTMLElement>(".home_hero-roi-pill"));

			gsap.set(button, { transition: "none" });
			gsap.set(revealItems, { y: 72 });
			gsap.to(revealItems, {
				y: 0,
				autoAlpha: 1,
				duration: 1.05,
				ease: "power3.out",
				onComplete: () => gsap.set(button, { clearProps: "transition" }),
			});

			if (roiPills.length > 0) {
				updateRoiDepth = () => {
					const heroBox = hero.getBoundingClientRect();
					const center = heroBox.left + heroBox.width / 2;
					const depthRadius = Math.min(340, Math.max(150, heroBox.width * 0.18));

					roiPills.forEach((pill) => {
						const box = pill.getBoundingClientRect();
						const pillCenter = box.left + box.width / 2;
						const offset = pillCenter - center;
						const distance = Math.abs(offset);
						const depth = 1 - gsap.utils.clamp(0, 1, distance / depthRadius);
						const fold = Math.pow(depth, 1.45);
						const foldDirection = offset < 0 ? -1 : 1;

						gsap.set(pill, {
							scale: 1 - fold * 0.62,
							autoAlpha: 1 - fold * 0.58,
							y: fold * -28,
							z: fold * -90,
							rotationY: foldDirection * fold * 52,
							transformPerspective: 700,
						});
					});
				};

				gsap.ticker.add(updateRoiDepth);
			}
		}, hero);

		return () => {
			if (updateRoiDepth) gsap.ticker.remove(updateRoiDepth);
			context.revert();
		};
	}, []);

	return (
		<section
			id={isHome ? "home" : "tg_home"}
			className={`home_hero${isHome ? " section_background" : ` tg_hero service_hero--${type}`}`}
			ref={heroRef}
			style={content ? { backgroundImage: `url(${content.background})` } : undefined}
		>
			<div className="home_hero-visible">
				<Header />
				<div className="content_container home_hero-container">
					{isHome && <h1 className="home_hero-title typewriter_host"><TypewriterText text="RA AGENCY" step={70} /></h1>}
					{isHome && (
						<div className="home_hero-roi-marquee" aria-label="ROI or DIE">
							<div className="home_hero-roi-track" aria-hidden="true">
								{[0, 1].map((group) => (
									<div className="home_hero-roi-group" key={group}>
										{Array.from({ length: 12 }, (_, index) => (
											<span className="home_hero-roi-pill" key={`${group}-${index}`}>ROI or DIE</span>
										))}
									</div>
								))}
							</div>
						</div>
					)}
					{isHome && (
						<>
							<span className="home_hero-planet-glow" aria-hidden="true" />
							<Image src="/planet.png" alt="" width={1165} height={783} loading="eager" className="home_hero-planet" aria-hidden="true" />
							<Image src="/hero_img.png" alt="" width={1218} height={812} loading="eager" className="home_hero-image hero_reveal" />
						</>
					)}
					{isHome ? (
						<div className="home_hero-content">
							<div className="mb-5">
								<h2 className="home_hero-heading"><TypewriterText text="Performance marketing" delay={180} step={32} /></h2>
								<p className="home_hero-text"><TypewriterText text="We don’t buy clicks. We take minds." delay={420} step={20} /></p>
							</div>
							<Button title={<TypewriterText text="Message us on Telegram" delay={480} step={22} />} extra="home_hero-btn hero_reveal" onClick={() => setIsContactOpen(true)} />
						</div>
					) : (
						<div className="service_hero-content">
							<h1 className="home_hero-title sub_hero-title typewriter_host"><TypewriterText text={content?.title ?? ""} step={58} /></h1>
							<div className="service_hero-bottom">
								<p className="home_hero-text opacity-80"><TypewriterText text={content?.text ?? ""} delay={280} step={type === "google" ? 8 : 13} /></p>
								<Button title={<TypewriterText text="Message us on Telegram" delay={480} step={22} />} extra="home_hero-btn hero_reveal" onClick={() => setIsContactOpen(true)} />
							</div>
						</div>
					)}
				</div>
			</div>
			{isHome && (
				<div className="home_hero-next-wrap">
					<div className="content_container">
						<h2 className="home_hero-next"><TypewriterText text="What we do" delay={700} step={36} /></h2>
					</div>
				</div>
			)}
			<ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
		</section>
	);
}
