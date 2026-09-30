import { getLocaleMeta, type Locale } from "@/i18n/config";
import { CANONICAL_ORIGIN } from "./metadata";

const ORGANIZATION_ID = `${CANONICAL_ORIGIN}/#organization`;

// Profiles Google may list as the brand's own. Mirrors the defaults in
// SiteSettingsContext; tracking params are left off on purpose.
const SOCIAL_PROFILES = [
	"https://www.linkedin.com/company/ra-agency-tech/",
	"https://x.com/ra_agency_tech",
	"https://t.me/+TCZaWDh2hdNkM2Q6",
];

/**
 * Organization + WebSite for the homepage. WebSite is where Google reads the
 * site name shown above the URL in results; Organization supplies the logo and
 * ties the social profiles to the brand. Both are what Google looks at when it
 * decides a query is a search for this site, the case in which it shows
 * sitelinks. The logo is the square touch icon: Google crops logos to a square
 * and wants at least 112px.
 */
export function homeJsonLd(locale: Locale) {
	const homeUrl = `${CANONICAL_ORIGIN}/${locale}`;

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				"@id": ORGANIZATION_ID,
				name: "RA Agency",
				url: CANONICAL_ORIGIN,
				logo: {
					"@type": "ImageObject",
					url: `${CANONICAL_ORIGIN}/apple-touch-icon.png`,
					width: 180,
					height: 180,
				},
				sameAs: SOCIAL_PROFILES,
			},
			{
				"@type": "WebSite",
				"@id": `${homeUrl}#website`,
				name: "RA Agency",
				alternateName: ["RA", "raagency.tech"],
				url: homeUrl,
				inLanguage: getLocaleMeta(locale).htmlLang,
				publisher: { "@id": ORGANIZATION_ID },
			},
		],
	};
}
