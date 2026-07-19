import Background from "@/components/Background";
import BlogPageContent from "@/components/BlogPageContent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Talk from "@/components/Talk";

export default function BlogPage() {
	return (
		<div className='wrapper'>
			<Background>
				<div className="blog_page-content">
					<Header />
					<main className="content_container privacy_policy-content">
						<h1 className="font-display numbers_gradient-text mb-20 md:mb-32">Our blog</h1>
						<BlogPageContent />
					</main>
					<Talk />
				</div>
			</Background>
			<Footer />
		</div>
	);
}