import {
	defineArrayMember,
	defineField,
	defineType,
	type SlugIsUniqueValidator,
} from "sanity";
import { BulbOutlineIcon, LaunchIcon, PlayIcon, RemoveIcon, ThLargeIcon } from "@sanity/icons";
import { createElement, type ReactNode } from "react";
import {
	AccentDecorator,
	AccentIcon,
	ArticleBodyInput,
	HighlightDecorator,
	HighlightIcon,
	TableRowsInput,
} from "../components/articleBody";

const normalizeDocumentId = (id: string) => id.replace(/^drafts\./, "");

const portableTextStyle = (element: "p" | "h2" | "h3" | "blockquote") => {
	function PortableTextStyle({ children }: { children: ReactNode }) {
		return createElement(element, null, children);
	}

	return PortableTextStyle;
};

const isUniqueArticleSlug: SlugIsUniqueValidator = async (slug, context) => {
	const documentId = context.document?._id;
	if (!documentId) return context.defaultIsUnique(slug, context);

	const publishedId = normalizeDocumentId(documentId);
	const client = context.getClient({ apiVersion: "2026-07-22" });
	const result = await client.fetch<{ duplicateIds: string[]; translationIds: string[] | null }>(
		`{
			"duplicateIds": *[
				_type == "article" &&
				slug.current == $slug &&
				!(_id in [$publishedId, $draftId])
			]._id,
			"translationIds": *[
				_type == "translation.metadata" && references($publishedId)
			][0].translations[].value._ref
		}`,
		{ slug, publishedId, draftId: `drafts.${publishedId}` },
	);

	const translationIds = new Set((result.translationIds ?? []).map(normalizeDocumentId));
	return result.duplicateIds.every((id) => translationIds.has(normalizeDocumentId(id)));
};

