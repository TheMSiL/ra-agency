import { fetchWithFallback, sanityClient } from "@/sanity/lib/client";

// Separate from /api/site-settings, which is no-store because it carries the
// contact details a lead lands on. Promo copy changes a few times a month, so a
// minute of caching costs nothing and saves a Sanity round trip per visitor.
export async function GET() {
	const offer = await fetchWithFallback(
		"promo offer",
		() =>
			sanityClient.fetch(
				`*[_type == "promoOffer"][0]{enabled, delaySeconds, eyebrow, title, text, cta}`,
				{},
				{ next: { revalidate: 60, tags: ["promo-offer"] } },
			),
		null,
	);

	// An empty body is a valid answer: PromoPopup then runs on the copy and delay
	// it ships with, which is what every visitor saw before this document existed.
	return Response.json(offer ?? {});
}
