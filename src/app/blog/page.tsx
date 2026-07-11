import BlogPage from "@/components/BlogPage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Talk from "@/components/Talk";

export default function page() {
	return (
		<div className='wrapper'>
			<div className="blog_page-content">
				<Header />
				<main className="content_container privacy_policy-content">
					<h1 className="font-display numbers_gradient-text mb-20 md:mb-32">Our blog</h1>
					<BlogPage />
				</main>
			</div>
			<Talk />
			<Footer />
		</div>
	);
}