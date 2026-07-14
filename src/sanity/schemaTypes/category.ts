import { defineField, defineType } from "sanity";

export const category = defineType({
	name: "category",
	title: "Categories",
	type: "document",
	fields: [
		defineField({ name: "title", title: "Title", type: "localizedString", validation: (rule) => rule.required() }),
		defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title.en" }, validation: (rule) => rule.required() }),
		defineField({ name: "description", title: "Description", type: "localizedString" }),
		defineField({ name: "color", title: "Badge color", type: "string", description: "CSS color, for example #8B5CF6" }),
	],
	preview: { select: { title: "title.en", subtitle: "slug.current" } },
});
