import { defineQuery } from "next-sanity";
import type { Locale } from "@/i18n/config";
import { casesItems, type CasesCardProps } from "@/data/cases";
import { sanityClient } from "./client";

export type SanityCaseStudy = CasesCardProps & {
	language: Locale;
	publishedAt: string | null;
	isFeatured: boolean;
	metaTitle?: string;
	metaDescription?: string;
	ogImageUrl?: string;
	noindex?: boolean;
};

const caseProjection = `
	"id": slug.current,
	"documentId": _id,
	language,
	"company_name": companyName,
	"company_logo": companyLogo.asset->url,
	"company_logo_alt": companyLogo.alt,
	"case_title": title,
	problem,
	fix,
	work,
	triumph,
	"type": channel,
	"steps": count(steps),
	"steps_items": steps[]{title, description},
	results[]{title, value},
	publishedAt,
	isFeatured,
	metaTitle,
	metaDescription,
	"ogImageUrl": ogImage.asset->url,
	noindex
`;

const casesQuery = defineQuery(`
	*[
		_type == "caseStudy" &&
		language == $language &&
		((status == "published" && (!defined(publishedAt) || publishedAt <= now())) ||
		(status == "scheduled" && defined(publishedAt) && publishedAt <= now())) &&
		defined(slug.current)
	] | order(isFeatured desc, publishedAt desc) {
		${caseProjection}
	}
`);

const caseQuery = defineQuery(`
	*[
		_type == "caseStudy" &&
		language == $language &&
		((status == "published" && (!defined(publishedAt) || publishedAt <= now())) ||
		(status == "scheduled" && defined(publishedAt) && publishedAt <= now())) &&
		slug.current == $slug
	][0] {
		${caseProjection}
	}
`);

const caseSlugsQuery = defineQuery(`
	*[_type == "caseStudy" && ((status == "published" && (!defined(publishedAt) || publishedAt <= now())) ||
	(status == "scheduled" && defined(publishedAt) && publishedAt <= now())) && defined(slug.current)]{
		language,
		"id": slug.current
	}
`);

const fallbackCases = (language: Locale): SanityCaseStudy[] => casesItems.map((item) => ({
	...item,
	language,
	publishedAt: null,
	isFeatured: false,
}));

export async function getCaseStudies(language: Locale): Promise<SanityCaseStudy[]> {
	const items = await sanityClient.fetch<SanityCaseStudy[]>(
		casesQuery,
		{ language },
		{ next: { revalidate: 60, tags: ["case-studies"] } },
	);
	return items.length > 0 ? items : fallbackCases(language);
}

export async function getCaseStudy(language: Locale, slug: string): Promise<SanityCaseStudy | null> {
	const item = await sanityClient.fetch<SanityCaseStudy | null>(
		caseQuery,
		{ language, slug },
		{ next: { revalidate: 60, tags: ["case-studies", `case-study:${slug}`] } },
	);
	if (item) return item;

	const fallback = casesItems.find(({ id }) => id === slug);
	return fallback ? { ...fallback, language, publishedAt: null, isFeatured: false } : null;
}

export async function getCaseStudySlugs() {
	const sanitySlugs = await sanityClient.fetch<Array<{ language: Locale; id: string }>>(
		caseSlugsQuery,
		{},
		{ next: { revalidate: 60, tags: ["case-studies"] } },
	);
	const fallbackSlugs = (["en", "ru", "ua"] as Locale[]).flatMap((language) =>
		casesItems.map(({ id }) => ({ language, id })),
	);
	return [...sanitySlugs, ...fallbackSlugs];
}
