import Hero from "@/components/Hero";
import WhatYouGet from "@/components/WhatYouGet";
import WhatWeDo from "@/components/WhatWeDo";
import Cases from "@/components/Cases";
import Reviews from "@/components/Reviews";
import Talk from "@/components/Talk";
import Footer from "@/components/Footer";
import FloatingTelegramButton from "@/components/FloatingTelegramButton";

export default function TgAdsPage() {
	return (
		<div className="wrapper">
			<Hero type="tg" />
			<WhatYouGet />
			<WhatWeDo />
			<div className="section_background">
				<Cases />
				<Reviews />
				<Talk />
			</div>
			<Footer />
			<FloatingTelegramButton />
		</div>
	);
}
