import CasesBrowser from "@/components/CasesBrowser";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { hasLocale } from "@/i18n/config";
import { getCaseStudies } from "@/sanity/lib/cases";
import { buildPageMetadata } from "@/seo/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: PageProps<"/[locale]/cases">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "cases", "/cases");
}

export default async function CasesPage({ params }: PageProps<"/[locale]/cases">) {
	const { locale } = await params;
	if (!hasLocale(locale)) notFound();
	const cases = await getCaseStudies(locale);

	return (
		<div className="wrapper">
			<div className="cases_page-background section_background">
				<Header />
				<CasesBrowser casesItems={cases} />
			</div>
			<Footer />
		</div>
	);
}
