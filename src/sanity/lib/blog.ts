import { defineQuery } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityClient } from "./client";
import { translationsProjection, type DocumentTranslation } from "./translations";
import type { Locale } from "@/i18n/config";

export type SanityBlogImage = {
	url: string;
	alt: string;
	// Set in Studio (coverImage has `hotspot: true`). Drives the CDN crop so a
	// banner is cut around what the editor marked, not around its centre.
	hotspot?: { x: number; y: number } | null;
};

export type SanityBlogPost = {
	id: string;
	slug: string;
	language: Locale;
	title: string;
	description: string;
	type: string;
	publishedAt: string | null;
	readTime: number;
	views: number;
	isFeatured: boolean;
	metaTitle?: string;
	metaDescription?: string;
	ogImageUrl?: string;
	noindex?: boolean;
	image: SanityBlogImage;
	content: PortableTextBlock[];
	author: { name: string; bio?: string; avatarUrl?: string } | null;
	relatedArticles: SanityBlogPost[];
	recommendationSource?: "manual" | "auto";
	translations?: DocumentTranslation[];
};

// Every article exists as three language documents joined by
// @sanity/document-internationalization's translation.metadata, and the view
// counter is incremented on whichever document was actually read. Reading the
// bare `views` field would therefore show three unrelated counters for what
// readers see as one article, so sum the whole translation group instead.
// Articles that carry no join (a language published on its own) fall back to
// their own count.
//
// Unlike translationsProjection this is safe to reuse in nested projections:
// `^._id` inside `*[...]` resolves to the document currently being projected,
// which is the related article rather than its parent.
export const viewsProjection = `
	"views": coalesce(
		math::sum(*[_type == "translation.metadata" && references(^._id)][0].translations[]{
			"count": coalesce(value->views, 0)
		}.count),
		coalesce(views, 0)
	)
`;

const articleProjection = `
	"id": _id,
	"slug": slug.current,
	language,
	title,
	"description": excerpt,
	"type": coalesce(category->title[$language], category->title.en, category->title.ru, category->title.ua, ""),
	publishedAt,
	readTime,
	${viewsProjection},
	isFeatured,
	metaTitle,
	metaDescription,
	"ogImageUrl": ogImage.asset->url,
	noindex,
	"image": {
		"url": coverImage.asset->url,
		"alt": coverImage.alt,
		"hotspot": coverImage.hotspot{x, y}
	},
	"content": body[]{
		...,
		_type == "image" => {"url": asset->url}
	},
	"author": author->{name, "bio": coalesce(bio[$language], bio.en, bio.ru, bio.ua), "avatarUrl": avatar.asset->url}
`;

const articlesQuery = defineQuery(`
	*[
		_type == "article" &&
		language == $language &&
		((status == "published" && (!defined(publishedAt) || publishedAt <= now())) ||
		(status == "scheduled" && defined(publishedAt) && publishedAt <= now())) &&
		defined(slug.current) &&
		defined(coverImage.asset)
	] | order(isFeatured desc, publishedAt desc) {
		${articleProjection},
		${translationsProjection}
	}
`);

const articleQuery = defineQuery(`
	*[
		_type == "article" &&
		language == $language &&
		((status == "published" && (!defined(publishedAt) || publishedAt <= now())) ||
		(status == "scheduled" && defined(publishedAt) && publishedAt <= now())) &&
		slug.current == $slug
	][0] {
		${articleProjection},
		${translationsProjection},
		"relatedArticles": relatedArticles[]->[
			((status == "published" && (!defined(publishedAt) || publishedAt <= now())) ||
			(status == "scheduled" && defined(publishedAt) && publishedAt <= now())) &&
			language == $language
		] {
			${articleProjection}
		}
	}
`);

export async function getBlogPosts(language: Locale): Promise<SanityBlogPost[]> {
	return sanityClient.fetch(articlesQuery, { language }, { next: { revalidate: 60, tags: ["articles"] } });
}

export async function getBlogPost(language: Locale, slug: string): Promise<SanityBlogPost | null> {
	const [post, posts] = await Promise.all([
		sanityClient.fetch<SanityBlogPost | null>(articleQuery, { language, slug }, { next: { revalidate: 60, tags: ["articles", `article:${slug}`] } }),
		getBlogPosts(language),
	]);

	if (!post) return null;

	const manual = (post.relatedArticles ?? []).filter(
		(article): article is SanityBlogPost => Boolean(article?.id),
	).map((article) => ({ ...article, recommendationSource: "manual" as const }));
	const manualIds = new Set(manual.map(({ id }) => id));
	const fallback = posts
		.filter(({ id }) => id !== post.id && !manualIds.has(id))
		.map((article) => ({ ...article, recommendationSource: "auto" as const }));
	return {
		...post,
		relatedArticles: [...manual, ...fallback].slice(0, 3),
	};
}
