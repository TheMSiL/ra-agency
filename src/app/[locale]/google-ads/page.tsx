import Page from "../../google-ads/page";
import { hasLocale } from "@/i18n/config";
import { buildPageMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/google-ads">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "google", "/google-ads");
}

export default Page;
