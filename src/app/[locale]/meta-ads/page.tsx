import Page from "../../meta-ads/page";
import { hasLocale } from "@/i18n/config";
import { buildPageMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/meta-ads">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "meta", "/meta-ads");
}

export default Page;
