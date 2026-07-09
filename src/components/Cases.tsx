import Link from "next/link";
import { casesItems } from "@/data/cases";
import CasesCard from "./CasesCard";

export default function Cases() {
	const visibleCases = casesItems.slice(0, 4);

	return (
		<section className="pt-20">
			<div className="content_container">
				<div className="cases_row">
					{visibleCases.slice(0, 1).map((item) => (
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
					))}

					<div className='cases_head cases_block'>
						<h2 className="numbers_gradient-text numbers_title uppercase max-w-[700px] ml-auto text-right">Case Studies and Success Stories</h2>
						<p className="text-right text-2xl opacity-70">Examples of advertising campaigns we launched and scaled for our clients</p>
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
					<Link href="/cases" className='cases_block cases_other'>
						<h3>70+</h3>
						<p>View other projects</p>
					</Link>
				</div>
			</div>
		</section>
	);
}
