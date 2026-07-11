import BlogArticle from "@/components/BlogArticle";
import { blogPosts, getBlogPost } from "@/data/blogs";
import { notFound } from "next/navigation";

export function generateStaticParams() {
	return blogPosts.map(({ id }) => ({ id }));
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[id]">) {
	const { id } = await params;
	const post = getBlogPost(id);

	if (!post) notFound();

	return <BlogArticle post={post} />;
}
