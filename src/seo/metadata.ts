import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";

// TODO: Replace this value when the production domain is confirmed.
export const CANONICAL_ORIGIN = "https://example.com";

type SeoPage = "home" | "about" | "cases" | "blog" | "contacts" | "google" | "meta" | "telegram" | "privacy" | "terms" | "cookies";

const seoCopy: Record<Locale, Record<SeoPage, { title: string; description: string }>> = {
	en: {
		home: { title: "Performance Marketing Agency", description: "RA Agency builds and scales measurable acquisition systems across Telegram Ads, Meta Ads, and Google Ads." },
		about: { title: "About RA Agency", description: "Meet the performance marketing team focused on scalable growth, transparent analytics, and predictable ROI." },
		cases: { title: "Advertising Case Studies", description: "Explore real Telegram Ads, Meta Ads, and Google Ads campaigns launched and scaled by RA Agency." },
		blog: { title: "Performance Marketing Blog", description: "Practical insights about paid acquisition, campaign optimization, analytics, and scalable digital growth." },
		contacts: { title: "Contact RA Agency", description: "Discuss your growth goals and advertising project with the RA Agency performance marketing team." },
		google: { title: "Google Ads Management", description: "Google Search, YouTube, Display, and Performance Max campaigns focused on leads, sales, and measurable ROI." },
		meta: { title: "Meta Ads Management", description: "Performance campaigns for Facebook and Instagram with creative testing, funnel optimization, and scalable ROAS." },
		telegram: { title: "Telegram Ads Management", description: "Official Telegram Ads campaigns with channel research, daily optimization, and full-funnel analytics." },
		privacy: { title: "Privacy Policy", description: "Learn how RA Agency collects, uses, and protects personal information." },
		terms: { title: "Terms of Service", description: "Read the terms governing the use of the RA Agency website and services." },
		cookies: { title: "Cookie Policy", description: "Learn how RA Agency uses cookies and similar technologies on this website." },
	},
	ru: {
		home: { title: "Агентство performance-маркетинга", description: "RA Agency создаёт и масштабирует измеримые системы привлечения клиентов через Telegram Ads, Meta Ads и Google Ads." },
		about: { title: "О компании RA Agency", description: "Команда performance-маркетинга, сфокусированная на масштабируемом росте, прозрачной аналитике и прогнозируемом ROI." },
		cases: { title: "Кейсы рекламных кампаний", description: "Реальные кейсы Telegram Ads, Meta Ads и Google Ads, запущенные и масштабированные командой RA Agency." },
		blog: { title: "Блог о performance-маркетинге", description: "Практические материалы о платном трафике, оптимизации кампаний, аналитике и масштабировании бизнеса." },
		contacts: { title: "Связаться с RA Agency", description: "Обсудите цели роста и рекламный проект с командой performance-маркетинга RA Agency." },
		google: { title: "Настройка и ведение Google Ads", description: "Кампании Search, YouTube, Display и Performance Max с фокусом на лиды, продажи и измеримый ROI." },
		meta: { title: "Настройка и ведение Meta Ads", description: "Performance-реклама в Facebook и Instagram: тестирование креативов, оптимизация воронки и масштабирование ROAS." },
		telegram: { title: "Настройка и ведение Telegram Ads", description: "Официальная реклама в Telegram: исследование каналов, ежедневная оптимизация и сквозная аналитика." },
		privacy: { title: "Политика конфиденциальности", description: "Информация о сборе, использовании и защите персональных данных на сайте RA Agency." },
		terms: { title: "Условия использования", description: "Условия использования сайта и услуг RA Agency." },
		cookies: { title: "Политика использования cookie", description: "Информация об использовании cookie и похожих технологий на сайте RA Agency." },
	},
	ua: {
		home: { title: "Агенція performance-маркетингу", description: "RA Agency створює та масштабує вимірювані системи залучення клієнтів через Telegram Ads, Meta Ads і Google Ads." },
		about: { title: "Про RA Agency", description: "Команда performance-маркетингу, зосереджена на масштабованому зростанні, прозорій аналітиці та прогнозованому ROI." },
		cases: { title: "Кейси рекламних кампаній", description: "Реальні кейси Telegram Ads, Meta Ads і Google Ads, запущені та масштабовані командою RA Agency." },
		blog: { title: "Блог про performance-маркетинг", description: "Практичні матеріали про платний трафік, оптимізацію кампаній, аналітику та масштабування бізнесу." },
		contacts: { title: "Зв’язатися з RA Agency", description: "Обговоріть цілі зростання та рекламний проєкт із командою performance-маркетингу RA Agency." },
		google: { title: "Налаштування та ведення Google Ads", description: "Кампанії Search, YouTube, Display і Performance Max із фокусом на ліди, продажі та вимірюваний ROI." },
		meta: { title: "Налаштування та ведення Meta Ads", description: "Performance-реклама у Facebook та Instagram: тестування креативів, оптимізація воронки й масштабування ROAS." },
		telegram: { title: "Налаштування та ведення Telegram Ads", description: "Офіційна реклама в Telegram: дослідження каналів, щоденна оптимізація та наскрізна аналітика." },
		privacy: { title: "Політика конфіденційності", description: "Інформація про збір, використання та захист персональних даних на сайті RA Agency." },
		terms: { title: "Умови використання", description: "Умови використання сайту та послуг RA Agency." },
		cookies: { title: "Політика використання cookie", description: "Інформація про використання cookie та подібних технологій на сайті RA Agency." },
	},
};

const languagePath = (locale: Locale, path: string) => `/${locale}${path === "/" ? "" : path}`;

export function buildPageMetadata(locale: Locale, page: SeoPage, path: string): Metadata {
	const copy = seoCopy[locale][page];
	const canonical = languagePath(locale, path);
	return {
		title: copy.title,
		description: copy.description,
		alternates: {
			canonical,
			languages: {
				en: languagePath("en", path),
				ru: languagePath("ru", path),
				uk: languagePath("ua", path),
				"x-default": languagePath("en", path),
			},
		},
		openGraph: {
			type: "website",
			siteName: "RA Agency",
			title: copy.title,
			description: copy.description,
			url: canonical,
			locale: locale === "ua" ? "uk_UA" : locale === "ru" ? "ru_RU" : "en_US",
		},
		twitter: { card: "summary", title: copy.title, description: copy.description },
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
}: {
	locale: Locale;
	path: string;
	title: string;
	description: string;
	image?: string;
	noindex?: boolean;
}): Metadata {
	const canonical = languagePath(locale, path);
	const images = image ? [{ url: image }] : undefined;
	return {
		title,
		description,
		alternates: {
			canonical,
			languages: {
				en: languagePath("en", path),
				ru: languagePath("ru", path),
				uk: languagePath("ua", path),
				"x-default": languagePath("en", path),
			},
		},
		openGraph: { type: "article", siteName: "RA Agency", title, description, url: canonical, images },
		twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : undefined },
		robots: { index: !noindex, follow: !noindex },
	};
}
