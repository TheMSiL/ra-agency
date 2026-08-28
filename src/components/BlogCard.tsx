import type { SanityBlogPost } from "@/sanity/lib/blog";
import BlogCover from "./BlogCover";
import LocalizedLink from "./LocalizedLink";
import BlogPostMeta from "./BlogPostMeta";
import { useI18n } from "@/context/I18nContext";

export default function BlogCard({ post }: { post: SanityBlogPost }) {
	const { t } = useI18n();
	return (
		<article className="blog_card">
			<BlogCover image={post.image} className="blog_card-image" />
			<div className="blog_card-content">
				<p className="blog_card-meta">{post.type}</p>
				<h2>{post.title}</h2>
				<p className="blog_card-description">{post.description}</p>
				<BlogPostMeta date={post.publishedAt} readTime={post.readTime} views={post.views} />
				<LocalizedLink href={`/blog/${post.slug}`} className="blog_read-more">{t("common.readMore")}</LocalizedLink>
			</div>
		</article>
	);
}
