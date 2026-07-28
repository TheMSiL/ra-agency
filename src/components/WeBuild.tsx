"use client";

import { useI18n } from "@/context/I18nContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import Background from "./Background";

gsap.registerPlugin(ScrollTrigger);

export default function WeBuild() {
	const { t } = useI18n();
	const buildItems = [
		{ title: t("about.core.title"), description: t("about.core.text") },
		{ title: t("about.philosophy.title"), description: t("about.philosophy.text") },
		{ title: t("about.partnership.title"), description: t("about.partnership.text") },
		{ title: t("about.niches.title"), description: t("about.niches.text") },
	];
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
				<Image className="we_build-dna we_build-dna--desktop" src="/dna_new.png" alt="DNA double helix" width={1920} height={1373} sizes="112vw" />
				<Image className="we_build-dna we_build-dna--mobile" src="/dna_mob.png" alt="" width={430} height={932} sizes="100vw" aria-hidden="true" />
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
