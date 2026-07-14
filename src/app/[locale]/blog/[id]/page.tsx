import BlogArticle from "@/components/BlogArticle";
import { blogPosts, getBlogPost } from "@/data/blogs";
import { locales } from "@/i18n/config";
import { notFound } from "next/navigation";

export function generateStaticParams() {
	return locales.flatMap(({ code: locale }) => blogPosts.map(({ id }) => ({ locale, id })));
}

export default async function BlogPostPage({ params }: PageProps<"/[locale]/blog/[id]">) {
	const { id } = await params;
	const post = getBlogPost(id);

	if (!post) notFound();

	return <BlogArticle post={post} />;
}
