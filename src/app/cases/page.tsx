import CasesBrowser from "@/components/CasesBrowser";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getCaseStudies } from "@/sanity/lib/cases";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata = buildPageMetadata("en", "cases", "/cases");

export default async function CasesPage() {
	const cases = await getCaseStudies("en");
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
