import { defineQuery } from "next-sanity";
import type { Locale } from "@/i18n/config";
import { sanityClient } from "./client";

export type SanityReview = {
	id: string;
	icon?: string;
	title: string;
	author: string;
	role: string;
	description: string;
};

const reviewsQuery = defineQuery(`
	*[_type == "review" && isVisible != false] | order(order asc, _createdAt asc) {
		"id": _id,
		"icon": logo.asset->url,
		"title": company,
		author,
		"role": coalesce(role[$language], role.en, role.ru, role.ua, ""),
		"description": coalesce(text[$language], text.en, text.ru, text.ua, "")
	}
`);

export async function getReviews(language: Locale): Promise<SanityReview[]> {
	return sanityClient.fetch(reviewsQuery, { language }, { next: { revalidate: 60, tags: ["reviews"] } });
}
