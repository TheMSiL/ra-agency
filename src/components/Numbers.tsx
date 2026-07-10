"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const items = [
	{
		title: '$3.54',
		subtitle: 'Average cost per user',
		description: 'Competitive cost per user with the right funnel and strategy',
	},
	{
		title: '120M+',
		subtitle: 'Users from Telegram Ads',
		description: 'A steady stream of new users from Telegram Ads for active projects every month',
	},
	{
		title: '30+',
		subtitle: 'Active clients',
		description: 'Long-term partnerships with clients, not one- time campaigns',
	},
	{
		title: '8M+',
		subtitle: 'Managed advertising budget',
		description: 'We manage advertising budgets at scale while maintaining performance control',
	},
]

export default function Numbers() {
	const [featuredItem, ...statItems] = items;
	const rootRef = useRef<HTMLElement>(null);
	const valueRefs = useRef<Array<HTMLElement | null>>([]);

	useLayoutEffect(() => {
		const root = rootRef.current;

		if (!root) {
			return;
		}

		const context = gsap.context(() => {
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

			const counters = valueRefs.current.map((node, index) => {
				const match = items[index].title.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
				if (!node || !match) return null;

				const [, prefix, numericValue, suffix] = match;
				const decimals = numericValue.includes('.') ? numericValue.split('.')[1].length : 0;
				node.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

				return { node, prefix, suffix, decimals, target: Number(numericValue), value: 0 };
			});

			if (reduceMotion) {
				valueRefs.current.forEach((node, index) => {
					if (node) node.textContent = items[index].title;
				});
				return;
			}

			ScrollTrigger.create({
				trigger: root,
				start: 'top 82%',
				onEnter: (trigger) => {
					counters.forEach((counter, index) => {
						if (!counter) return;
						gsap.to(counter, {
							value: counter.target,
							duration: 8,
							delay: index * 0.3,
							ease: 'power2.out',
							onUpdate: () => {
								counter.node.textContent = `${counter.prefix}${counter.value.toFixed(counter.decimals)}${counter.suffix}`;
							},
						});
					});
					trigger.kill();
				},
			});
		}, root);

		return () => context.revert();
	}, []);

	return (
		<section className="numbers" ref={rootRef}>
			<div className="numbers_top">
				<div className="numbers_intro">
					<h2 className="numbers_title">
						Numbers We Stand
						<span className="numbers_gradient-text block w-fit">Behind</span>
					</h2>
					<p className="numbers_intro-text">
						Every number reflects campaigns that deliver real results.
					</p>
				</div>

				<article className="numbers_card numbers_card-featured">
					<h3 className="numbers_card-title numbers_gradient-text">{featuredItem.subtitle}</h3>
					<p className="numbers_card-text">{featuredItem.description}</p>
					<strong className="numbers_value numbers_gradient-text" ref={(node) => { valueRefs.current[0] = node; }}>
						{featuredItem.title}
					</strong>
				</article>
			</div>

			<div className="numbers_grid">
				{statItems.map((item, index) => (
					<article className="numbers_card" key={item.subtitle}>
						<h3 className="numbers_card-title numbers_gradient-text">{item.subtitle}</h3>
						<p className="numbers_card-text">{item.description}</p>
						<strong className="numbers_value numbers_gradient-text" ref={(node) => { valueRefs.current[index + 1] = node; }}>
							{item.title}
						</strong>
					</article>
				))}
			</div>
		</section>
	)
}
