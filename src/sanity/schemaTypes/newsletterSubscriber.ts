import { defineField, defineType } from "sanity";

export const newsletterSubscriber = defineType({
	name: "newsletterSubscriber",
	title: "Newsletter subscribers",
	type: "document",
	fields: [
		defineField({ name: "email", title: "Email", type: "string", readOnly: true, validation: (rule) => rule.required().email() }),
		defineField({
			name: "locale",
			title: "Language",
			type: "string",
			readOnly: true,
			options: { list: [{ title: "English", value: "en" }, { title: "Русский", value: "ru" }, { title: "Українська", value: "ua" }] },
		}),
		defineField({ name: "isActive", title: "Subscribed", type: "boolean", initialValue: true }),
		defineField({ name: "subscribedAt", title: "Subscribed at", type: "datetime", readOnly: true }),
		defineField({ name: "unsubscribedAt", title: "Unsubscribed at", type: "datetime", readOnly: true }),
		defineField({ name: "resendContactId", title: "Resend contact ID", type: "string", readOnly: true }),
		defineField({ name: "syncStatus", title: "Email sync", type: "string", readOnly: true, options: { list: ["synced", "pending", "failed"] } }),
	],
	preview: {
		select: { title: "email", locale: "locale", active: "isActive", subscribedAt: "subscribedAt" },
		prepare: ({ title, locale, active, subscribedAt }) => ({
			title,
			subtitle: `${active ? "Active" : "Unsubscribed"} · ${String(locale ?? "en").toUpperCase()} · ${subscribedAt ? new Date(subscribedAt).toLocaleDateString() : ""}`,
		}),
	},
});
