"use client";

import { gsap } from "gsap";
import Image from "./VersionedImage";
import { useLayoutEffect, useRef } from "react";
import Header from "./Header";
import AboutPioneering from "./AboutPioneering";
import WeBuild from "./WeBuild";
import TypewriterText from "./TypewriterText";

export default function AboutContent() {
	const heroRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
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
	}, []);

	return (
		<div className="about_wrapper">
			<Header />
			<div className="content_container">
				<div className="about_hero" ref={heroRef}>
					<div className="about_hero-inner">
						<h1 className="font-display numbers_gradient-text about_hero-title"><TypewriterText text="ABOUT " step={80} /><span className="about_hero-accent"><TypewriterText text="US" delay={480} step={80} /></span></h1>
						<div className="about_hero-shadow about_hero-shadow--head" aria-hidden="true" />
						<div className="about_hero-shadow about_hero-shadow--foot" aria-hidden="true" />
						<Image
							className="about_hero-astronaut"
							src="/about_hero.png"
							alt="Astronaut floating in space"
							width={1536}
							height={1024}
							priority
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