export const article = defineType({
	name: "article",
	title: "Articles",
	type: "document",
	groups: [
		{ name: "content", title: "Content", default: true },
		{ name: "publication", title: "Publication" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
		defineField({ name: "title", title: "Title", type: "string", group: "content", validation: (rule) => rule.required() }),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			group: "content",
			options: { source: "title", maxLength: 96, isUnique: isUniqueArticleSlug },
			validation: (rule) => rule.required(),
		}),
		defineField({ name: "excerpt", title: "Lead / excerpt", type: "text", rows: 4, group: "content", validation: (rule) => rule.required().max(200) }),
		defineField({
			name: "coverImage", title: "Cover image", type: "image", group: "content", options: { hotspot: true },
			fields: [{ name: "alt", title: "Alternative text", type: "string", validation: (rule) => rule.required() }],
			validation: (rule) => rule.required(),
		}),
		defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "category" }], group: "content", validation: (rule) => rule.required() }),
		defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "reference", to: [{ type: "tag" }] }], group: "content" }),
		defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }], group: "content", validation: (rule) => rule.required() }),
		// Keep in step with the converter schema in lib/articleHtml.ts, which
		// drops anything pasted HTML maps to that is not declared there.
		defineField({
			name: "body", title: "Article body", type: "array", group: "content", validation: (rule) => rule.required(),
			description: "Write here, or paste: text from Google Docs / Word keeps its headings, lists, bold and links; the HTML of an article in the agency template (copied from a code editor) keeps its orange text, highlights, CTA box and button; tables copied from anywhere become Table blocks.",
			components: { input: ArticleBodyInput },
			of: [
				defineArrayMember({
					type: "block",
					styles: [
						{ title: "Paragraph", value: "normal", component: portableTextStyle("p") },
						{ title: "Heading 2", value: "h2", component: portableTextStyle("h2") },
						{ title: "Heading 3", value: "h3", component: portableTextStyle("h3") },
						{ title: "Quote", value: "blockquote", component: portableTextStyle("blockquote") },
					],
					lists: [
						{ title: "Bulleted list", value: "bullet" },
						{ title: "Numbered list", value: "number" },
					],
					marks: {
						decorators: [
							{ title: "Bold", value: "strong" },
							{ title: "Italic", value: "em" },
							{ title: "Underline", value: "underline" },
							{ title: "Strikethrough", value: "strike-through" },
							{ title: "Orange text", value: "accent", icon: AccentIcon, component: AccentDecorator },
							{ title: "Highlight", value: "highlight", icon: HighlightIcon, component: HighlightDecorator },
						],
						annotations: [
							defineArrayMember({
								name: "link", title: "Link", type: "object",
								fields: [
									defineField({
										name: "href", title: "URL", type: "url",
										description: "A full address (https://…, mailto:…) or a page on this site (/contacts).",
										validation: (rule) => rule.required().uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
									}),
								],
							}),
						],
					},
				}),
				defineArrayMember({
					type: "image", title: "Image", options: { hotspot: true },
					fields: [
						defineField({ name: "alt", title: "Alternative text", type: "string", description: "What the image shows, for screen readers and search.", validation: (rule) => rule.required() }),
						defineField({ name: "caption", title: "Caption", type: "string" }),
					],
				}),
				defineArrayMember({
					type: "object", name: "table", title: "Table", icon: ThLargeIcon,
					fields: [
						defineField({
							name: "rows", title: "Cells", type: "array", validation: (rule) => rule.required().min(1),
							components: { input: TableRowsInput },
							of: [defineArrayMember({ type: "object", name: "tableRow", fields: [defineField({ name: "cells", type: "array", of: [{ type: "string" }] })] })],
						}),
						defineField({ name: "headerRow", title: "First row is a header", type: "boolean", initialValue: true }),
						defineField({ name: "caption", title: "Caption", type: "string" }),
					],
					preview: {
						select: { rows: "rows", caption: "caption" },
						prepare: ({ rows, caption }: { rows?: Array<{ cells?: string[] }>; caption?: string }) => ({
							title: caption || rows?.[0]?.cells?.filter(Boolean).join(" · ") || "Table",
							subtitle: `Table · ${rows?.length ?? 0} rows × ${rows?.[0]?.cells?.length ?? 0} columns`,
						}),
					},
				}),
				defineArrayMember({
					type: "object", name: "callout", title: "Callout / CTA box", icon: BulbOutlineIcon,
					fields: [
						defineField({
							name: "tone", title: "Look", type: "string", initialValue: "soft",
							options: { layout: "radio", list: [
								{ title: "Soft note — a key takeaway in a light box", value: "soft" },
								{ title: "Orange box — a call to action", value: "accent" },
							] },
						}),
						defineField({ name: "title", title: "Title", type: "string" }),
						defineField({ name: "text", title: "Text", type: "text", rows: 4, validation: (rule) => rule.required() }),
						defineField({ name: "signature", title: "Signature", type: "string", description: "Optional bold line under the text, e.g. RA AGENCY." }),
					],
					preview: {
						select: { title: "title", text: "text", tone: "tone" },
						prepare: ({ title, text, tone }: { title?: string; text?: string; tone?: string }) => ({
							title: title || text,
							subtitle: tone === "accent" ? "Orange CTA box" : "Soft note",
						}),
					},
				}),
				defineArrayMember({
					type: "object", name: "ctaButton", title: "Button", icon: LaunchIcon,
					fields: [
						defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
						defineField({
							name: "url", title: "Link", type: "url",
							description: "Where the button leads: https://t.me/…, a full URL, or a page on this site (/contacts).",
							validation: (rule) => rule.required().uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
						}),
						defineField({ name: "note", title: "Note", type: "string", description: "Optional bold orange line under the label, e.g. ROI or DIE." }),
					],
					preview: { select: { title: "label", subtitle: "url" } },
				}),
				defineArrayMember({
					type: "object", name: "divider", title: "Divider", icon: RemoveIcon,
					fields: [defineField({ name: "style", type: "string", initialValue: "line", hidden: true })],
					preview: { prepare: () => ({ title: "Divider" }) },
				}),
				defineArrayMember({
					type: "object", name: "embed", title: "YouTube video", icon: PlayIcon,
					fields: [defineField({ name: "url", title: "YouTube link", type: "url", validation: (rule) => rule.required() })],
					preview: { select: { title: "url" }, prepare: ({ title }: { title?: string }) => ({ title, subtitle: "YouTube video" }) },
				}),
			],
		}),
		defineField({
			name: "relatedArticles", title: "Recommended articles", type: "array", group: "content",
			description: "Up to 3 articles in the same language. Drag to change their order.",
			of: [{ type: "reference", to: [{ type: "article" }], options: { filter: ({ document }) => ({ filter: "language == $language && _id != $id", params: { language: document.language, id: document._id.replace("drafts.", "") } }) } }],
			validation: (rule) => rule.max(3).unique(),
		}),
		defineField({ name: "status", title: "Status", type: "string", group: "publication", initialValue: "draft", options: { list: [
			{ title: "Draft", value: "draft" }, { title: "Scheduled", value: "scheduled" },
			{ title: "Published", value: "published" }, { title: "Unpublished", value: "unpublished" },
		] }, description: "For scheduled publication, select Scheduled, set a future date, then publish the Sanity document.", validation: (rule) => rule.required() }),
		defineField({
			name: "publishedAt", title: "Publication date", type: "datetime", group: "publication",
			description: "Scheduled content becomes visible automatically when this date is reached.",
			validation: (rule) => rule.custom((date, context) => context.document?.status === "scheduled" && !date ? "Publication date is required for scheduled content" : true),
		}),
		defineField({
			name: "readTime", title: "Reading time (minutes)", type: "number", group: "publication",
			description: "Leave empty to have it worked out from the article's length.",
			validation: (rule) => rule.integer().min(1),
		}),
		defineField({ name: "views", title: "Views", type: "number", hidden: true, readOnly: true, initialValue: 0 }),
		defineField({ name: "isFeatured", title: "Featured article", type: "boolean", group: "publication", initialValue: false }),
		defineField({ name: "metaTitle", title: "Meta title", type: "string", group: "seo", validation: (rule) => rule.max(60) }),
		defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 3, group: "seo", validation: (rule) => rule.max(160) }),
		defineField({ name: "ogImage", title: "Open Graph image", type: "image", group: "seo" }),
		defineField({ name: "noindex", title: "Prevent indexing", type: "boolean", group: "seo", initialValue: false }),
	],
	preview: {
		select: { title: "title", language: "language", status: "status", media: "coverImage" },
		prepare: ({ title, language, status, media }) => ({ title, subtitle: `${language?.toUpperCase() ?? "—"} · ${status}`, media }),
	},
});
