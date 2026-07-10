"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

import Button from "./Button";
import Header from "./Header";

export default function SubHero({ type }: { type: string }) {
	const heroRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const hero = heroRef.current;

		if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		const context = gsap.context(() => {
			const revealItems = ['.tg_hero-image', '.home_hero-text', '.home_hero-btn'];
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
		<section id="tg_home" className="home_hero tg_hero" ref={heroRef}>
			<div className="home_hero-visible">
				<Header />
				<div className="content_container home_hero-container">
					<h1 className="home_hero-title sub_hero-title" data-title={type === 'tg' ? 'Telegram ads' : type === 'google' ? 'Google ads' : 'Meta ads'}>
						{type === 'tg' ? 'Telegram ads' : type === 'google' ? 'Google ads' : 'Meta ads'}
					</h1>
					<Image src={
						type === 'tg' ? '/tg_hero.png' : type === 'google' ? '/google_hero.png' : '/meta_hero.png'	
					} alt="hero_img" width={1018} height={679} loading="eager" className="tg_hero-image hero_reveal" />
					<div className="home_hero-content !z-[1000]">
						<p className="home_hero-text max-w-[650px] opacity-80 hero_reveal">We launch, optimize, and scale official Telegram Ads with a laser focus on hard metrics. No vanity metrics — only verified signups, active deposits, and player purchases.</p>
						<Button title='Message us on Telegram' extra="home_hero-btn hero_reveal" />
					</div>
				</div>
			</div>
		</section>
	);
}
