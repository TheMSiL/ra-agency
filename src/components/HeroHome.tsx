"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

import Header from "./Header";
import Button from "./Button";

export default function HeroHome() {
	const heroRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const hero = heroRef.current;

		if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		const context = gsap.context(() => {
			const revealItems = [
				'.home_hero-image',
				'.home_hero-heading',
				'.home_hero-text',
				'.home_hero-btn',
				'.home_hero-next',
			];

			// The shared button transition otherwise trails GSAP's frame-by-frame transform.
			gsap.set('.home_hero-btn', { transition: 'none' });
			gsap.set(revealItems, { y: 72 });
			gsap.to(revealItems, {
				y: 0,
				autoAlpha: 1,
				duration: 1.05,
				ease: 'power3.out',
				onComplete: () => {
					gsap.set('.home_hero-btn', { clearProps: 'transition' });
				},
			});
		}, hero);

		return () => context.revert();
	}, []);

	return (
		<section id="home" className="home_hero" ref={heroRef}>
			<div className="home_hero-visible">
				<Header />
				<div className="content_container home_hero-container">
					<h1 className="home_hero-title" data-title="RA AGENCY">
						RA AGENCY
					</h1>
					<Image src='/hero_img.png' alt="hero_img" width={1218} height={812} loading="eager" className="home_hero-image hero_reveal" />
					<div className="home_hero-content">
						<div className="home_hero-copy">
							<h2 className="home_hero-heading hero_reveal">Performance marketing</h2>
							<p className="home_hero-text hero_reveal">We don’t buy clicks. We take minds.</p>
						</div>
						<Button title='Message us on Telegram' extra="home_hero-btn hero_reveal" />
					</div>
				</div>
			</div>
			<div className="home_hero-next-wrap">
				<div className="content_container">
					<h2 className="home_hero-next hero_reveal">What we do</h2>
				</div>
			</div>
		</section>
	);
}
