import type { BlogPost } from "@/data/blogs";
import { getRecommendedPosts } from "@/data/blogs";
import Image from "next/image";
import LocalizedLink from "./LocalizedLink";
import Footer from "./Footer";
import Header from "./Header";
import Talk from "./Talk";
import BlogPostMeta from "./BlogPostMeta";
import Background from "./Background";

export default function BlogArticle({ post }: { post: BlogPost }) {
	const recommendations = getRecommendedPosts(post);

	return (
		<div className="wrapper blog_article-page">
			<Background>
				<div className="blog_page-content">
					<Header />
					<main className="content_container blog_article">
						<header className="blog_article-header">
							<div className="blog_article-meta"><span>{post.type}</span></div>
							<h1>{post.title}</h1>
							<BlogPostMeta date={post.date} readTime={post.readTime} views={post.views} className="blog_article-stats" />
						</header>
						<p className="blog_article-lead">{post.description}</p>
						<Image className="blog_article-image" src={post.image} alt="" width={1600} height={900} priority />
						<div className="blog_article-body">
							{post.content.map((block, index) => {
								if (block.type === "heading") return <h2 key={index}>{block.text}</h2>;
								if (block.type === "list") return <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
								return <p key={index}>{block.text}</p>;
							})}
						</div>
						{recommendations.length > 0 && (
							<section className="blog_recommended">
								<div className="blog_recommended-grid">
									{recommendations.map((item) => (
										<LocalizedLink key={item.id} href={`/blog/${item.id}`} className="blog_recommended-link" aria-label={item.title}>
											<Image src={item.image} alt={item.title} width={800} height={500} />
										</LocalizedLink>
									))}
								</div>
							</section>
						)}
					</main>
					<Talk />
				</div>
			</Background>
			<Footer />
		</div>
	);
}
