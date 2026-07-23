import AboutContent from "@/components/AboutContent";
import Cases from "@/components/Cases";
import FloatingTelegramButton from "@/components/FloatingTelegramButton";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import Talk from "@/components/Talk";
import { getCaseStudies } from "@/sanity/lib/cases";
import { getReviews } from "@/sanity/lib/reviews";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata = buildPageMetadata("en", "about", "/about");

export default async function AboutPage() {
	const [cases, reviews] = await Promise.all([getCaseStudies("en"), getReviews("en")]);
	return (
		<div className="wrapper">
			<AboutContent />
			<div className="section_background">
				<Cases casesItems={cases} />
				<Reviews reviewsData={reviews} />
				<Talk />
			</div>
			<Footer />
			<FloatingTelegramButton />
		</div>
	);
}
