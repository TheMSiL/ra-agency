import type { BlogPost } from "@/data/blogs";
import Image from "next/image";
import LocalizedLink from "./LocalizedLink";
import BlogPostMeta from "./BlogPostMeta";

export default function BlogCard({ post }: { post: BlogPost }) {
	return (
		<article className="blog_card">
			<Image className="blog_card-image" src={post.image} alt="" width={640} height={400} />
			<div className="blog_card-content">
				<p className="blog_card-meta">{post.type}</p>
				<h2>{post.title}</h2>
				<p className="blog_card-description">{post.description}</p>
				<BlogPostMeta date={post.date} readTime={post.readTime} views={post.views} />
				<LocalizedLink href={`/blog/${post.id}`} className="blog_read-more">Read more</LocalizedLink>
			</div>
		</article>
	);
}
