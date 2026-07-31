import { readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22" });
const locales = ["en", "ru", "ua"] as const;

const sourcePath = process.env.CONTENT_IMPORT_FILE;
if (!sourcePath) throw new Error("Set CONTENT_IMPORT_FILE to the supplied case-study text file");

const source = readFileSync(sourcePath, "utf8").replaceAll("\r\n", "\n");
const chunks = source.split(/VISIT CARD \(homepage preview\)/i).slice(1);

const capture = (text: string, pattern: RegExp, field: string) => {
	const value = text.match(pattern)?.[1]?.trim();
	if (!value) throw new Error(`Could not parse ${field} from case block: ${text.slice(0, 120)}`);
	return value.replace(/\n+/g, " ").replace(/\s+/g, " ");
};

const slugify = (value: string) => value
	.toLowerCase()
	.normalize("NFKD")
	.replace(/[^a-z0-9]+/g, "-")
	.replace(/^-|-$/g, "")
	.slice(0, 80);

const key = () => crypto.randomUUID().replaceAll("-", "").slice(0, 12);

const parsed = chunks.map((chunk) => {
	const label = capture(chunk, /Label:\s*([^\n]+)/i, "label");
	const company = capture(chunk, /Client:\s*([^\n]+)/i, "client");
	const title = capture(chunk, /Title:\s*\n([\s\S]*?)\n\s*\nThe Problem/i, "title");
	const problem = capture(chunk, /The Problem\s*\n([\s\S]*?)\n\s*\nOur Fix/i, "problem");
	const fix = capture(chunk, /Our Fix\s*\n([\s\S]*?)\n\s*\nThe Work/i, "fix");
	const work = capture(chunk, /The Work\s*\n([\s\S]*?)\n\s*\nThe Triumph/i, "work");
	const triumph = capture(chunk, /The Triumph\s*\n([\s\S]*?)\n\s*\nEXPANDED VIEW/i, "triumph");
	const expanded = chunk.split(/EXPANDED VIEW0?/i)[1] ?? "";
	const steps = [...expanded.matchAll(/\[(\d+)\]\s*([^\n]+)\n([\s\S]*?)(?=\n\s*\n\[\d+\]|\n\s*\nRESULTS)/g)]
		.map((match) => ({ title: match[2].trim(), description: match[3].trim().replace(/\s+/g, " ") }));
	const results = [
		{ title: "Primary outcome", value: capture(expanded, /PRIMARY OUTCOME\s*-\s*([^\n]+)/i, "primary outcome") },
		{ title: "Work completed", value: capture(expanded, /WORK COMPLETED\s*-\s*([^\n]+)/i, "work completed") },
		{ title: "Core approach", value: capture(expanded, /CORE APPROACH\s*-\s*([^\n]+)/i, "core approach") },
	];
	if (steps.length === 0) throw new Error(`No expanded steps parsed for ${company}`);
	return {
		label,
		channel: label.toLowerCase().startsWith("meta") ? "meta" : "google",
		company,
		title,
		problem,
		fix,
		work,
		triumph,
		steps,
		results,
		slug: slugify(`${company}-${title}`),
	};
});

const cases = [...new Map(parsed.map((item) => [`${item.channel}:${item.company}:${item.title}`, item])).values()];

async function main() {
	console.log(`Parsed ${parsed.length} case blocks; ${cases.length} are unique.`);
	for (const item of cases) console.log(`${item.channel.padEnd(6)} ${item.slug}`);
	if (process.env.DRY_RUN === "1") return;

	const now = Date.now();
	let transaction = client.transaction();
	for (const [caseIndex, item] of cases.entries()) {
		for (const language of locales) {
			transaction = transaction.createOrReplace({
				_id: `case-${item.slug}-${language}`,
				_type: "caseStudy",
				language,
				title: item.title,
				slug: { _type: "slug", current: item.slug },
				companyName: item.company,
				channel: item.channel,
				problem: item.problem,
				fix: item.fix,
				work: item.work,
				triumph: item.triumph,
				steps: item.steps.map((step) => ({ _type: "caseStep", _key: key(), ...step })),
				results: item.results.map((result) => ({ _type: "caseResult", _key: key(), ...result })),
				status: "published",
				publishedAt: new Date(now - caseIndex * 86_400_000).toISOString(),
				isFeatured: caseIndex < 3,
				metaTitle: item.title.slice(0, 60),
				metaDescription: `${item.problem} ${item.triumph}`.slice(0, 160),
				noindex: false,
			});
		}

		transaction = transaction.createOrReplace({
			_id: `translation.metadata.case-${item.slug}`,
			_type: "translation.metadata",
			schemaTypes: ["caseStudy"],
			translations: locales.map((language) => ({
				_type: "internationalizedArrayReferenceValue",
				_key: key(),
				language,
				value: { _type: "reference", _ref: `case-${item.slug}-${language}` },
			})),
		});
	}

	const result = await transaction.commit({ visibility: "sync" });
	console.log(`Imported ${cases.length * locales.length} case documents. Transaction: ${result.transactionId}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
