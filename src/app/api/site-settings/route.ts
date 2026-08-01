import { sanityClient } from "@/sanity/lib/client";

export async function GET() {
	const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{telegramLabel, telegramUrl, email, linkedinLabel, linkedinUrl, xLabel, xUrl}`, {}, { cache: "no-store" });
	return Response.json(settings ?? {});
}
