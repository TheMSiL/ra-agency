import LegalPage from "@/components/LegalPage";
import { cookieContent } from "@/data/legal";
import { hasLocale } from "@/i18n/config";
import EnglishPage from "../../cookie-policy/page";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/cookie-policy">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "cookies", "/cookie-policy");
}

export default async function Page({ params }: PageProps<"/[locale]/cookie-policy">) {
	const { locale } = await params;
	if (!hasLocale(locale)) notFound();
	return locale === "en" ? <EnglishPage /> : <LegalPage content={cookieContent[locale]} />;
}
