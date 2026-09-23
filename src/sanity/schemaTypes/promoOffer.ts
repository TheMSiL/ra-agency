import { defineField, defineType } from "sanity";

/**
 * The popup that interrupts the visitor after a delay. Everything about it used
 * to be hard-coded in components/PromoPopup.tsx, so changing a discount meant a
 * deploy.
 *
 * Like siteSettings this is a de-facto singleton: the site reads the first
 * document of the type and ignores any others.
 */
export const promoOffer = defineType({
	name: "promoOffer",
	title: "Promo offer",
	type: "document",
	fields: [
		defineField({
			name: "enabled",
			title: "Show the offer",
			description: "Turn off to hide the popup across the whole site without deleting the copy.",
			type: "boolean",
			initialValue: true,
		}),
		defineField({
			name: "delaySeconds",
			title: "Delay before it appears, seconds",
			description: "Counted from the moment the page opens. A visitor who has already dismissed it will not see it again in the same session.",
			type: "number",
			initialValue: 30,
			validation: (rule) => rule.min(0).max(600),
		}),
		// Any language left blank falls back to the copy bundled with the site, so
		// a half-filled document never leaves the popup with an empty heading.
		defineField({ name: "eyebrow", title: "Eyebrow", type: "localizedString" }),
		defineField({ name: "title", title: "Title", type: "localizedString" }),
		defineField({ name: "text", title: "Description", type: "localizedText" }),
		defineField({ name: "cta", title: "Button label", type: "localizedString" }),
	],
	preview: { prepare: () => ({ title: "Promo offer" }) },
});
