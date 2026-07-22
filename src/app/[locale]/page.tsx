import Cases from "@/components/Cases";
import FloatingTelegramButton from "@/components/FloatingTelegramButton";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Numbers from "@/components/Numbers";
import Reviews from "@/components/Reviews";
import ServicesBlock from "@/components/ServicesBlock";
import Talk from "@/components/Talk";
import Trust from "@/components/Trust";
import { hasLocale } from "@/i18n/config";
import { getCaseStudies } from "@/sanity/lib/cases";
import { getTrustedCompanies } from "@/sanity/lib/trust";
import { getReviews } from "@/sanity/lib/reviews";
import { buildPageMetadata } from "@/seo/metadata";
import { notFound } from "next/navigation";

const telegramService = {
	title: "TELEGRAM ADS",
	subtitle: "Effective Telegram advertising at any scale. Target audience and fast results",
	items: [
		"Channel research & hypothesis testing",
		"Campaign setup & daily optimization",
		"Full-funnel analytics (leads, sales)",
	],
	icon: "/tg.png",
};

const metaService = {
	title: "META ADS",
	subtitle: "Turnkey Facebook & Instagram ads. Funnel building and ROAS/CPA optimization",
	items: [
		"Strategy, funnel & media plan",
		"Pixel & Conversion API setup",
		"Pixel & Conversion API setup",
		"Static, video & UGC creative testing",
	],
	icon: "/meta.png",
};

const googleService = {
	title: "Google Ads",
	subtitle: "Search, YouTube, Display & Performance Max. Capturing hot demand + remarketing",
	items: [
		"Keyword research & account structure",
		"GA4 setup & clean tracking",
		"Conversion & ROI optimization",
		"Scaling without efficiency loss",
	],
	icon: "/googleAds.png",
};

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "home", "/");
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
	const { locale } = await params;
	if (!hasLocale(locale)) notFound();
	const [cases, trustedCompanies, reviews] = await Promise.all([getCaseStudies(locale), getTrustedCompanies(locale), getReviews(locale)]);
	const localizedServices = [
		{ ...telegramService, subtitle: locale === "ru" ? "Эффективная реклама в Telegram любого масштаба. Целевая аудитория и быстрый результат" : locale === "ua" ? "Ефективна реклама в Telegram будь-якого масштабу. Цільова аудиторія та швидкий результат" : telegramService.subtitle,
			items: locale === "ru" ? ["Исследование каналов и тестирование гипотез", "Настройка кампаний и ежедневная оптимизация", "Сквозная аналитика: лиды и продажи"] : locale === "ua" ? ["Дослідження каналів і тестування гіпотез", "Налаштування кампаній і щоденна оптимізація", "Наскрізна аналітика: ліди та продажі"] : telegramService.items },
		{ ...metaService, subtitle: locale === "ru" ? "Реклама Facebook и Instagram под ключ. Воронки и оптимизация ROAS/CPA" : locale === "ua" ? "Реклама Facebook та Instagram під ключ. Воронки й оптимізація ROAS/CPA" : metaService.subtitle,
			items: locale === "ru" ? ["Стратегия, воронка и медиаплан", "Настройка Pixel и Conversion API", "Тестирование статических, видео и UGC-креативов"] : locale === "ua" ? ["Стратегія, воронка та медіаплан", "Налаштування Pixel і Conversion API", "Тестування статичних, відео та UGC-креативів"] : metaService.items },
		{ ...googleService, subtitle: locale === "ru" ? "Поиск, YouTube, КМС и Performance Max. Горячий спрос и ремаркетинг" : locale === "ua" ? "Пошук, YouTube, КММ і Performance Max. Гарячий попит та ремаркетинг" : googleService.subtitle,
			items: locale === "ru" ? ["Сбор ключевых слов и структура аккаунта", "Настройка GA4 и чистого трекинга", "Оптимизация конверсий и ROI", "Масштабирование без потери эффективности"] : locale === "ua" ? ["Збір ключових слів і структура акаунта", "Налаштування GA4 і чистого трекінгу", "Оптимізація конверсій та ROI", "Масштабування без втрати ефективності"] : googleService.items },
	];
	return (
		<div className="wrapper">
			<Hero />
			<ServicesBlock title={localizedServices[0].title} subtitle={localizedServices[0].subtitle} items={localizedServices[0].items} icon={localizedServices[0].icon} href="/telegram-ads" />
			<ServicesBlock title={localizedServices[1].title} subtitle={localizedServices[1].subtitle} items={localizedServices[1].items} icon={localizedServices[1].icon} href="/meta-ads" />
			<ServicesBlock title={localizedServices[2].title} subtitle={localizedServices[2].subtitle} items={localizedServices[2].items} icon={localizedServices[2].icon} href="/google-ads" />
			<div className="section_background">
				<Numbers />
				<Cases casesItems={cases} />
				<Trust companies={trustedCompanies} />
				<Reviews reviewsData={reviews} />
				<Talk />
			</div>
			<Footer />
			<FloatingTelegramButton />
		</div>
	);
}
