import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { getBlogPosts } from "@/sanity/lib/blog";
import { getCaseStudies } from "@/sanity/lib/cases";
import { CANONICAL_ORIGIN, contentLanguagePaths } from "@/seo/metadata";
import type { DocumentTranslation } from "@/sanity/lib/translations";

const staticPaths = ["", "/about", "/cases", "/blog", "/contacts", "/google-ads", "/meta-ads", "/telegram-ads", "/privacy-policy", "/terms-of-service", "/cookie-policy"];
const localizedUrl = (locale: Locale, path: string) => `${CANONICAL_ORIGIN}/${locale}${path}`;

// Static pages keep the same path in every locale, so the prefix swap is valid.
const alternates = (path: string) => ({
	languages: {
		en: localizedUrl("en", path),
		ru: localizedUrl("ru", path),
		uk: localizedUrl("ua", path),
		"x-default": localizedUrl("en", path),
	},
});

// Articles and case studies do not: each translation is its own Sanity document
// with its own slug, so the alternates come from translation.metadata instead of
// the prefix swap that used to advertise 404s here.
const contentAlternates = (locale: Locale, path: string, translations?: DocumentTranslation[]) => ({
	languages: Object.fromEntries(
		Object.entries(contentLanguagePaths(locale, path, translations)).map(([key, value]) => [key, `${CANONICAL_ORIGIN}${value}`]),
	),
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const entries: MetadataRoute.Sitemap = [];

	for (const path of staticPaths) {
		for (const { code } of locales) {
			entries.push({
				url: localizedUrl(code, path),
				changeFrequency: path === "/blog" || path === "/cases" ? "weekly" : "monthly",
				priority: path === "" ? 1 : path === "/blog" || path === "/cases" ? 0.8 : 0.7,
				alternates: alternates(path),
			});
		}
	}

	for (const { code } of locales) {
		const [posts, caseStudies] = await Promise.all([getBlogPosts(code), getCaseStudies(code)]);
		for (const post of posts.filter(({ noindex }) => !noindex)) {
			const path = `/blog/${post.slug}`;
			entries.push({
				url: localizedUrl(code, path),
				lastModified: post.publishedAt ?? undefined,
				changeFrequency: "monthly",
				priority: 0.7,
				alternates: contentAlternates(code, path, post.translations),
			});
		}
		for (const item of caseStudies.filter(({ noindex }) => !noindex)) {
			const path = `/cases/${item.id}`;
			entries.push({
				url: localizedUrl(code, path),
				lastModified: item.publishedAt ?? undefined,
				changeFrequency: "monthly",
				priority: 0.7,
				alternates: contentAlternates(code, path, item.translations),
			});
		}
	}

	return entries;
}
