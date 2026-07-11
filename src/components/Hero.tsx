"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

import Button from "./Button";
import Header from "./Header";

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
		text: "We capture high-intent demand across Search, YouTube, Display, and Performance Max, then turn it into measurable growth.",
		background: "/google_bg.png",
	},
};

export default function Hero({ type = "home" }: { type?: HeroType }) {
	const heroRef = useRef<HTMLElement>(null);
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
			className={`home_hero${isHome ? "" : ` tg_hero service_hero--${type}`}`}
			ref={heroRef}
			style={content ? { backgroundImage: `url(${content.background})` } : undefined}
		>
			<div className="home_hero-visible">
				<Header />
				<div className="content_container home_hero-container">
					{isHome && <h1 className="home_hero-title" data-title="RA AGENCY">RA AGENCY</h1>}
					{isHome && (
						<Image src="/hero_img.png" alt="" width={1218} height={812} loading="eager" className="home_hero-image hero_reveal" />
					)}
					{isHome ? (
						<div className="home_hero-content">
							<div className="home_hero-copy">
								<h2 className="home_hero-heading hero_reveal">Performance marketing</h2>
								<p className="home_hero-text hero_reveal">We don’t buy clicks. We take minds.</p>
							</div>
							<Button title="Message us on Telegram" extra="home_hero-btn hero_reveal" />
						</div>
					) : (
						<div className="service_hero-content">
							<h1 className="home_hero-title sub_hero-title hero_reveal" data-title={content?.title}>{content?.title}</h1>
							<div className="service_hero-bottom">
								<p className="home_hero-text opacity-80 hero_reveal">{content?.text}</p>
								<Button title="Message us on Telegram" extra="home_hero-btn hero_reveal" />
							</div>
						</div>
					)}
				</div>
			</div>
			{isHome && (
				<div className="home_hero-next-wrap">
					<div className="content_container">
						<h2 className="home_hero-next hero_reveal">What we do</h2>
					</div>
				</div>
			)}
		</section>
	);
}
