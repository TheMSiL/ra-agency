import type { Metadata } from "next";
import { getLocaleMeta, hasLocale, type Locale } from "@/i18n/config";
import type { DocumentTranslation } from "@/sanity/lib/translations";

export const CANONICAL_ORIGIN = "https://raagency.tech";

type SeoPage = "home" | "about" | "cases" | "blog" | "contacts" | "google" | "meta" | "telegram" | "privacy" | "terms" | "cookies";

const seoCopy: Record<Locale, Record<SeoPage, { title: string; description: string }>> = {
	en: {
		home: { title: "Performance Marketing Agency", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
		about: { title: "About RA Agency", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
		cases: { title: "Advertising Case Studies", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
		blog: { title: "Performance Marketing Blog", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
		contacts: { title: "Contact RA Agency", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
		google: { title: "Google Ads Management", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
		meta: { title: "Meta Ads Management", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
		telegram: { title: "Telegram Ads Management", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
		privacy: { title: "Privacy Policy", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
		terms: { title: "Terms of Service", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
		cookies: { title: "Cookie Policy", description: "Google Ads, Meta Ads and Telegram Ads for any niche, any GEO. Certified specialists, data-driven decisions, measurable results." },
	},
	ru: {
		home: { title: "Агентство performance-маркетинга", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
		about: { title: "О компании RA Agency", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
		cases: { title: "Кейсы рекламных кампаний", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
		blog: { title: "Блог о performance-маркетинге", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
		contacts: { title: "Связаться с RA Agency", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
		google: { title: "Настройка и ведение Google Ads", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
		meta: { title: "Настройка и ведение Meta Ads", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
		telegram: { title: "Настройка и ведение Telegram Ads", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
		privacy: { title: "Политика конфиденциальности", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
		terms: { title: "Условия использования", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
		cookies: { title: "Политика использования cookie", description: "Google Ads, Meta Ads и Telegram Ads под любую нишу, любое гео. Сертифицированные специалисты, решения на основе данных, измеримый результат." },
	},
	ua: {
		home: { title: "Агенція performance-маркетингу", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
		about: { title: "Про RA Agency", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
		cases: { title: "Кейси рекламних кампаній", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
		blog: { title: "Блог про performance-маркетинг", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
		contacts: { title: "Зв’язатися з RA Agency", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
		google: { title: "Налаштування та ведення Google Ads", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
		meta: { title: "Налаштування та ведення Meta Ads", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
		telegram: { title: "Налаштування та ведення Telegram Ads", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
		privacy: { title: "Політика конфіденційності", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
		terms: { title: "Умови використання", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
		cookies: { title: "Політика використання cookie", description: "Google Ads, Meta Ads та Telegram Ads під будь-яку нішу, будь-яке гео. Сертифіковані фахівці, рішення на основі даних, вимірюваний результат." },
	},
};

const languagePath = (locale: Locale, path: string) => `/${locale}${path === "/" ? "" : path}`;

// Without an og:image a scraper picks whatever <img> it finds first: Facebook was
// showing the decorative hero planet for the homepage and a case-study cover for
// /cases. Every page now carries a branded card rendered by /api/og instead.
// Relative here on purpose — Next resolves it against metadataBase.
// Static pages share one path across locales, so swapping the prefix is correct
// here — but only here. See contentLanguagePaths for the Sanity-backed routes.
const staticLanguagePaths = (path: string) => ({
	en: languagePath("en", path),
	ru: languagePath("ru", path),
	uk: languagePath("ua", path),
	"x-default": languagePath("en", path),
});

// Each language of an article or case study is a separate Sanity document with
// its own slug ("ton-ads-explained" vs "ton-ads-explained-ru"), so hreflang built
// by swapping the locale prefix pointed at URLs that 404. Only siblings the query
// actually resolved are safe to advertise; a document with no translations gets
// the self-reference alone rather than invented alternates.
export function contentLanguagePaths(locale: Locale, path: string, translations?: DocumentTranslation[]) {
	const section = path.slice(0, path.lastIndexOf("/"));
	const canonical = languagePath(locale, path);
	const languages: Record<string, string> = { [getLocaleMeta(locale).htmlLang]: canonical };

	// translationsProjection reads two linkage mechanisms and may report the same
	// language twice; the translation.metadata join comes first, so first wins.
	for (const { language, slug } of translations ?? []) {
		if (!slug || language === locale || !hasLocale(language)) continue;
		const key = getLocaleMeta(language).htmlLang;
		if (languages[key]) continue;
		languages[key] = languagePath(language, `${section}/${slug}`);
	}

	languages["x-default"] = languages.en ?? canonical;
	return languages;
}

const generatedOgImage = (title: string) => ({
	url: `/api/og?title=${encodeURIComponent(title)}`,
	width: 1200,
	height: 630,
	alt: title,
});

export function buildPageMetadata(locale: Locale, page: SeoPage, path: string): Metadata {
	const copy = seoCopy[locale][page];
	const canonical = languagePath(locale, path);
	const images = [generatedOgImage(copy.title)];
	return {
		title: copy.title,
		description: copy.description,
		alternates: { canonical, languages: staticLanguagePaths(path) },
		openGraph: {
			type: "website",
			siteName: "RA Agency",
			title: copy.title,
			description: copy.description,
			url: canonical,
			locale: locale === "ua" ? "uk_UA" : locale === "ru" ? "ru_RU" : "en_US",
			images,
		},
		twitter: { card: "summary_large_image", title: copy.title, description: copy.description, images },
		robots: { index: true, follow: true },
	};
}

export function buildContentMetadata({
	locale,
	path,
	title,
	description,
	image,
	noindex = false,
	translations,
}: {
	locale: Locale;
	path: string;
	title: string;
	description: string;
	image?: string;
	noindex?: boolean;
	translations?: DocumentTranslation[];
}): Metadata {
	const canonical = languagePath(locale, path);
	// A case study or article without its own cover still gets the branded card
	// rather than falling back to whatever the scraper scrapes.
	const images = [image ? { url: image } : generatedOgImage(title)];
	return {
		title,
		description,
		alternates: { canonical, languages: contentLanguagePaths(locale, path, translations) },
		openGraph: { type: "article", siteName: "RA Agency", title, description, url: canonical, images },
		twitter: { card: "summary_large_image", title, description, images },
		robots: { index: !noindex, follow: !noindex },
	};
}
