import { defineField, defineType } from "sanity";

export const newsletterDelivery = defineType({
	name: "newsletterDelivery",
	title: "Newsletter deliveries",
	type: "document",
	fields: [
		defineField({ name: "articleId", title: "Article ID", type: "string", readOnly: true }),
		defineField({ name: "articleTitle", title: "Article", type: "string", readOnly: true }),
		defineField({ name: "locale", title: "Language", type: "string", readOnly: true }),
		defineField({ name: "status", title: "Status", type: "string", readOnly: true, options: { list: ["processing", "scheduled", "sent", "failed"] } }),
		defineField({ name: "broadcastId", title: "Resend broadcast ID", type: "string", readOnly: true }),
		defineField({ name: "sentAt", title: "Sent / scheduled at", type: "datetime", readOnly: true }),
		defineField({ name: "error", title: "Error", type: "text", readOnly: true }),
	],
	preview: {
		select: { title: "articleTitle", status: "status", locale: "locale" },
		prepare: ({ title, status, locale }) => ({ title, subtitle: `${status ?? "processing"} · ${String(locale ?? "en").toUpperCase()}` }),
	},
});
