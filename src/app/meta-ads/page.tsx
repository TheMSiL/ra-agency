import Hero from "@/components/Hero";
import WhatYouGet from "@/components/WhatYouGet";
import WhatWeDo from "@/components/WhatWeDo";
import Cases from "@/components/Cases";
import Reviews from "@/components/Reviews";
import Talk from "@/components/Talk";
import Footer from "@/components/Footer";
import FloatingTelegramButton from "@/components/FloatingTelegramButton";
import { getCaseStudies } from "@/sanity/lib/cases";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata = buildPageMetadata("en", "meta", "/meta-ads");

export default async function TgAdsPage() {
	const cases = await getCaseStudies("en");
	return (
		<div className="wrapper ads_page">
			<Hero type="meta" />
			<WhatYouGet />
			<WhatWeDo />
			<div className="section_background">
				<Cases casesItems={cases} />
				<Reviews />
				<Talk />
			</div>
			<Footer />
			<FloatingTelegramButton />
		</div>
	);
}
