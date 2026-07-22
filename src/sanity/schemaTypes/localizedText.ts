import { defineField, defineType } from "sanity";

export const localizedText = defineType({
	name: "localizedText",
	title: "Long translations",
	type: "object",
	fields: [
		defineField({ name: "en", title: "English", type: "text", rows: 7 }),
		defineField({ name: "ru", title: "Русский", type: "text", rows: 7 }),
		defineField({ name: "ua", title: "Українська", type: "text", rows: 7 }),
	],
});
