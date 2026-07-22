"use client";

import type { SanityBlogPost } from "@/sanity/lib/blog";
import { useI18n } from "@/context/I18nContext";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Background from "./Background";
import BlogPostMeta from "./BlogPostMeta";
import Footer from "./Footer";
import Header from "./Header";
import LocalizedLink from "./LocalizedLink";
import Talk from "./Talk";

const portableTextComponents: PortableTextComponents = {
	types: {
		image: ({ value }) => value?.url ? (
			<figure>
				<Image src={value.url} alt={value.alt ?? ""} width={1200} height={800} />
				{value.caption && <figcaption>{value.caption}</figcaption>}
			</figure>
		) : null,
		callout: () => null,
		embed: ({ value }) => {
			if (!value?.url) return null;
			const youtubeId = value.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/)?.[1];
			return youtubeId ? (
				<iframe src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title="Embedded video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
			) : <a href={value.url} target="_blank" rel="noopener noreferrer">Open embedded content</a>;
		},
	},
	marks: {
		link: ({ children, value }) => {
			const external = typeof value?.href === "string" && /^https?:\/\//.test(value.href);
			return <a href={value?.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{children}</a>;
		},
	},
};

export default function BlogArticle({ post }: { post: SanityBlogPost }) {
	const { t } = useI18n();
	const [views, setViews] = useState(post.views);

	useEffect(() => {
		const sessionKey = `blog-view-requested:${post.id}`;
		if (sessionStorage.getItem(sessionKey)) return;
		sessionStorage.setItem(sessionKey, "1");

		void fetch("/api/blog/views", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ articleId: post.id }),
		})
			.then((response) => response.ok ? response.json() as Promise<{ views: number }> : null)
			.then((result) => {
				if (typeof result?.views === "number") setViews(result.views);
			})
			.catch(() => {
				sessionStorage.removeItem(sessionKey);
			});
	}, [post.id]);

	return (
		<div className="wrapper blog_article-page">
			<Background>
				<div className="blog_page-content">
					<Header />
					<main className="content_container blog_article">
						<header className="blog_article-header">
							<div className="blog_article-meta"><span>{post.type}</span></div>
							<h1>{post.title}</h1>
							<BlogPostMeta date={post.publishedAt} readTime={post.readTime} views={views} className="blog_article-stats" />
						</header>
						<p className="blog_article-lead">{post.description}</p>
						<Image className="blog_article-image" src={post.image.url} alt={post.image.alt} width={1600} height={900} priority />
						<div className="blog_article-body"><PortableText value={post.content} components={portableTextComponents} /></div>
						{post.relatedArticles.length > 0 && (
							<section className="blog_recommended">
								<div className="blog_recommended-head"><p>{t("blog.keepExploring")}</p><h2>{t("blog.recommended")}</h2></div>
								<div className="blog_recommended-grid">
									{post.relatedArticles.map((item) => (
										<LocalizedLink key={item.id} href={`/blog/${item.slug}`} className="blog_recommended-link">
											<Image src={item.image.url} alt={item.image.alt} width={640} height={400} />
											<div className="blog_recommended-content">
												<p>{item.type}</p><h3>{item.title}</h3>
												<div className="blog_recommended-description">{item.description}</div>
												<BlogPostMeta date={item.publishedAt} readTime={item.readTime} views={item.views} />
												<span className="blog_read-more blog_recommended-button">{t("blog.readArticle")}</span>
											</div>
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
