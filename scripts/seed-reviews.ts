import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22", token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false });

const descriptions = [
	"Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start — clear, fast, and without unnecessary back-and-forth. The team always knew what we needed and responded precisely.",
	"The RA Agency team helped us turn Telegram Ads from an experimental channel into a stable acquisition source. They rebuilt the campaign structure, separated warm and cold audiences, and kept testing creatives without losing control of the budget.",
	"RA Agency combined careful audience segmentation with a clear testing system. Reporting was easy to understand, decisions were quick, and every campaign change had a clear reason behind it.",
	"We needed a partner who could move quickly, understand our offer, and keep performance readable for the whole team. RA Agency handled the media buying, targeting logic, and optimization rhythm with real ownership.",
	"Before working together, our campaigns were inconsistent and difficult to scale. RA Agency gave us a cleaner setup, sharper channel selection, and a testing framework that made results easier to compare.",
	"The best part of working with RA Agency was how predictable the process felt: clear weekly learnings, practical next steps, transparent communication, and no wasted motion.",
];

async function main() {
	const image = await readFile(join(process.cwd(), "public", "company_review.png"));
	const asset = await client.assets.upload("image", image, { filename: "company_review.png" });

	for (const [index, description] of descriptions.entries()) {
		await client.createOrReplace({
			_id: `review-${String(index + 1).padStart(2, "0")}`,
			_type: "review",
			company: "Company name",
			logo: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
			author: "Name Surname",
			role: { _type: "localizedString", en: "Position", ru: "Должность", ua: "Посада" },
			text: { _type: "localizedText", en: description, ru: description, ua: description },
			order: index + 1,
			isVisible: true,
		});
	}

	console.log("Created 6 editable review documents.");
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
