import { defineField, defineType } from "sanity";

export const review = defineType({
	name: "review",
	title: "Reviews",
	type: "document",
	fields: [
		defineField({ name: "company", title: "Company name", type: "string", validation: (rule) => rule.required() }),
		defineField({ name: "logo", title: "Company logo", type: "image", options: { hotspot: true } }),
		defineField({ name: "author", title: "Author name", type: "string", validation: (rule) => rule.required() }),
		defineField({ name: "role", title: "Author position", type: "localizedString" }),
		defineField({ name: "text", title: "Review text", type: "localizedText", validation: (rule) => rule.required() }),
		defineField({ name: "order", title: "Order", type: "number", initialValue: 100, validation: (rule) => rule.integer().min(0) }),
		defineField({ name: "isVisible", title: "Show on site", type: "boolean", initialValue: true }),
	],
	orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "order", direction: "asc" }] }],
	preview: {
		select: { title: "company", subtitle: "author", media: "logo", isVisible: "isVisible" },
		prepare: ({ title, subtitle, media, isVisible }) => ({ title: `${isVisible === false ? "Hidden · " : ""}${title}`, subtitle, media }),
	},
});
