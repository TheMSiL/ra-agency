"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import Background from "./Background";

gsap.registerPlugin(ScrollTrigger);

const buildItems = [
	{
		title: "CORE EXPERTISE",
		description: "RA Agency is a performance marketing agency that helps brands scale growth through Telegram Ads, Meta Ads, Google Ads, influencer marketing, and conversion-driven funnels",
	},
	{
		title: "OUR PHILOSOPHY",
		description: "We ignore vanity metrics like clicks and impressions. Our focus is your unit economics. We design automated, data-driven acquisition systems that consistently deliver scalable, predictable revenue growth",
	},
	{
		title: "GROWTH PARTNERSHIP",
		description: "We act as an extension of your in-house team, not just a third-party vendor. You get full, real-time access to live dashboards, transparent ad accounts, and direct communication",
	},
	{
		title: "TARGET NICHES",
		description: "We work with Web3, gaming, iGaming, and digital products where success is measured not by clicks, but by real users, conversions, and revenue growth",
	},
];

export default function WeBuild() {
	const rootRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const root = rootRef.current;
		if (
			!root
			|| window.matchMedia("(prefers-reduced-motion: reduce)").matches
			|| window.matchMedia("(max-width: 900px)").matches
		) return;

		const context = gsap.context(() => {
			const items = gsap.utils.toArray<HTMLElement>(".we_build-item");

			gsap.fromTo(items,
				{ y: 38, autoAlpha: 0 },
				{
					y: 0,
					autoAlpha: 1,
					duration: 0.72,
					stagger: 0.05,
					ease: "power3.out",
					scrollTrigger: { trigger: root, start: "top 82%", once: true },
				},
			);

			gsap.fromTo(root,
				{ "--dna-shift": "-5vw" },
				{
					"--dna-shift": "5vw",
					ease: "none",
					scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 },
				},
			);

		}, root);

		return () => context.revert();
	}, []);

	return (
		<Background>
			<section className="we_build" ref={rootRef}>
				<Image className="we_build-dna" src="/dna.svg" alt="DNA double helix" width={1920} height={1373} sizes="112vw" />
				{buildItems.map((item, index) => (
					<div className={`we_build-item we_build-item--${index + 1}`} key={item.title}>
						<span className="we_build-connector" aria-hidden="true" />
						<article className={`we_build-card we_build-card--${index + 1}`}>
							<h3 className="font-display">{item.title}</h3>
							<p>{item.description}</p>
						</article>
					</div>
				))}
			</section>
		</Background>
	);
}
