"use client";

import { useI18n } from "@/context/I18nContext";
import { useAppReady } from "@/hooks/useAppReady";
import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import AboutPioneering from "./AboutPioneering";
import Header from "./Header";
import TypewriterText from "./TypewriterText";
import WeBuild from "./WeBuild";

export default function AboutContent() {
	const { t } = useI18n();
	const aboutTitle = t("about.title");
	const lastSpace = aboutTitle.lastIndexOf(" ");
	const titleLead = lastSpace >= 0 ? aboutTitle.slice(0, lastSpace + 1) : aboutTitle;
	const titleAccent = lastSpace >= 0 ? aboutTitle.slice(lastSpace + 1) : "";
	const heroRef = useRef<HTMLDivElement>(null);
	const isAppReady = useAppReady();

	useLayoutEffect(() => {
		if (!isAppReady) return;

		const hero = heroRef.current;
		if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const context = gsap.context(() => {
			gsap.from(".about_hero-astronaut", {
				y: 70,
				autoAlpha: 0,
				duration: 1.15,
				delay: 0.3,
				ease: "power3.out",
			});
		}, hero);

		return () => context.revert();
	}, [isAppReady]);

	return (
		<div className="about_wrapper">
			<Header />
			<div className="content_container">
				<div className="about_hero" ref={heroRef}>
					<div className="about_hero-inner">
						<h1 className="font-display numbers_gradient-text about_hero-title">
							<TypewriterText text={titleLead} step={80} />
							{titleAccent && (
								<span className="about_hero-accent">
									<TypewriterText text={titleAccent} delay={titleLead.length * 80} step={80} />
								</span>
							)}
						</h1>
						<div className="btn home_hero-btn home_hero-btn-anchor about_hero-btn" aria-hidden="true" />
						<Image
							className="about_hero-astronaut"
							src="/about_hero-new.png"
							alt="Astronaut floating in space"
							width={1536}
							height={1024}
							loading="eager"
							fetchPriority="high"
							sizes="(max-width: 700px) 145vw, (max-width: 1100px) 100vw, 76vw"
						/>
					</div>
				</div>
			</div>
			<WeBuild />
			<AboutPioneering />
		</div>
	);
}
