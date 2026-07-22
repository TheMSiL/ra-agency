import Page from "../../telegram-ads/page";
import { hasLocale } from "@/i18n/config";
import { buildPageMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/telegram-ads">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "telegram", "/telegram-ads");
}

export default Page;
