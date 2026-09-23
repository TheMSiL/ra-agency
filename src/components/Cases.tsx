"use client";

import { useI18n } from "@/context/I18nContext";
import type { CaseType, CasesCardProps } from "@/data/cases";
import CasesCard from "./CasesCard";
import LocalizedLink from "./LocalizedLink";

// Three cards plus the "70+ cases" tile that closes the row.
const VISIBLE_COUNT = 3;

export default function Cases({ casesItems, channel }: { casesItems: CasesCardProps[]; channel?: CaseType }) {
	const { t } = useI18n();
	// A service page should lead with its own work — Google Ads cases under
	// Google Ads. Matching cases go first and the rest top the row up, so the
	// block keeps all three cards even if a channel ever runs thin. Pages with no
	// channel of their own (home, about) keep showing the newest cases.
	const prioritized = channel
		? [
			...casesItems.filter((item) => item.type === channel),
			...casesItems.filter((item) => item.type !== channel),
		]
		: casesItems;
	// This used to be slice(0, 4) and then slice(1) further down, which skipped
	// the first case — the one the query deliberately sorts to the top as
	// featured. It never reached the block on any page.
	const visibleCases = prioritized.slice(0, VISIBLE_COUNT);

	return (
		<section className="cases_section">
			<div className="content_container">
				<div className="cases_row">
					<div className='cases_head'>
						<h2 className="numbers_gradient-text numbers_title uppercase text-left max-w-[900px]">{t("cases.title")}</h2>
						<p className="sm:text-2xl text-xl opacity-70">{t("cases.subtitle")}</p>
					</div>
				</div>
				<div className="cases_row">
					<div className="cases_bottom-items">
						{
							visibleCases.map((item) => (
								<CasesCard
									key={item.id}
									company_name={item.company_name}
									company_logo={item.company_logo}
									company_logo_alt={item.company_logo_alt}
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
						<div className="cases_other-content">
							<h3>70+</h3>
							<p>{t("cases.other")}</p>
						</div>
					</LocalizedLink>
				</div>
			</div>
		</section>
	);
}
