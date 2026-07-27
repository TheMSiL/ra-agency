"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useI18n } from "@/context/I18nContext";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPioneering() {
	const { t } = useI18n();
	const stats = useMemo(() => [
		{ value: "400+", title: t("numbers.cost.title"), text: t("numbers.cost.text") },
		{ value: "$11M+", title: t("numbers.users.title"), text: t("numbers.users.text") },
		{ value: "4.8×", title: t("numbers.budget.title"), text: t("numbers.budget.text") },
	], [t]);
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
				const match = stats[index].value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
				if (!match) return;
				const [, prefix, numericValue, suffix] = match;
				const decimals = numericValue.includes(".") ? numericValue.split(".")[1].length : 0;
				const target = Number(numericValue);
				const counter = { value: 0 };
				node.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;
				gsap.to(counter, { value: target, duration: 3.5, delay: index * 0.15, ease: "power2.out", scrollTrigger: { trigger: root, start: "top 72%", once: true }, onUpdate: () => { node.textContent = `${prefix}${counter.value.toFixed(decimals)}${suffix}`; } });
			});
		}, root);
		return () => context.revert();
	}, [stats]);

	return (
		<section className="overflow-hidden" ref={rootRef}>
			<div className="content_container">
				<div className="about_pioneering">
					<div className="about_pioneering-intro">
						<h2 className="font-display numbers_gradient-text">{t("about.pioneering")}</h2>
						<p>{t("about.pioneeringText")}</p>
					</div>
					<div className="about_pioneering-grid">
						{stats.map((item, index) => (
							<article className="about_pioneering-card" key={item.title}>
								<h3 className="font-display">{item.title}</h3><p>{item.text}</p>
								<strong className="numbers_gradient-text" ref={(node) => { valueRefs.current[index] = node; }}>{item.value}</strong>
							</article>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
