"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import { useI18n } from "@/context/I18nContext";
import type { CaseResult, CasesCardProps, CaseStep } from "@/data/cases";
import Background from "./Background";
import Footer from "./Footer";
import Header from "./Header";
import Talk from "./Talk";

gsap.registerPlugin(ScrollTrigger);

function getFallbackSteps(item: CasesCardProps): CaseStep[] {
	return [
		{ title: "The challenge", description: item.problem },
		{ title: "The start", description: `We reviewed the current ${item.type} ads setup and identified the main opportunities for growth.` },
		{ title: "What we changed", description: item.fix },
		{ title: "Audience testing", description: item.work },
		{ title: "Optimization loop", description: "We monitored the strongest combinations, refined the setup and scaled the winning approach." },
	];
}

function getFallbackResults(item: CasesCardProps): CaseResult[] {
	return [
		{ title: "The result", value: item.triumph },
		{ title: "Campaign type", value: `${item.type} ads` },
		{ title: "Work completed", value: item.work },
	];
}

export default function CaseDetails({ caseItem }: { caseItem: CasesCardProps }) {
	const { t } = useI18n();
	const steps = caseItem.steps_items ?? getFallbackSteps(caseItem);
	const results = caseItem.results ?? getFallbackResults(caseItem);
	const timelineRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const timeline = timelineRef.current;
		if (!timeline) return;

		const context = gsap.context(() => {
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				gsap.set(timeline, { "--case-line-progress": 1 });
				return;
			}

			gsap.fromTo(
				timeline,
				{ "--case-line-progress": 0 },
				{
					"--case-line-progress": 1,
					ease: "none",
					scrollTrigger: {
						trigger: timeline,
						start: "top 68%",
						end: "bottom 58%",
						scrub: 0.35,
					},
				},
			);

			gsap.utils.toArray<HTMLElement>(".case_step", timeline).forEach((step, index) => {
				const card = step.querySelector<HTMLElement>(".case_step-card");
				const number = step.querySelector<HTMLElement>(".case_step-number");
				if (!card || !number) return;

				const isMobile = window.matchMedia("(max-width: 768px)").matches;
				const fromLine = isMobile ? -48 : index % 2 === 0 ? 72 : -72;
				gsap.from(card, {
					x: fromLine,
					autoAlpha: 0,
					scale: 0.96,
					duration: 0.8,
					ease: "power3.out",
					scrollTrigger: {
						trigger: step,
						start: "top 82%",
						once: true,
					},
				});
				gsap.from(number, {
					autoAlpha: 0,
					scale: 0.45,
					duration: 0.5,
					ease: "back.out(1.8)",
					scrollTrigger: {
						trigger: step,
						start: "top 82%",
						once: true,
					},
				});
			});
		}, timeline);

		return () => context.revert();
	}, [steps]);

	return (
		<div className="wrapper">
			<Background>
				<div className="case_page">
					<Header />
					<main className="case_page-main content_container">
						<h1 className="case_page-title font-display numbers_gradient-text">{caseItem.case_title}</h1>
						<section ref={timelineRef} className="case_timeline" aria-label={`${caseItem.steps ?? steps.length} project steps`}>
							{steps.map((step, index) => (
								<article className="case_step" key={`${step.title}-${index}`}>
									<div className="case_step-card">
										<h2 className="font-display">{step.title}</h2>
										<p>{step.description}</p>
									</div>
									<span className="case_step-number" aria-hidden="true">[{index + 1}]</span>
								</article>
							))}
						</section>
						<section className="case_results">
							<h2 className="font-display">{t("cases.results")}</h2>
							<div className="case_results-grid">
								{results.map((result) => (
									<article className="case_result-card" key={result.title}>
										<h3 className="numbers_gradient-text">{result.title}</h3>
										<p className="font-display numbers_gradient-text">{result.value}</p>
									</article>
								))}
							</div>
						</section>
					</main>
					<Talk />
				</div>
			</Background>
			<Footer />
		</div>
	);
}
