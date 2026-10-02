"use client";

import { PortableText, toPlainText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { useMemo, type ReactNode } from "react";
import { trackAnalyticsEvent } from "@/analytics/attribution";
import LocalizedLink from "./LocalizedLink";

export type ArticleHeading = { key: string; id: string; text: string };

type BodyImage = {
	url?: string;
	alt?: string;
	caption?: string;
	dimensions?: { width: number; height: number } | null;
	lqip?: string | null;
};

type BodyTable = {
	rows?: Array<{ _key: string; cells?: string[] }>;
	headerRow?: boolean;
	caption?: string;
};

type BodyCallout = { tone?: "soft" | "accent"; title?: string; text?: string; signature?: string };

type BodyButton = { label?: string; url?: string; note?: string };

/**
 * The article's H2s, each with the anchor it is rendered with, for the table of
 * contents. Anchors are the heading's own words (Cyrillic kept) so a shared
 * link says where it points; repeats get a numeric suffix.
 */
export function getArticleHeadings(content: PortableTextBlock[]): ArticleHeading[] {
	const seen = new Map<string, number>();
	return content
		.filter((block) => block._type === "block" && block.style === "h2")
		.map((block) => {
			const text = toPlainText(block).trim();
			const base = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "section";
			const count = (seen.get(base) ?? 0) + 1;
			seen.set(base, count);
			return { key: block._key ?? "", id: count > 1 ? `${base}-${count}` : base, text };
		})
		.filter((heading) => heading.text);
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

function SmartLink({ href, className, onClick, children }: { href: string; className?: string; onClick?: () => void; children: ReactNode }) {
	if (href.startsWith("/")) {
		return <LocalizedLink href={href} className={className} onClick={onClick}>{children}</LocalizedLink>;
	}
	return (
		<a href={href} className={className} onClick={onClick} {...(isExternal(href) && { target: "_blank", rel: "noopener noreferrer" })}>
			{children}
		</a>
	);
}

function buildComponents(articleId: string, headings: ArticleHeading[]): PortableTextComponents {
	const headingIds = new Map(headings.map(({ key, id }) => [key, id]));

	return {
		block: {
			h2: ({ children, value }) => <h2 id={headingIds.get(value._key ?? "")}>{children}</h2>,
		},
		list: {
			bullet: ({ children }) => <ul className="article_list article_list--bullet">{children}</ul>,
			number: ({ children }) => <ol className="article_list article_list--number">{children}</ol>,
		},
		marks: {
			accent: ({ children }) => <span className="article_accent">{children}</span>,
			highlight: ({ children }) => <mark className="article_highlight">{children}</mark>,
			link: ({ children, value }) =>
				typeof value?.href === "string" ? <SmartLink href={value.href}>{children}</SmartLink> : <>{children}</>,
		},
		types: {
			image: ({ value }: { value: BodyImage }) => {
				if (!value?.url) return null;
				const { width, height } = value.dimensions ?? { width: 1600, height: 900 };
				return (
					<figure className="article_figure">
						<Image
							src={value.url}
							alt={value.alt ?? ""}
							width={width}
							height={height}
							sizes="(max-width: 900px) calc(100vw - 60px), 760px"
							quality={90}
							{...(value.lqip && { placeholder: "blur" as const, blurDataURL: value.lqip })}
						/>
						{value.caption && <figcaption>{value.caption}</figcaption>}
					</figure>
				);
			},
			table: ({ value }: { value: BodyTable }) => {
				const rows = value?.rows?.filter((row) => row.cells?.some(Boolean)) ?? [];
				if (rows.length === 0) return null;
				const head = value.headerRow === false ? null : rows[0];
				const body = head ? rows.slice(1) : rows;
				return (
					<figure className="article_table">
						{/* Focusable so a keyboard user can scroll a table wider than the column. */}
						<div className="article_table-scroll" tabIndex={0} role="region" aria-label={value.caption || undefined}>
							<table>
								{head && (
									<thead>
										<tr>{head.cells?.map((cell, index) => <th key={index} scope="col">{cell}</th>)}</tr>
									</thead>
								)}
								<tbody>
									{body.map((row) => (
										<tr key={row._key}>{row.cells?.map((cell, index) => <td key={index}>{cell}</td>)}</tr>
									))}
								</tbody>
							</table>
						</div>
						{value.caption && <figcaption>{value.caption}</figcaption>}
					</figure>
				);
			},
			// Full class names, not `article_callout--${tone}`: Tailwind only keeps
			// layered rules whose class appears verbatim in the source.
			callout: ({ value }: { value: BodyCallout }) => (
				<aside className={value?.tone === "accent" ? "article_callout article_callout--accent" : "article_callout article_callout--soft"}>
					{value?.title && <p className="article_callout-title">{value.title}</p>}
					{value?.text && <p className="article_callout-text">{value.text}</p>}
					{value?.signature && <p className="article_callout-signature">{value.signature}</p>}
				</aside>
			),
			ctaButton: ({ value }: { value: BodyButton }) => {
				if (!value?.url || !value.label) return null;
				const url = value.url;
				return (
					<p className="article_button-wrap">
						<SmartLink
							href={url}
							className="article_button"
							onClick={() => trackAnalyticsEvent("cta_click", { cta_location: "article", page: window.location.pathname, article_id: articleId, url })}
						>
							{value.label}
							{value.note && <span className="article_button-note">{value.note}</span>}
						</SmartLink>
					</p>
				);
			},
			divider: () => <hr className="article_divider" />,
			embed: ({ value }: { value: { url?: string } }) => {
				if (!value?.url) return null;
				const youtubeId = value.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/)?.[1];
				return youtubeId ? (
					<div className="article_embed">
						<iframe
							src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
							title="Embedded video"
							loading="lazy"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</div>
				) : (
					<p><SmartLink href={value.url}>{value.url}</SmartLink></p>
				);
			},
		},
	};
}

export default function ArticleBody({ articleId, content, headings }: { articleId: string; content: PortableTextBlock[]; headings: ArticleHeading[] }) {
	const components = useMemo(() => buildComponents(articleId, headings), [articleId, headings]);
	return (
		<div className="article_body">
			<PortableText value={content} components={components} />
		</div>
	);
}
