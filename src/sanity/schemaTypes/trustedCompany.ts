import { defineField, defineType } from "sanity";

export const trustedCompany = defineType({
	name: "trustedCompany",
	title: "Trusted companies",
	type: "document",
	fields: [
		defineField({ name: "name", title: "Company name", type: "string", validation: (rule) => rule.required() }),
		defineField({
			name: "showLogoAsIs",
			title: "Show uploaded logo as is",
			description: "Enable this when the uploaded image already includes the company name. No separate title will be shown.",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "caption",
			title: "Title",
			description: "Text shown next to the logo",
			type: "localizedString",
			hidden: ({ parent }) => parent?.showLogoAsIs === true,
			validation: (rule) => rule.custom((value, context) => {
				const parent = context.parent as { showLogoAsIs?: boolean } | undefined;
				if (parent?.showLogoAsIs) return true;
				if (value && typeof value === "object" && Object.values(value).some((item) => typeof item === "string" && item.trim())) return true;
				return "Add a title or enable “Show uploaded logo as is”.";
			}),
		}),
		defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
		defineField({ name: "order", title: "Order", type: "number", initialValue: 100, validation: (rule) => rule.integer().min(0) }),
		defineField({ name: "isVisible", title: "Show on site", type: "boolean", initialValue: true }),
	],
	orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "order", direction: "asc" }] }],
	preview: {
		select: { title: "name", subtitle: "caption.en", media: "logo", isVisible: "isVisible", showLogoAsIs: "showLogoAsIs" },
		prepare: ({ title, subtitle, media, isVisible, showLogoAsIs }) => ({
			title: `${isVisible === false ? "Hidden · " : ""}${title}`,
			subtitle: showLogoAsIs ? "Logo shown as uploaded" : subtitle,
			media,
		}),
	},
});
