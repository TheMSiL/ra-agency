"use client";

import { useI18n } from "@/context/I18nContext";
import type { CasesCardProps } from "@/data/cases";
import Image from "next/image";
import LocalizedLink from "./LocalizedLink";

export default function CasesCard({ company_name, company_logo, company_logo_alt, case_title, problem, fix, work, triumph, type, id }: CasesCardProps) {
	const { t } = useI18n();
	return (
		<div className="cases_card overflow-hidden cases_block">
			<Image className="absolute bottom-0 right-0 pointer-events-none sm:block hidden" src='/cases_card-bg.png' alt="bg" width={500} height={500} />
			<div className="cases_card-type cases_block">
				<p>{type} </p>ads
			</div>
			<div className="cases_card-main">
				<div className="cases_card-main--company">
					<Image width={40} height={40} src={company_logo} alt={company_logo_alt ?? company_name} />
					<p>{company_name}</p>
				</div>
				<h4 className="cases_card-main--title numbers_gradient-text">
					{case_title}
				</h4>
			</div>
			<div className="cases_card-info">
				<div className="cases_card-info--items">
					<div className="cases_card-info--item cases_block">
						<p className="cases_card-info--item-title">{t("cases.problem")}</p>
						<p className="cases_card-info--item-desc">{problem}</p>
					</div>
					<div className="cases_card-info--item cases_block">
						<p className="cases_card-info--item-title">{t("cases.fix")}</p>
						<p className="cases_card-info--item-desc">{fix}</p>
					</div>
					<div className="cases_card-info--item cases_block">
						<p className="cases_card-info--item-title">{t("cases.work")}</p>
						<p className="cases_card-info--item-desc">{work}</p>
					</div>
					<div className="cases_card-info--item cases_block">
						<p className="cases_card-info--item-title">{t("cases.triumph")}</p>
						<p className="cases_card-info--item-desc">{triumph}</p>
					</div>
				</div>
				<LocalizedLink href={`/cases/${id}`} className="cases_card-info--item cases_card-arrow cases_block" aria-label={`${t("cases.read")}: ${case_title}`}>
					<Image className="cases_card-arrow-image" src="/cases_card-arrow.png" alt="" width={31} height={45} />
					<span className="cases_card-read-more" aria-hidden="true">
						READ<br />{" "}MORE
					</span>
				</LocalizedLink>
			</div>
		</div>
	);
}
