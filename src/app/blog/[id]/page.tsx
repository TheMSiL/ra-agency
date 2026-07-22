import BlogArticle from "@/components/BlogArticle";
import { getBlogPost } from "@/sanity/lib/blog";
import { notFound } from "next/navigation";
import { buildContentMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/blog/[id]">) {
	const { id } = await params;
	const post = await getBlogPost("en", id);
	if (!post) return {};
	return buildContentMetadata({
		locale: "en",
		path: `/blog/${id}`,
		title: post.metaTitle || post.title,
		description: post.metaDescription || post.description,
		image: post.ogImageUrl || post.image.url,
		noindex: post.noindex,
	});
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[id]">) {
	const { id } = await params;
	const post = await getBlogPost("en", id);

	if (!post) notFound();

	return <BlogArticle post={post} />;
}
