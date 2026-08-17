import type { SanityBlogPost } from "@/sanity/lib/blog";
import Image from "next/image";
import LocalizedLink from "./LocalizedLink";
import BlogPostMeta from "./BlogPostMeta";
import { useI18n } from "@/context/I18nContext";

export default function BlogCard({ post }: { post: SanityBlogPost }) {
	const { t } = useI18n();
	return (
		<article className="blog_card">
			<Image
				className="blog_card-image"
				src={post.image.url}
				alt={post.image.alt}
				width={640}
				height={400}
				// The grid is 3 / 2 / 1 columns; without `sizes` Next would pin the
				// srcset to 640px and upscale the card on wide screens.
				sizes="(max-width: 640px) 92vw, (max-width: 1280px) 48vw, 32vw"
				quality={90}
			/>
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
