"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
	{ value: "120M+", title: "Users from Telegram Ads", text: "A steady stream of new users from Telegram Ads for active projects every month" },
	{ value: "30+", title: "Active clients", text: "Long-term partnerships with clients, not one-time campaigns" },
	{ value: "8M+", title: "Managed advertising budget", text: "We manage advertising budgets at scale while maintaining performance control" },
];

export default function AboutPioneering() {
	const rootRef = useRef<HTMLElement>(null);
	const valueRefs = useRef<Array<HTMLElement | null>>([]);

	useLayoutEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		const context = gsap.context(() => {
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
			gsap.from(".about_pioneering-intro > *", { y: 48, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: root, start: "top 78%", once: true } });
			gsap.from(".about_pioneering-card", { y: 56, autoAlpha: 0, duration: 0.85, stagger: 0.16, ease: "power3.out", scrollTrigger: { trigger: ".about_pioneering-grid", start: "top 85%", once: true } });
			valueRefs.current.forEach((node, index) => {
				if (!node) return;
				const suffix = stats[index].value.replace(/^\d+/, "");
				const target = Number(stats[index].value.match(/\d+/)?.[0] ?? 0);
				const counter = { value: 0 };
				node.textContent = `0${suffix}`;
				gsap.to(counter, { value: target, duration: 3.5, delay: index * 0.15, ease: "power2.out", scrollTrigger: { trigger: root, start: "top 72%", once: true }, onUpdate: () => { node.textContent = `${Math.round(counter.value)}${suffix}`; } });
			});
		}, root);
		return () => context.revert();
	}, []);

	return (
		<section className="about_pioneering" ref={rootRef}>
			<div className="about_pioneering-intro">
				<h2 className="font-display numbers_gradient-text">Pioneering the digital<span>space since 2024</span></h2>
				<p>We are a team of performance marketers, strategists, and growth specialists focused on scalable growth.<br />We analyze products, test hypotheses, launch campaigns, and optimize them based on data.<br />Every decision is built around ROI, unit economics, and long-term performance.<br />We don’t look for magic buttons — we build systems that scale.</p>
			</div>
			<div className="about_pioneering-grid">
				{stats.map((item, index) => (
					<article className="about_pioneering-card" key={item.title}>
						<h3 className="font-display">{item.title}</h3><p>{item.text}</p>
						<strong className="numbers_gradient-text" ref={(node) => { valueRefs.current[index] = node; }}>{item.value}</strong>
					</article>
				))}
			</div>
		</section>
	);
}
