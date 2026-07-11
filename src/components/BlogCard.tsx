import type { BlogPost } from "@/data/blogs";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ post }: { post: BlogPost }) {
	return (
		<article className="blog_card">
			<Image className="blog_card-image" src={post.image} alt="" width={640} height={400} />
			<div className="blog_card-content">
				<p className="blog_card-meta">{post.type} | {post.date}</p>
				<h2>{post.title}</h2>
				<p className="blog_card-description">{post.description}</p>
				<Link href={`/blog/${post.id}`} className="blog_read-more">Read more</Link>
			</div>
		</article>
	);
}
