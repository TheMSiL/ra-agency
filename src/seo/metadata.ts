import type { Metadata } from "next";
import { getLocaleMeta, hasLocale, type Locale } from "@/i18n/config";
import type { DocumentTranslation } from "@/sanity/lib/translations";

export const CANONICAL_ORIGIN = "https://raagency.tech";

type SeoPage = "home" | "about" | "cases" | "blog" | "contacts" | "google" | "meta" | "telegram" | "privacy" | "terms" | "cookies";

const seoCopy: Record<Locale, Record<SeoPage, { title: string; description: string }>> = {
	en: {
		home: { title: "Performance Marketing Agency", description: "RA Agency runs Google Ads, Meta Ads and Telegram Ads for any niche and GEO. Certified specialists, campaigns built around CPA, ROAS and revenue." },
		about: { title: "About RA Agency", description: "Meet RA Agency, a team of certified performance marketers. How we work, what we optimise for and why we judge campaigns by revenue, not clicks." },
		cases: { title: "Advertising Case Studies", description: "Google Ads, Meta Ads and Telegram Ads campaigns we have run: the niche, the GEO, what we changed and the results in CPA, ROAS and revenue." },
		blog: { title: "Performance Marketing Blog", description: "Practical articles on Google Ads, Meta Ads and Telegram Ads: tracking, campaign setup, testing and scaling, written by the RA Agency team." },
		contacts: { title: "Contact RA Agency", description: "Contact RA Agency: send a request on the site, message us on Telegram or email the team. Tell us about your project and ad budget." },
		google: { title: "Google Ads Management", description: "Certified Google Ads management across Search, Shopping, YouTube and Performance Max, built around conversions, ROAS and profitable growth." },
		meta: { title: "Meta Ads Management", description: "Certified Meta Ads management for Facebook and Instagram: Pixel and Conversions API, creatives and audiences, optimised for ROAS and CAC." },
		telegram: { title: "Telegram Ads Management", description: "Telegram Ads campaigns built, optimised and scaled for business metrics: leads, CPA, deposits, purchases and ROAS, not clicks or impressions." },
		privacy: { title: "Privacy Policy", description: "How RA Agency collects, uses and protects the personal data you share through raagency.tech, and the rights you have over it." },
		terms: { title: "Terms of Service", description: "The terms that govern your use of raagency.tech and of the services RA Agency provides through it." },
		cookies: { title: "Cookie Policy", description: "Which cookies raagency.tech uses, which analytics and advertising tools set them, and how to change your consent at any time." },
	},
	ru: {
		home: { title: "Агентство performance-маркетинга", description: "RA Agency ведёт Google Ads, Meta Ads и Telegram Ads под любую нишу и гео. Сертифицированные специалисты, кампании под CPA, ROAS и выручку." },
		about: { title: "О компании RA Agency", description: "Знакомьтесь с RA Agency: команда сертифицированных performance-маркетологов. Как мы работаем и почему оцениваем рекламу по выручке, а не кликам." },
		cases: { title: "Кейсы рекламных кампаний", description: "Кампании в Google Ads, Meta Ads и Telegram Ads, которые мы вели: ниша, гео, что изменили и какой результат получили по CPA, ROAS и выручке." },
		blog: { title: "Блог о performance-маркетинге", description: "Практичные статьи о Google Ads, Meta Ads и Telegram Ads: аналитика, настройка кампаний, тестирование и масштабирование от команды RA Agency." },
		contacts: { title: "Связаться с RA Agency", description: "Свяжитесь с RA Agency: оставьте заявку на сайте, напишите нам в Telegram или на почту. Расскажите о проекте и рекламном бюджете." },
		google: { title: "Настройка и ведение Google Ads", description: "Сертифицированное ведение Google Ads: Поиск, Shopping, YouTube и Performance Max. Работаем на конверсии, ROAS и прибыльный рост." },
		meta: { title: "Настройка и ведение Meta Ads", description: "Сертифицированное ведение Meta Ads в Facebook и Instagram: Pixel и Conversions API, креативы и аудитории, оптимизация под ROAS и CAC." },
		telegram: { title: "Настройка и ведение Telegram Ads", description: "Запускаем, оптимизируем и масштабируем Telegram Ads под бизнес-метрики: заявки, CPA, депозиты, покупки и ROAS, а не клики и показы." },
		privacy: { title: "Политика конфиденциальности", description: "Как RA Agency собирает, использует и защищает персональные данные, которые вы передаёте через raagency.tech, и какие у вас есть права." },
		terms: { title: "Условия использования", description: "Условия использования сайта raagency.tech и услуг, которые RA Agency предоставляет через него." },
		cookies: { title: "Политика использования cookie", description: "Какие cookie использует raagency.tech, какие сервисы аналитики и рекламы их устанавливают и как в любой момент изменить согласие." },
	},
	ua: {
		home: { title: "Агенція performance-маркетингу", description: "RA Agency веде Google Ads, Meta Ads і Telegram Ads під будь-яку нішу та гео. Сертифіковані фахівці, кампанії під CPA, ROAS і виручку." },
		about: { title: "Про RA Agency", description: "Знайомтеся з RA Agency: команда сертифікованих performance-маркетологів. Як ми працюємо і чому оцінюємо рекламу за виручкою, а не кліками." },
		cases: { title: "Кейси рекламних кампаній", description: "Кампанії в Google Ads, Meta Ads і Telegram Ads, які ми вели: ніша, гео, що змінили та який результат отримали за CPA, ROAS і виручкою." },
		blog: { title: "Блог про performance-маркетинг", description: "Практичні статті про Google Ads, Meta Ads і Telegram Ads: аналітика, налаштування кампаній, тестування та масштабування від команди RA Agency." },
		contacts: { title: "Зв’язатися з RA Agency", description: "Зв’яжіться з RA Agency: залиште заявку на сайті, напишіть нам у Telegram або на пошту. Розкажіть про проєкт і рекламний бюджет." },
		google: { title: "Налаштування та ведення Google Ads", description: "Сертифіковане ведення Google Ads: Пошук, Shopping, YouTube і Performance Max. Працюємо на конверсії, ROAS і прибуткове зростання." },
		meta: { title: "Налаштування та ведення Meta Ads", description: "Сертифіковане ведення Meta Ads у Facebook та Instagram: Pixel і Conversions API, креативи та аудиторії, оптимізація під ROAS і CAC." },
		telegram: { title: "Налаштування та ведення Telegram Ads", description: "Запускаємо, оптимізуємо та масштабуємо Telegram Ads під бізнес-метрики: заявки, CPA, депозити, покупки та ROAS, а не кліки й покази." },
		privacy: { title: "Політика конфіденційності", description: "Як RA Agency збирає, використовує та захищає персональні дані, які ви передаєте через raagency.tech, і які у вас є права." },
		terms: { title: "Умови використання", description: "Умови використання сайту raagency.tech і послуг, які RA Agency надає через нього." },
		cookies: { title: "Політика використання cookie", description: "Які cookie використовує raagency.tech, які сервіси аналітики й реклами їх встановлюють і як будь-коли змінити згоду." },
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
