"use client";

import { Fragment } from "react";
import { useI18n } from "@/context/I18nContext";
import type { CaseType, CasesCardProps } from "@/data/cases";
import Image from "next/image";
import LocalizedLink from "./LocalizedLink";

// Shown in the cover slot when a case has neither a cover nor a company logo.
const CHANNEL_ICONS: Record<CaseType, string> = {
	telegram: "/tg.png",
	meta: "/meta.png",
	google: "/googleAdsNew.png",
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Splits the title so the phrases picked in Sanity ("Highlighted words") can be
 * tinted. Matching is case-insensitive because titles are shown uppercase and
 * editors should not have to copy the exact casing; a phrase that is not in the
 * title is simply ignored.
 */
function highlightTitle(title: string, accents?: string[]) {
	const phrases = (accents ?? []).map((phrase) => phrase.trim()).filter(Boolean);
	if (phrases.length === 0) return title;

	const pattern = new RegExp(`(${phrases.map(escapeRegExp).join("|")})`, "gi");
	return title.split(pattern).map((part, index) =>
		index % 2 === 1 ? (
			<span className="case_tile-accent" key={index}>
				{part}
			</span>
		) : (
			<Fragment key={index}>{part}</Fragment>
		),
	);
}

export default function CasesCard({
	company_name,
	company_logo,
	company_logo_alt,
	cover_image,
	cover_image_alt,
	case_title,
	title_accents,
	problem,
	fix,
	work,
	type,
	id,
}: CasesCardProps) {
	const { t } = useI18n();
	const steps = [
		{ title: t("cases.problem"), text: problem },
		{ title: t("cases.fix"), text: fix },
		{ title: t("cases.work"), text: work },
	];

	return (
		<article className="cases_card case_tile">
			<div className={`case_tile-cover${cover_image ? "" : " case_tile-cover--empty"}`}>
				{cover_image ? (
					<Image
						className="case_tile-cover-image"
						src={cover_image}
						alt={cover_image_alt ?? ""}
						fill
						sizes="(max-width: 1050px) 100vw, (max-width: 1500px) 50vw, 500px"
					/>
				) : (
					<Image
						className="case_tile-cover-logo"
						src={company_logo ?? CHANNEL_ICONS[type]}
						alt={company_logo ? (company_logo_alt ?? company_name) : ""}
						width={96}
						height={96}
					/>
				)}
				<span className="case_tile-channel">{t(`cases.${type}`)}</span>
			</div>

			<div className="case_tile-body">
				<p className="case_tile-company">{company_name}</p>
				<h3 className="case_tile-title">{highlightTitle(case_title, title_accents)}</h3>

				<ol className="case_tile-steps">
					{steps.map((step, index) => (
						<li className="case_tile-step" key={step.title}>
							<span className="case_tile-step-index" aria-hidden="true">
								{String(index + 1).padStart(2, "0")}
							</span>
							<div>
								<p className="case_tile-step-title">{step.title}</p>
								<p className="case_tile-step-text">{step.text}</p>
							</div>
						</li>
					))}
				</ol>

				<LocalizedLink href={`/cases/${id}`} className="btn case_tile-cta" aria-label={`${t("cases.read")}: ${case_title}`}>
					{t("cases.read")}
					<svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
						<path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</LocalizedLink>
			</div>
		</article>
	);
}
