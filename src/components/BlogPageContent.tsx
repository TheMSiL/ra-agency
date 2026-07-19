"use client";

import { blogPosts } from "@/data/blogs";
import Image from "next/image";
import { useRef, useState } from "react";
import BlogCard from "./BlogCard";
import LocalizedLink from "./LocalizedLink";
import BlogPostMeta from "./BlogPostMeta";

const POSTS_PER_PAGE = 6;

export default function BlogPageContent() {
	const [featuredPost, ...posts] = blogPosts;
	const gridRef = useRef<HTMLDivElement>(null);
	const [page, setPage] = useState(1);
	const pageCount = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
	const safePage = Math.min(page, pageCount);
	const currentPosts = posts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

	function goToPage(pageNumber: number) {
		setPage(pageNumber);
		window.requestAnimationFrame(() => {
			gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		});
	}

	return (
		<div className="blog_wrapper">
			<div className="blog_top">
				<div className="blog_top_content flex flex-col justify-between">
					<h3 className="mb-4 2xl:text-3xl text-xl sm:text-2xl font-display">{featuredPost.type}</h3>
					<h2 className="mb-3 2xl:text-4xl text-2xl sm:text-3xl font-display">{featuredPost.title}</h2>
					<p className="opacity-70 text-base 2xl:text-xl">{featuredPost.description}</p>
					<BlogPostMeta date={featuredPost.date} readTime={featuredPost.readTime} views={featuredPost.views} className="my-3" />
					<LocalizedLink href={`/blog/${featuredPost.id}`} className="blog_read-more">
						Read more
					</LocalizedLink>
				</div>
				<Image className="blog_top-image" src={featuredPost.image} alt="" width={800} height={533} />
			</div>
			<div className="blog_bottom flex xl:flex-row flex-col items-stretch justify-between gap-5">
				<form className="blog_subscribe">
					<h4 className="2xl:text-3xl text-2xl font-display mb-5">Subscribe to our newsletter for regular quality insights</h4>
					<div className="flex sm:flex-row flex-col gap-5 sm:gap-10 items-stretch w-full">
						<input className="blog_subscribe-input blog_subscribe-input--desktop" type="email" placeholder="perfectmail@raagency.hello" />
						<input className="blog_subscribe-input blog_subscribe-input--mobile" type="email" placeholder="Email" />
						<button className="blog_subscribe-btn" type="submit">Subscribe</button>
					</div>
				</form>
				<div>
					<h4 className="2xl:text-3xl text-2xl font-display mb-5">Follow us</h4>
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
			<div className="cases_pagination blog_pagination" aria-label="Blog pagination">
				{Array.from({ length: pageCount }, (_, index) => {
					const pageNumber = index + 1;

					return (
						<button
							key={pageNumber}
							type="button"
							className={`cases_pagination-dot ${pageNumber === safePage ? "active" : ""}`}
							aria-label={`Page ${pageNumber}`}
							aria-current={pageNumber === safePage ? "page" : undefined}
							onClick={() => goToPage(pageNumber)}
						/>
					);
				})}
			</div>
		</div>
	);
}
