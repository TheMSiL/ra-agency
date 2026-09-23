import { defineQuery } from "next-sanity";
import type { Locale } from "@/i18n/config";
import { casesItems, type CasesCardProps } from "@/data/cases";
import { fetchWithFallback, sanityClient } from "./client";
import { translationsProjection, type DocumentTranslation } from "./translations";

export type SanityCaseStudy = CasesCardProps & {
	language: Locale;
	publishedAt: string | null;
	isFeatured: boolean;
	metaTitle?: string;
	metaDescription?: string;
	ogImageUrl?: string;
	noindex?: boolean;
	translations?: DocumentTranslation[];
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
		${caseProjection},
		${translationsProjection}
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
		${caseProjection},
		${translationsProjection}
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
	const items = await fetchWithFallback(
		"cases",
		() =>
			sanityClient.fetch<SanityCaseStudy[]>(
				casesQuery,
				{ language },
				{ next: { revalidate: 60, tags: ["case-studies"] } },
			),
		[],
	);
	return items.length > 0 ? items : fallbackCases(language);
}

// Deliberately not wrapped in fetchWithFallback: the caller turns a null into
// notFound(), and answering a transient Sanity failure with a 404 tells crawlers
// the case is gone. Letting it throw reaches app/error.tsx, which is a 500 — the
// "come back later" the situation actually calls for.
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
	const sanitySlugs = await fetchWithFallback(
		"case slugs",
		() =>
			sanityClient.fetch<Array<{ language: Locale; id: string }>>(
				caseSlugsQuery,
				{},
				{ next: { revalidate: 60, tags: ["case-studies"] } },
			),
		[],
	);
	const fallbackSlugs = (["en", "ru", "ua"] as Locale[]).flatMap((language) =>
		casesItems.map(({ id }) => ({ language, id })),
	);
	return [...sanitySlugs, ...fallbackSlugs];
}
