import Page from "../../contacts/page";
import { hasLocale } from "@/i18n/config";
import { buildPageMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/contacts">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "contacts", "/contacts");
}

export default Page;
