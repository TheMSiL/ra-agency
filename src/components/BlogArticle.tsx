"use client";

import type { SanityBlogPost } from "@/sanity/lib/blog";
import { useI18n } from "@/context/I18nContext";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { setSourceArticle, trackAnalyticsEvent } from "@/analytics/attribution";
import Background from "./Background";
import BlogCover from "./BlogCover";
import BlogPostMeta from "./BlogPostMeta";
import Footer from "./Footer";
import Header from "./Header";
import LocalizedLink from "./LocalizedLink";
import Talk from "./Talk";

const portableTextComponents: PortableTextComponents = {
	types: {
		image: ({ value }) => value?.url ? (
			<figure>
				<Image
					src={value.url}
					alt={value.alt ?? ""}
					width={1200}
					height={800}
					sizes="(max-width: 1000px) 92vw, 920px"
					quality={90}
				/>
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
	const localePaths = Object.fromEntries([
		...(["en", "ru", "ua"] as const).map((locale) => [locale, `/${locale}/blog`]),
		...[{ language: post.language, slug: post.slug }, ...(post.translations ?? [])]
			.map(({ language, slug }) => [language, `/${language}/blog/${slug}`]),
	]);
	const [views, setViews] = useState(post.views);
	const readCompleteRef = useRef<HTMLDivElement>(null);
	const recommendationsRef = useRef<HTMLElement>(null);
	const openedAt = useRef(0);

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

	useEffect(() => {
		openedAt.current = Date.now();
		setSourceArticle({ id: post.id, slug: post.slug });
		const readKey = `article-read-complete:${post.id}`;
		const recommendationsKey = `recommendations-view:${post.id}`;
		const observers: IntersectionObserver[] = [];

		if (!sessionStorage.getItem(readKey) && readCompleteRef.current) {
			const observer = new IntersectionObserver(([entry]) => {
				if (!entry.isIntersecting) return;
				sessionStorage.setItem(readKey, "1");
				trackAnalyticsEvent("article_read_complete", {
					article_id: post.id,
					slug: post.slug,
					time_on_page: Math.max(1, Math.round((Date.now() - openedAt.current) / 1000)),
				});
				observer.disconnect();
			}, { rootMargin: "0px 0px -40% 0px" });
			observer.observe(readCompleteRef.current);
			observers.push(observer);
		}

		if (!sessionStorage.getItem(recommendationsKey) && recommendationsRef.current) {
			const observer = new IntersectionObserver(([entry]) => {
				if (!entry.isIntersecting) return;
				sessionStorage.setItem(recommendationsKey, "1");
				trackAnalyticsEvent("recommendations_view", {
					article_id: post.id,
					recommended_ids: post.relatedArticles.map(({ id }) => id),
					source: post.relatedArticles.some(({ recommendationSource }) => recommendationSource === "manual") ? "manual" : "auto",
				});
				observer.disconnect();
			}, { threshold: 0.25 });
			observer.observe(recommendationsRef.current);
			observers.push(observer);
		}

		return () => observers.forEach((observer) => observer.disconnect());
	}, [post.id, post.relatedArticles, post.slug]);

	return (
		<div className="wrapper blog_article-page">
			<Background>
				<div className="blog_page-content">
					<Header localePaths={localePaths} />
					<main className="content_container blog_article">
						<header className="blog_article-header">
							<div className="blog_article-meta"><span>{post.type}</span></div>
							<h1>{post.title}</h1>
							<BlogPostMeta date={post.publishedAt} readTime={post.readTime} views={views} className="blog_article-stats" />
						</header>
						<p className="blog_article-lead">{post.description}</p>
						<Image
							className="blog_article-image"
							src={post.image.url}
							alt={post.image.alt}
							width={1600}
							height={900}
							sizes="(max-width: 1128px) 92vw, 1040px"
							quality={90}
							loading="eager"
							fetchPriority="high"
						/>
						<div className="blog_article-body"><PortableText value={post.content} components={portableTextComponents} /></div>
						<div ref={readCompleteRef} aria-hidden="true" />
						{post.relatedArticles.length > 0 && (
							<section className="blog_recommended" ref={recommendationsRef}>
								<div className="blog_recommended-head"><p>{t("blog.keepExploring")}</p><h2>{t("blog.recommended")}</h2></div>
								<div className="blog_recommended-grid">
									{post.relatedArticles.map((item, index) => (
										<LocalizedLink key={item.id} href={`/blog/${item.slug}`} className="blog_recommended-link" onClick={() => trackAnalyticsEvent("recommendation_click", {
											from_article_id: post.id,
											to_article_id: item.id,
											position: index + 1,
											source: item.recommendationSource ?? "auto",
										})}>
											<BlogCover image={item.image} />
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
