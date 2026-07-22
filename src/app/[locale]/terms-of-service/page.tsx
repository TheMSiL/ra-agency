import LegalPage from "@/components/LegalPage";
import { termsContent } from "@/data/legal";
import { hasLocale } from "@/i18n/config";
import EnglishPage from "../../terms-of-service/page";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/terms-of-service">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "terms", "/terms-of-service");
}

export default async function Page({ params }: PageProps<"/[locale]/terms-of-service">) {
	const { locale } = await params;
	if (!hasLocale(locale)) notFound();
	return locale === "en" ? <EnglishPage /> : <LegalPage content={termsContent[locale]} />;
}
