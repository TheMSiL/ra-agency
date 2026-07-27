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
import { getReviews } from "@/sanity/lib/reviews";
import { getTrustedCompanies } from "@/sanity/lib/trust";
import { buildPageMetadata } from "@/seo/metadata";
import { notFound } from "next/navigation";

const telegramService = {
	title: "TELEGRAM ADS",
	subtitle: "Effective Telegram advertising at any scale. Target audience and fast results",
	items: [
		"Analytics Setup",
		"Strategy, Funnel & KPI Setup",
		"Testing Approaches",
		"Scaling Phase",
	],
	icon: "/tg.png",
};

const metaService = {
	title: "META ADS",
	subtitle: "Turnkey Facebook & Instagram ads. Funnel building and ROAS/CPA optimization",
	items: [
		"Pixel & Conversion API Setup",
		"Campaign Strategy & KPI Setup",
		"Testing Approaches",
		"Scaling & Optimization",
	],
	icon: "/meta.png",
};

const googleService = {
	title: "Google Ads",
	subtitle: "Search, YouTube, Display & Performance Max. Capturing hot demand + remarketing",
	items: [
		"Analytics & Tracking Setup",
		"Campaign Structure & KPI Setup",
		"Testing Keywords, Audiences & Creatives",
		"Scaling Without Efficiency Loss",
	],
	icon: "/googleAdsNew.png",
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
		{
			...telegramService, subtitle: locale === "ru" ? "Эффективная реклама в Telegram любого масштаба. Целевая аудитория и быстрый результат" : locale === "ua" ? "Ефективна реклама в Telegram будь-якого масштабу. Цільова аудиторія та швидкий результат" : telegramService.subtitle,
			items: locale === "ru" ? ["Настройка аналитики", "Настройка стратегии, воронки и KPI", "Тестирование подходов", "Этап масштабирования"] : locale === "ua" ? ["Налаштування аналітики", "Налаштування стратегії, воронки та KPI", "Тестування підходів", "Етап масштабування"] : telegramService.items
		},
		{
			...metaService, subtitle: locale === "ru" ? "Реклама Facebook и Instagram под ключ. Воронки и оптимизация ROAS/CPA" : locale === "ua" ? "Реклама Facebook та Instagram під ключ. Воронки й оптимізація ROAS/CPA" : metaService.subtitle,
			items: locale === "ru" ? ["Настройка Pixel и Conversion API", "Настройка стратегии кампаний и KPI", "Тестирование подходов", "Масштабирование и оптимизация"] : locale === "ua" ? ["Налаштування Pixel і Conversion API", "Налаштування стратегії кампаній та KPI", "Тестування підходів", "Масштабування та оптимізація"] : metaService.items
		},
		{
			...googleService, subtitle: locale === "ru" ? "Поиск, YouTube, КМС и Performance Max. Горячий спрос и ремаркетинг" : locale === "ua" ? "Пошук, YouTube, КММ і Performance Max. Гарячий попит та ремаркетинг" : googleService.subtitle,
			items: locale === "ru" ? ["Настройка аналитики и отслеживания", "Настройка структуры кампаний и KPI", "Тестирование ключевых слов, аудиторий и креативов", "Масштабирование без потери эффективности"] : locale === "ua" ? ["Налаштування аналітики та відстеження", "Налаштування структури кампаній та KPI", "Тестування ключових слів, аудиторій і креативів", "Масштабування без втрати ефективності"] : googleService.items
		},
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
