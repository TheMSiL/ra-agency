import { casesItems } from "@/data/cases";
import CasesCard from "./CasesCard";
import LocalizedLink from "./LocalizedLink";

export default function Cases() {
	const visibleCases = casesItems.slice(0, 4);

	return (
		<section className="cases_section">
			<div className="content_container">
				<div className="cases_row">
					<div className='cases_head'>
						<h2 className="numbers_gradient-text numbers_title uppercase text-left max-w-[900px]">Case Studies and Success Stories</h2>
						<p className="text-2xl opacity-70">Examples of advertising campaigns we launched and scaled for our clients</p>
					</div>
				</div>
				<div className="cases_row">
					<div className="cases_bottom-items">
						{
							visibleCases.slice(1).map((item) => (
								<CasesCard
									key={item.id}
									company_name={item.company_name}
									company_logo={item.company_logo}
									case_title={item.case_title}
									id={item.id}
									problem={item.problem}
									fix={item.fix}
									work={item.work}
									triumph={item.triumph}
									type={item.type}
								/>
							))
						}
					</div>
					<LocalizedLink href="/cases" className='cases_block cases_other'>
						<h3>70+</h3>
						<p>View other projects</p>
					</LocalizedLink>
				</div>
			</div>
		</section>
	);
}
