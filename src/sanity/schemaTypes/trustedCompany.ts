import { defineField, defineType } from "sanity";

export const trustedCompany = defineType({
	name: "trustedCompany",
	title: "Trusted companies",
	type: "document",
	fields: [
		defineField({ name: "name", title: "Company name", type: "string", validation: (rule) => rule.required() }),
		defineField({ name: "caption", title: "Caption", description: "Text shown below the logo", type: "localizedString" }),
		defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
		defineField({ name: "order", title: "Order", type: "number", initialValue: 100, validation: (rule) => rule.integer().min(0) }),
		defineField({ name: "isVisible", title: "Show on site", type: "boolean", initialValue: true }),
	],
	orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "order", direction: "asc" }] }],
	preview: {
		select: { title: "name", subtitle: "caption.en", media: "logo", isVisible: "isVisible" },
		prepare: ({ title, subtitle, media, isVisible }) => ({ title: `${isVisible === false ? "Hidden · " : ""}${title}`, subtitle, media }),
	},
});
