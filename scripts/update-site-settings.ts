import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22" });

async function main() {
	const existingId = await client.fetch<string | null>(`*[_type == "siteSettings"][0]._id`);
	const id = existingId?.replace(/^drafts\./, "") ?? "siteSettings";
	const result = await client.createOrReplace({
		_id: id,
		_type: "siteSettings",
		telegramLabel: "RA Agency Bot",
		telegramUrl: "https://t.me/ra_agency_bot?start=ra_site_welcome",
		telegramChannelLabel: "RA Agency",
		telegramChannelUrl: "https://t.me/+TCZaWDh2hdNkM2Q6",
		email: "sales@raagency.tech",
		linkedinLabel: "Coming soon",
		xLabel: "@ra_agency_tech",
		xUrl: "https://x.com/ra_agency_tech?s=11",
	});
	console.log(`Updated site settings: ${result._id}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
