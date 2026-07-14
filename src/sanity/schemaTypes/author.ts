import { defineField, defineType } from "sanity";

export const author = defineType({
	name: "author",
	title: "Authors",
	type: "document",
	fields: [
		defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
		defineField({ name: "avatar", title: "Avatar", type: "image", options: { hotspot: true } }),
		defineField({ name: "bio", title: "Bio", type: "localizedString" }),
		defineField({
			name: "socials",
			title: "Social links",
			type: "array",
			of: [{ type: "object", fields: [
				{ name: "label", title: "Label", type: "string" },
				{ name: "url", title: "URL", type: "url" },
			] }],
		}),
	],
	preview: { select: { title: "name", media: "avatar" } },
});
