import { createClient } from "next-sanity";

export const sanityWriteClient = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
	apiVersion: "2026-07-22",
	useCdn: false,
	token: process.env.SANITY_API_WRITE_TOKEN,
});
