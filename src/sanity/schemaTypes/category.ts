import { defineField, defineType } from "sanity";

export const category = defineType({
	name: "category",
	title: "Categories",
	type: "document",
	fields: [
		defineField({ name: "title", title: "Title", type: "localizedString", validation: (rule) => rule.required() }),
		defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title.en" }, validation: (rule) => rule.required() }),
	],
	preview: { select: { title: "title.en", subtitle: "slug.current" } },
});
