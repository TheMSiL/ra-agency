"use client";

import type { SanityBlogPost } from "@/sanity/lib/blog";
import { useI18n } from "@/context/I18nContext";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { setSourceArticle, trackAnalyticsEvent } from "@/analytics/attribution";
import ArticleBody, { getArticleHeadings } from "./ArticleBody";
import Background from "./Background";
import BlogCover from "./BlogCover";
import BlogPostMeta from "./BlogPostMeta";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";
import Header from "./Header";
import LocalizedLink from "./LocalizedLink";
import Talk from "./Talk";

// Below this a contents list is more chrome than help.
const MIN_TOC_HEADINGS = 3;

export default function BlogArticle({ post }: { post: SanityBlogPost }) {
	const { t } = useI18n();
	const localePaths = Object.fromEntries([
		...(["en", "ru", "ua"] as const).map((locale) => [locale, `/${locale}/blog`]),
		...[{ language: post.language, slug: post.slug }, ...(post.translations ?? [])]
			.map(({ language, slug }) => [language, `/${language}/blog/${slug}`]),
	]);
	const headings = useMemo(() => getArticleHeadings(post.content), [post.content]);
	const hasToc = headings.length >= MIN_TOC_HEADINGS;
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
						<Breadcrumbs items={[{ label: t("nav.blog"), href: "/blog" }, { label: post.title }]} />
						<article className={`blog_sheet${hasToc ? " blog_sheet--toc" : ""}`}>
							<header className="blog_sheet-head">
								{post.type && <p className="blog_sheet-category">{post.type}</p>}
								<h1>{post.title}</h1>
								<BlogPostMeta date={post.publishedAt} readTime={post.readTime} views={views} className="blog_sheet-meta" />
								{post.description && <p className="blog_sheet-lead">{post.description}</p>}
								<Image
									className="blog_sheet-cover"
									src={post.image.url}
									alt={post.image.alt}
									width={1600}
									height={900}
									sizes="(max-width: 900px) calc(100vw - 60px), 760px"
									quality={90}
									loading="eager"
									fetchPriority="high"
								/>
							</header>
							{hasToc && (
								<nav className="blog_toc" aria-labelledby="blog-toc-title">
									<p className="blog_toc-title" id="blog-toc-title">{t("blog.contents")}</p>
									<ol>
										{headings.map((heading) => (
											<li key={heading.id}><a href={`#${heading.id}`}>{heading.text}</a></li>
										))}
									</ol>
								</nav>
							)}
							<ArticleBody articleId={post.id} content={post.content} headings={headings} />
						</article>
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
