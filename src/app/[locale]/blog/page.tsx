import Background from "@/components/Background";
import BlogPageContent from "@/components/BlogPageContent";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Talk from "@/components/Talk";
import { hasLocale, translate } from "@/i18n/config";
import { getBlogPosts } from "@/sanity/lib/blog";
import { buildPageMetadata } from "@/seo/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">) {
	const { locale } = await params;
	return buildPageMetadata(hasLocale(locale) ? locale : "en", "blog", "/blog");
}

export default async function LocalizedBlogPage({ params }: PageProps<"/[locale]/blog">) {
	const { locale } = await params;
	if (!hasLocale(locale)) notFound();
	const posts = await getBlogPosts(locale);

	return (
		<div className="wrapper">
			<Background>
				<div className="blog_page-content">
					<Header />
					<main className="content_container privacy_policy-content blog_page-main">
						<h1 className="cases_page-title numbers_gradient-text">{translate(locale, "blog.title")}</h1>
						<BlogPageContent blogPosts={posts} />
					</main>
					<Talk />
				</div>
			</Background>
			<Footer />
		</div>
	);
}
