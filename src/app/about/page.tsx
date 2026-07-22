import AboutContent from "@/components/AboutContent";
import Cases from "@/components/Cases";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import Talk from "@/components/Talk";
import { getCaseStudies } from "@/sanity/lib/cases";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata = buildPageMetadata("en", "about", "/about");

export default async function AboutPage() {
	const cases = await getCaseStudies("en");
	return (
		<div className="wrapper">
			<AboutContent />
			<div className="section_background">
				<Cases casesItems={cases} />
				<Reviews />
				<Talk />
			</div>
			<Footer />
		</div>
	);
}
