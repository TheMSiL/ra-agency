import Background from "@/components/Background";
import BlogPageContent from "@/components/BlogPageContent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Talk from "@/components/Talk";
import { getBlogPosts } from "@/sanity/lib/blog";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata = buildPageMetadata("en", "blog", "/blog");

export default async function BlogPage() {
	const posts = await getBlogPosts("en");
	return (
		<div className='wrapper'>
			<Background>
				<div className="blog_page-content">
					<Header />
					<main className="content_container privacy_policy-content blog_page-main">
						<h1 className="cases_page-title numbers_gradient-text">Our blog</h1>
						<BlogPageContent blogPosts={posts} />
					</main>
					<Talk />
				</div>
			</Background>
			<Footer />
		</div>
	);
}
