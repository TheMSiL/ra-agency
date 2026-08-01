import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
	name: "siteSettings",
	title: "Contacts & social networks",
	type: "document",
	fields: [
		defineField({ name: "telegramLabel", title: "Telegram username", type: "string" }),
		defineField({ name: "telegramUrl", title: "Telegram URL", type: "url" }),
		defineField({ name: "email", title: "Email", type: "string" }),
		defineField({ name: "linkedinLabel", title: "LinkedIn label", type: "string" }),
		defineField({ name: "linkedinUrl", title: "LinkedIn URL", type: "url" }),
		defineField({ name: "xLabel", title: "X label", type: "string" }),
		defineField({ name: "xUrl", title: "X URL", type: "url" }),
	],
	preview: { prepare: () => ({ title: "Contacts & social networks" }) },
});
