import { defineField, defineType } from "sanity";

export const lead = defineType({
	name: "lead",
	title: "Form submissions",
	type: "document",
	fields: [
		defineField({ name: "name", title: "Name", type: "string" }),
		defineField({ name: "contactMethod", title: "Contact method", type: "string" }),
		defineField({ name: "contact", title: "Contact", type: "string" }),
		defineField({ name: "details", title: "Details", type: "text" }),
		defineField({ name: "source", title: "Source", type: "string" }),
		defineField({ name: "attribution", title: "Attribution", type: "text" }),
		defineField({ name: "submittedAt", title: "Submitted at", type: "datetime" }),
	],
	preview: {
		select: { title: "name", subtitle: "contact" },
	},
});
