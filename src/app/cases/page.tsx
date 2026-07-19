import CasesBrowser from "@/components/CasesBrowser";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function CasesPage() {
	return (
		<div className="wrapper">
			<div className="cases_page-background section_background">
				<Header />
				<CasesBrowser />
			</div>
			<Footer />
		</div>
	);
}
