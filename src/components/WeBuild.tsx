"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const buildItems = [
	{
		title: 'CORE EXPERTISE',
		description: 'RA Agency is a performance marketing agency that helps brands scale growth through Telegram Ads, Meta Ads, Google Ads, influencer marketing, and conversion-driven funnels'
	},
	{
		title: 'TARGET NICHES',
		description: 'We work with Web3, gaming, iGaming, and digital products where success is measured not by clicks, but by real users, conversions, and revenue growth'
	},
	{
		title: 'OUR PHILOSOPHY',
		description: 'We ignore vanity metrics like clicks and impressions. Our focus is your unit economics. We design automated, data-driven acquisition systems that consistently deliver scalable, predictable revenue growth'
	}
]

export default function WeBuild() {
	const rootRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const root = rootRef.current;
		if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const context = gsap.context(() => {
			const timeline = gsap.timeline({
				scrollTrigger: {
					trigger: root,
					start: "top 72%",
					once: true,
				},
			});

			timeline
				.from(".we_build-card", {
					y: 54,
					autoAlpha: 0,
					duration: 0.75,
					stagger: 0.22,
					ease: "power3.out",
				})
				.from(".we_build-title", {
					y: 44,
					autoAlpha: 0,
					duration: 0.85,
					ease: "power3.out",
				}, "-=0.45");
		}, root);

		return () => context.revert();
	}, []);

	return (
		<section className="we_build" ref={rootRef}>
			<h2 className="we_build-title numbers_gradient-text font-display">WE DON’T RUN ADS.<span>WE BUILD SYSTEMS</span></h2>
			{buildItems.map((item, index) => (
				<article className={`we_build-card we_build-card--${index + 1}`} key={item.title}>
					<h3 className="font-display">{item.title}</h3>
					<p>{item.description}</p>
				</article>
			))}
		</section>
	);
}
