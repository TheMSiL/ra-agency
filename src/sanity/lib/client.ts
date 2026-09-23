import { createClient } from "next-sanity";

export const sanityClient = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
	apiVersion: "2026-07-22",
	useCdn: true,
});

/**
 * Every page on the site fetches from Sanity, and an unhandled rejection in a
 * server component takes the whole route down — one CDN hiccup used to turn the
 * marketing site into a 500. None of this content is worth that: the caller
 * hands over what to show instead and the page renders degraded rather than not
 * at all. `revalidate: 60` on each query means a degraded render is replaced as
 * soon as Sanity answers again.
 *
 * The failure is logged rather than swallowed, so it is still visible in the
 * server logs and in the build output.
 */
export async function fetchWithFallback<T>(label: string, query: () => Promise<T>, fallback: T): Promise<T> {
	try {
		return await query();
	} catch (error) {
		console.error(`[sanity] ${label} failed, serving fallback`, error);
		return fallback;
	}
}
