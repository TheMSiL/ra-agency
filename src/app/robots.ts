import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN } from "@/seo/metadata";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
		sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
		host: CANONICAL_ORIGIN,
	};
}
