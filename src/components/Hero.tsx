"use client";

import { gsap } from "gsap";
import Image from "next/image";
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

		if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const context = gsap.context(() => {
			const revealItems = hero.querySelectorAll(".hero_reveal");
			const button = hero.querySelector(".home_hero-btn");

			gsap.set(button, { transition: "none" });
			gsap.set(revealItems, { y: 72 });
			gsap.to(revealItems, {
				y: 0,
				autoAlpha: 1,
				duration: 1.05,
				ease: "power3.out",
				onComplete: () => gsap.set(button, { clearProps: "transition" }),
			});
		}, hero);

		return () => context.revert();
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
