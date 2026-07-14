import { defineField, defineType } from "sanity";

export const localizedString = defineType({
	name: "localizedString",
	title: "Translations",
	type: "object",
	fields: [
		defineField({ name: "en", title: "English", type: "string" }),
		defineField({ name: "ru", title: "Русский", type: "string" }),
		defineField({ name: "ua", title: "Українська", type: "string" }),
	],
});
