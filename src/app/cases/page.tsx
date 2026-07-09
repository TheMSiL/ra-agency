import CasesBrowser from "@/components/CasesBrowser";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function CasesPage() {
	return (
		<div className="wrapper">
			<Header />
			<CasesBrowser />
			<Footer />
		</div>
	);
}
