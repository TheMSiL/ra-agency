import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({
	apiVersion: "2026-07-22",
	token: process.env.SANITY_API_WRITE_TOKEN,
	useCdn: false,
});

async function main() {
	for (let index = 1; index <= 10; index += 1) {
		const filename = `${index}.png`;
		const image = await readFile(join(process.cwd(), "public", "trust", filename));
		const asset = await client.assets.upload("image", image, { filename });

		await client.createOrReplace({
			_id: `trusted-company-${String(index).padStart(2, "0")}`,
			_type: "trustedCompany",
			name: `Partner ${String(index).padStart(2, "0")}`,
			caption: {
				_type: "localizedString",
				en: "Test partner caption",
				ru: "Тестовая подпись партнёра",
				ua: "Тестовий підпис партнера",
			},
			logo: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
			order: index,
			isVisible: true,
		});
	}

	console.log("Created 10 trusted company documents with uploaded logos.");
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
