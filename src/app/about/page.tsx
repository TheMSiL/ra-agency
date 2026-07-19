import AboutContent from "@/components/AboutContent";
import Cases from "@/components/Cases";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import Talk from "@/components/Talk";

export default function AboutPage() {
	return (
		<div className="wrapper">
			<AboutContent />
			<div className="section_background">
				<Cases />
				<Reviews />
				<Talk />
			</div>
			<Footer />
		</div>
	);
}