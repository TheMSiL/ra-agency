import LegalPage from "@/components/LegalPage";
import { privacyContent } from "@/data/legal";
import { hasLocale } from "@/i18n/config";
import EnglishPage from "../../privacy-policy/page";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy-policy">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "privacy", "/privacy-policy");
}

export default async function Page({ params }: PageProps<"/[locale]/privacy-policy">) {
	const { locale } = await params;
	if (!hasLocale(locale)) notFound();
	return locale === "en" ? <EnglishPage /> : <LegalPage content={privacyContent[locale]} />;
}
