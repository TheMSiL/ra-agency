import { defineQuery } from "next-sanity";
import type { Locale } from "@/i18n/config";
import { sanityClient } from "./client";

export type TrustedCompany = {
	id: string;
	name: string;
	caption: string;
	logoUrl: string;
};

const trustedCompaniesQuery = defineQuery(`
	*[_type == "trustedCompany" && isVisible != false && defined(logo.asset)] | order(order asc, _createdAt asc) {
		"id": _id,
		name,
		"caption": coalesce(caption[$language], caption.en, caption.ru, caption.ua, name),
		"logoUrl": logo.asset->url
	}
`);

export async function getTrustedCompanies(language: Locale): Promise<TrustedCompany[]> {
	return sanityClient.fetch(trustedCompaniesQuery, { language }, { next: { revalidate: 60, tags: ["trusted-companies"] } });
}
