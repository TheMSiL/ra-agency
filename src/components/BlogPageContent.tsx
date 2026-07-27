"use client";

import type { SanityBlogPost } from "@/sanity/lib/blog";
import Image from "next/image";
import { useRef, useState } from "react";
import BlogCard from "./BlogCard";
import LocalizedLink from "./LocalizedLink";
import BlogPostMeta from "./BlogPostMeta";
import { useI18n } from "@/context/I18nContext";
import AttributionFields from "./AttributionFields";

const POSTS_PER_PAGE = 6;

function PaginationArrow({ direction }: { direction: "prev" | "next" }) {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
			<path
				d={direction === "prev" ? "M14.5 5L7.5 12L14.5 19" : "M9.5 5L16.5 12L9.5 19"}
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function BlogPageContent({ blogPosts }: { blogPosts: SanityBlogPost[] }) {
	const { locale, t } = useI18n();
	const featuredPost = blogPosts.find(({ isFeatured }) => isFeatured) ?? blogPosts[0];
	const posts = blogPosts.filter(({ id }) => id !== featuredPost?.id);
	const gridRef = useRef<HTMLDivElement>(null);
	const [page, setPage] = useState(1);
	const [email, setEmail] = useState("");
	const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const pageCount = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
	const safePage = Math.min(page, pageCount);
	const currentPosts = posts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

	function goToPage(pageNumber: number) {
		setPage(pageNumber);
		window.requestAnimationFrame(() => {
			gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		});
	}

	async function subscribe(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubscribeStatus("loading");
		const response = await fetch("/api/newsletter/subscribe", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, locale, website: new FormData(event.currentTarget).get("website") }),
		}).catch(() => null);
		if (response?.ok) {
			setEmail("");
			setSubscribeStatus("success");
		} else {
			setSubscribeStatus("error");
		}
	}

	return (
		<div className="blog_wrapper">
			{!featuredPost && <div className="cases_empty cases_block">{t("blog.empty")}</div>}
			{featuredPost && <>
			<div className="blog_top">
				<div className="blog_top_content flex flex-col justify-between">
					<h3 className="mb-4 2xl:text-3xl text-xl sm:text-2xl font-display">{featuredPost.type}</h3>
					<h2 className="mb-3 2xl:text-4xl text-2xl sm:text-3xl font-display">{featuredPost.title}</h2>
					<p className="opacity-70 text-base 2xl:text-xl">{featuredPost.description}</p>
					<BlogPostMeta date={featuredPost.publishedAt} readTime={featuredPost.readTime} views={featuredPost.views} className="my-3" />
					<LocalizedLink href={`/blog/${featuredPost.slug}`} className="blog_read-more">
						{t("common.readMore")}
					</LocalizedLink>
				</div>
				<Image className="blog_top-image" src={featuredPost.image.url} alt={featuredPost.image.alt} width={800} height={533} />
			</div>
			</>}
			<div className="blog_bottom flex xl:flex-row flex-col items-stretch justify-between gap-5">
				<form className="blog_subscribe" onSubmit={subscribe}>
					<AttributionFields />
					<input className="newsletter_honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
					<h4 className="2xl:text-3xl text-2xl font-display mb-5">{t("blog.subscribeTitle")}</h4>
					<div className="flex sm:flex-row flex-col gap-5 sm:gap-10 items-stretch w-full">
						<input className="blog_subscribe-input blog_subscribe-input--desktop" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="perfectmail@raagency.hello" required />
						<input className="blog_subscribe-input blog_subscribe-input--mobile" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
						<button className="blog_subscribe-btn" type="submit" disabled={subscribeStatus === "loading"}>{subscribeStatus === "loading" ? t("blog.subscribing") : t("blog.subscribe")}</button>
					</div>
					{subscribeStatus === "success" && <p className="blog_subscribe-status" role="status">{t("blog.subscribeSuccess")}</p>}
					{subscribeStatus === "error" && <p className="blog_subscribe-status blog_subscribe-status--error" role="alert">{t("blog.subscribeError")}</p>}
				</form>
				<div>
					<h4 className="2xl:text-3xl text-2xl font-display mb-5">{t("blog.follow")}</h4>
					<div className="blog_socials" aria-label="Social links">
						<a href="#" aria-label="Telegram">
							<Image src="/tg.svg" alt="" width={30} height={30} />
						</a>
						<a href="#" aria-label="LinkedIn">
							<Image src="/linkedin.svg" alt="" width={24} height={24} />
						</a>
						<a href="#" aria-label="X">
							<Image src="/x.svg" alt="" width={24} height={24} />
						</a>
					</div>

				</div>
			</div>
			<div className="blog_grid" ref={gridRef}>
				{currentPosts.map((post) => <BlogCard key={post.id} post={post} />)}
			</div>
			<div className="cases_pagination cases_catalog-pagination blog_pagination" aria-label="Blog pagination">
				<button
					type="button"
					className="cases_pagination-arrow cases_pagination-arrow--prev"
					aria-label={t("common.previous")}
					disabled={safePage === 1}
					onClick={() => goToPage(safePage - 1)}
				>
					<PaginationArrow direction="prev" />
				</button>

				<div className="cases_pagination-dots">
					{Array.from({ length: pageCount }, (_, index) => {
						const pageNumber = index + 1;

						return (
							<button
								key={pageNumber}
								type="button"
								className={`cases_pagination-dot ${pageNumber === safePage ? "active" : ""}`}
								aria-label={`${t("common.page")} ${pageNumber}`}
								aria-current={pageNumber === safePage ? "page" : undefined}
								onClick={() => goToPage(pageNumber)}
							>
								{pageNumber}
							</button>
						);
					})}
				</div>

				<button
					type="button"
					className="cases_pagination-arrow cases_pagination-arrow--next"
					aria-label={t("common.next")}
					disabled={safePage === pageCount}
					onClick={() => goToPage(safePage + 1)}
				>
					<PaginationArrow direction="next" />
				</button>
			</div>
		</div>
	);
}
