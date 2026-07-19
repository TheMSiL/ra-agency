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
		title: "TARGET NICHES",
		description: "We work with Web3, gaming, iGaming, and digital products where success is measured not by clicks, but by real users, conversions, and revenue growth",
	},
	{
		title: "OUR PHILOSOPHY",
		description: "We ignore vanity metrics like clicks and impressions. Our focus is your unit economics. We design automated, data-driven acquisition systems that consistently deliver scalable, predictable revenue growth",
	},
];

export default function WeBuild() {
	const rootRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const root = rootRef.current;
		if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const context = gsap.context(() => {
			const cards = gsap.utils.toArray<HTMLElement>(".we_build-card");
			const revealOrder = [cards[0], cards[2], cards[1]];
			const isVerticalScene = window.matchMedia("(max-width: 900px)").matches;

			if (window.matchMedia("(max-width: 767px)").matches) {
				gsap.from(revealOrder, {
					y: 42,
					autoAlpha: 0,
					duration: 0.75,
					stagger: 0.16,
					ease: "power3.out",
					scrollTrigger: { trigger: root, start: "top 78%", once: true },
				});
				return;
			}

			gsap.timeline({
				scrollTrigger: {
					trigger: root,
					start: "top 82%",
					end: "bottom 28%",
					scrub: 0.8,
				},
			})
				.fromTo(".we_build-dna",
					{
						x: isVerticalScene ? 0 : "-6vw",
						y: isVerticalScene ? "-3vh" : 0,
						rotation: isVerticalScene ? 52.5 : -2.5,
						scale: 1.05,
					},
					{
						x: isVerticalScene ? 0 : "6vw",
						y: isVerticalScene ? "3vh" : 0,
						rotation: isVerticalScene ? 57 : 2,
						scale: 1,
						ease: "none",
						duration: 1,
					},
					0,
				)
				.fromTo(revealOrder,
					{ y: 48, autoAlpha: 0 },
					{ y: 0, autoAlpha: 1, stagger: 0.18, duration: 0.22, ease: "power2.out" },
					0.12,
				);
		}, root);

		return () => context.revert();
	}, []);

	return (
		<Background>
			<section className="we_build" ref={rootRef}>
				<Image className="we_build-dna" src="/dnk.png" alt="DNA double helix" width={2048} height={1365} sizes="100vw" />
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
