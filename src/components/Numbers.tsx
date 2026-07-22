"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useI18n } from "@/context/I18nContext";

gsap.registerPlugin(ScrollTrigger);

function AnimatedCardBorder() {
	const borderRef = useRef<HTMLSpanElement>(null);

	useLayoutEffect(() => {
		const border = borderRef.current;
		if (!border) return;

		const updateStartAngle = () => {
			const { width, height } = border.getBoundingClientRect();
			const cornerAngle = 360 - Math.atan2(width, height) * (180 / Math.PI);
			border.style.setProperty("--numbers-border-start", `${cornerAngle}deg`);
		};

		updateStartAngle();
		const resizeObserver = new ResizeObserver(updateStartAngle);
		resizeObserver.observe(border);

		return () => resizeObserver.disconnect();
	}, []);

	return <span ref={borderRef} className="numbers_card-border" aria-hidden="true" />;
}

export default function Numbers() {
	const { t } = useI18n();
	const items = useMemo(() => [
		{ title: '$3.54', subtitle: t('numbers.cost.title'), description: t('numbers.cost.text') },
		{ title: '120M+', subtitle: t('numbers.users.title'), description: t('numbers.users.text') },
		{ title: '30+', subtitle: t('numbers.clients.title'), description: t('numbers.clients.text') },
		{ title: '8M+', subtitle: t('numbers.budget.title'), description: t('numbers.budget.text') },
	], [t]);
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
	}, [items]);

	return (
		<section className="numbers" ref={rootRef}>
			<div className="content_container">
				<div className="numbers_top">
					<div className="numbers_intro">
						<h2 className="numbers_title">
							{t("numbers.title")}
						</h2>
						<p className="numbers_intro-text">
							{t("numbers.intro")}
						</p>
					</div>

					<article className="numbers_card numbers_card-featured">
						<AnimatedCardBorder />
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
							<AnimatedCardBorder />
							<h3 className="numbers_card-title numbers_gradient-text">{item.subtitle}</h3>
							<p className="numbers_card-text">{item.description}</p>
							<strong className="numbers_value numbers_gradient-text" ref={(node) => { valueRefs.current[index + 1] = node; }}>
								{item.title}
							</strong>
						</article>
					))}
				</div>

			</div>
		</section>
	)
}
