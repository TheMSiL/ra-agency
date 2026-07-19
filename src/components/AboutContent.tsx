"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import Header from "./Header";
import AboutPioneering from "./AboutPioneering";
import WeBuild from "./WeBuild";

export default function AboutContent() {
	const heroRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const hero = heroRef.current;
		if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const context = gsap.context(() => {
			gsap.from(".about_hero-title", {
				y: 90,
				autoAlpha: 0,
				duration: 1.05,
				ease: "power3.out",
			});
			gsap.from(".about_hero-title span", {
				y: 70,
				autoAlpha: 0,
				duration: 0.9,
				delay: 0.22,
				ease: "power3.out",
			});
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
						<h1 className="font-display numbers_gradient-text about_hero-title">ABOUT <span>US</span></h1>
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
