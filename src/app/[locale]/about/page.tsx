import Page from "../../about/page";
import { hasLocale } from "@/i18n/config";
import { buildPageMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "about", "/about");
}

export default Page;
