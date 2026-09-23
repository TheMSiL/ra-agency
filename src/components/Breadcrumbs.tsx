"use client";

import { useI18n } from "@/context/I18nContext";
import { CANONICAL_ORIGIN } from "@/seo/metadata";
import LocalizedLink from "./LocalizedLink";

export type Crumb = {
	label: string;
	/** Unlocalized path, e.g. "/cases". The current page leaves it out. */
	href?: string;
};

/**
 * The trail on inner pages. Home is prepended here so call sites only describe
 * the part that differs, and every href is run through localizedPath so the
 * trail stays inside the visitor's language.
 *
 * It also emits BreadcrumbList. Search results render the trail in place of the
 * bare URL, and it is the one piece of structured data a breadcrumb earns on its
 * own — the rest of the site's markup is still a separate job.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
	const { t, localizedPath } = useI18n();
	const trail: Crumb[] = [{ label: t("nav.home"), href: "/" }, ...items];

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: trail.map((crumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: crumb.label,
			...(crumb.href ? { item: `${CANONICAL_ORIGIN}${localizedPath(crumb.href)}` } : {}),
		})),
	};

	return (
		<nav className="breadcrumbs" aria-label={t("nav.breadcrumb")}>
			<ol className="breadcrumbs_list">
				{trail.map((crumb, index) => {
					const isCurrent = index === trail.length - 1;

					return (
						<li className="breadcrumbs_item" key={`${crumb.label}-${index}`}>
							{isCurrent || !crumb.href ? (
								<span className="breadcrumbs_current" aria-current="page">
									{crumb.label}
								</span>
							) : (
								<LocalizedLink className="breadcrumbs_link" href={crumb.href}>
									{crumb.label}
								</LocalizedLink>
							)}
							{!isCurrent && (
								<span className="breadcrumbs_separator" aria-hidden="true">
									/
								</span>
							)}
						</li>
					);
				})}
			</ol>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
		</nav>
	);
}
