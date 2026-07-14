import { defineArrayMember, defineField, defineType } from "sanity";

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
		defineField({ name: "slug", title: "Slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
		defineField({ name: "excerpt", title: "Lead / excerpt", type: "text", rows: 4, group: "content", validation: (rule) => rule.required().max(200) }),
		defineField({
			name: "coverImage", title: "Cover image", type: "image", group: "content", options: { hotspot: true },
			fields: [{ name: "alt", title: "Alternative text", type: "string", validation: (rule) => rule.required() }],
			validation: (rule) => rule.required(),
		}),
		defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "category" }], group: "content", validation: (rule) => rule.required() }),
		defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "reference", to: [{ type: "tag" }] }], group: "content" }),
		defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }], group: "content", validation: (rule) => rule.required() }),
		defineField({
			name: "body", title: "Article body", type: "array", group: "content", validation: (rule) => rule.required(),
			of: [
				defineArrayMember({ type: "block", styles: [
					{ title: "Paragraph", value: "normal" }, { title: "Heading 2", value: "h2" },
					{ title: "Heading 3", value: "h3" }, { title: "Quote", value: "blockquote" },
				] }),
				defineArrayMember({ type: "image", options: { hotspot: true }, fields: [
					{ name: "alt", title: "Alternative text", type: "string", validation: (rule) => rule.required() },
					{ name: "caption", title: "Caption", type: "string" },
				] }),
				defineArrayMember({ type: "object", name: "callout", title: "Callout", fields: [
					{ name: "tone", type: "string", options: { list: ["info", "warning", "success"] }, initialValue: "info" },
					{ name: "text", type: "text" },
				] }),
				defineArrayMember({ type: "object", name: "embed", title: "YouTube / Telegram embed", fields: [
					{ name: "url", type: "url" },
				] }),
			],
		}),
		defineField({
			name: "relatedArticles", title: "Recommended articles", type: "array", group: "content",
			description: "Up to 3 articles. Drag to change their order.",
			of: [{ type: "reference", to: [{ type: "article" }], options: { filter: ({ document }) => ({ filter: "language == $language && _id != $id", params: { language: document.language, id: document._id.replace("drafts.", "") } }) } }],
			validation: (rule) => rule.max(3).unique(),
		}),
		defineField({ name: "status", title: "Status", type: "string", group: "publication", initialValue: "draft", options: { list: [
			{ title: "Draft", value: "draft" }, { title: "Scheduled", value: "scheduled" },
			{ title: "Published", value: "published" }, { title: "Unpublished", value: "unpublished" },
		] }, validation: (rule) => rule.required() }),
		defineField({ name: "publishedAt", title: "Publication date", type: "datetime", group: "publication" }),
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
