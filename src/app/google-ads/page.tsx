import Hero from "@/components/Hero";
import WhatYouGet from "@/components/WhatYouGet";
import WhatWeDo from "@/components/WhatWeDo";
import Cases from "@/components/Cases";
import Reviews from "@/components/Reviews";
import Talk from "@/components/Talk";
import Footer from "@/components/Footer";
import FloatingTelegramButton from "@/components/FloatingTelegramButton";
import { getCaseStudies } from "@/sanity/lib/cases";
import { getReviews } from "@/sanity/lib/reviews";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata = buildPageMetadata("en", "google", "/google-ads");

export default async function TgAdsPage() {
	const [cases, reviews] = await Promise.all([getCaseStudies("en"), getReviews("en")]);
	return (
		<div className="wrapper ads_page">
			<Hero type="google" />
			<WhatYouGet variant="google" />
			<WhatWeDo variant="google" />
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
