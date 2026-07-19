import type { CaseResult, CasesCardProps, CaseStep } from "@/data/cases";
import Background from "./Background";
import Footer from "./Footer";
import Header from "./Header";
import Talk from "./Talk";

function getFallbackSteps(item: CasesCardProps): CaseStep[] {
	return [
		{ title: "The challenge", description: item.problem },
		{ title: "The start", description: `We reviewed the current ${item.type} ads setup and identified the main opportunities for growth.` },
		{ title: "What we changed", description: item.fix },
		{ title: "Audience testing", description: item.work },
		{ title: "Optimization loop", description: "We monitored the strongest combinations, refined the setup, and scaled the winning approach." },
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
	const steps = caseItem.steps_items ?? getFallbackSteps(caseItem);
	const results = caseItem.results ?? getFallbackResults(caseItem);

	return (
		<div className="wrapper">
			<Background>
				<div className="case_page">
					<Header />
					<main className="case_page-main content_container">
						<h1 className="case_page-title font-display numbers_gradient-text">{caseItem.case_title}</h1>
						<section className="case_timeline" aria-label={`${caseItem.steps ?? steps.length} project steps`}>
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
							<h2 className="font-display">Results</h2>
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
