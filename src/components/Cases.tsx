"use client";

import { useI18n } from "@/context/I18nContext";
import type { CasesCardProps } from "@/data/cases";
import CasesCard from "./CasesCard";
import LocalizedLink from "./LocalizedLink";

export default function Cases({ casesItems }: { casesItems: CasesCardProps[] }) {
	const { t } = useI18n();
	const visibleCases = casesItems.slice(0, 4);

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
							visibleCases.slice(1).map((item) => (
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
						<h3>70+</h3>
						<p>{t("cases.other")}</p>
					</LocalizedLink>
				</div>
			</div>
		</section>
	);
}
