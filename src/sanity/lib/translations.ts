import type { Locale } from "@/i18n/config";

export type DocumentTranslation = {
	language: Locale;
	slug: string;
};

const isLive = (prefix: string) => `
	((${prefix}status == "published" && (!defined(${prefix}publishedAt) || ${prefix}publishedAt <= now())) ||
	(${prefix}status == "scheduled" && defined(${prefix}publishedAt) && ${prefix}publishedAt <= now()))
`;

// Resolves the sibling-language documents so hreflang can point at slugs that
// actually exist. Two linkage mechanisms are live in this dataset:
//
//  - articles are joined through @sanity/document-internationalization's
//    translation.metadata, and their slugs differ per language
//    ("ton-ads-explained" vs "ton-ads-explained-ru");
//  - case studies were imported without that join, and instead reuse one slug
//    across all three languages.
//
// Reading only the join drops hreflang for every case study; assuming the shared
// slug invents URLs that 404 for every article. So take both and let the caller
// dedupe — the same-slug arm still proves the sibling exists and is published
// rather than guessing, and the slug validators only permit a repeated slug
// between translations anyway.
//
// `^._id` resolves to the document being projected, which only holds at the top
// level of a projection. Keep this out of shared projection fragments that also
// run nested (articleProjection reuses itself for relatedArticles), where `^`
// would point at the wrong document.
export const translationsProjection = `
	"translations": coalesce(
		*[_type == "translation.metadata" && references(^._id)][0].translations[
			defined(value->slug.current) &&
			coalesce(value->noindex, false) == false &&
			${isLive("value->")}
		]{
			"language": value->language,
			"slug": value->slug.current
		},
		[]
	) + *[
		_type == ^._type &&
		_id != ^._id &&
		defined(slug.current) &&
		slug.current == ^.slug.current &&
		coalesce(noindex, false) == false &&
		${isLive("")}
	]{
		language,
		"slug": slug.current
	}
`;
