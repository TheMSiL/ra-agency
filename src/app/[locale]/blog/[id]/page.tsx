import BlogArticle from "@/components/BlogArticle";
import { hasLocale } from "@/i18n/config";
import { getBlogPost } from "@/sanity/lib/blog";
import { notFound } from "next/navigation";
import { buildContentMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[id]">) {
	const { locale, id } = await params;
	if (!hasLocale(locale)) return {};
	const post = await getBlogPost(locale, id);
	if (!post) return {};
	return buildContentMetadata({
		locale,
		path: `/blog/${id}`,
		title: post.metaTitle || post.title,
		description: post.metaDescription || post.description,
		image: post.ogImageUrl || post.image.url,
		noindex: post.noindex,
		translations: post.translations,
	});
}

export default async function LocalizedBlogPostPage({ params }: PageProps<"/[locale]/blog/[id]">) {
	const { locale, id } = await params;
	if (!hasLocale(locale)) notFound();
	const post = await getBlogPost(locale, id);
	if (!post) notFound();

	return <BlogArticle post={post} />;
}
