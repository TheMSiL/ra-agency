"use client";

import type { ReactNode } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

/**
 * The shell behind the 404 and error boundaries.
 *
 * Without a not-found.tsx / error.tsx of its own the site fell through to the
 * framework's built-in screens, which render outside the layout entirely: black
 * text on white, no header, no footer and no way back into the site. Borrowing
 * the policy-page shell keeps a mistyped case slug inside the site instead.
 */
export default function StatusScreen({
	code,
	title,
	text,
	actions,
}: {
	code: string;
	title: string;
	text: string;
	actions: ReactNode;
}) {
	return (
		<div className="wrapper privacy_policy-page">
			<section className="privacy_policy">
				<Header />
				<main className="content_container privacy_policy-content">
					<p className="font-display numbers_gradient-text text-[clamp(72px,14vw,200px)] leading-none">{code}</p>
					<h1 className="font-display numbers_gradient-text">{title}</h1>
					<p className="mt-8 max-w-[640px] text-[clamp(15px,1.4vw,18px)] leading-relaxed">{text}</p>
					<div className="mt-10 flex flex-wrap items-center gap-5">{actions}</div>
				</main>
			</section>
			<Footer />
		</div>
	);
}
