import { readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22" });

const sourcePath = process.env.CONTENT_IMPORT_FILE;
if (!sourcePath) throw new Error("Set CONTENT_IMPORT_FILE to the supplied case-study text file");

const source = readFileSync(sourcePath, "utf8").replaceAll("\r\n", "\n");

type Locale = "ru" | "ua";
type CaseCopy = {
	language: Locale;
	label: string;
	channel: "telegram" | "google" | "meta";
	company: string;
	title: string;
	problem: string;
	fix: string;
	work: string;
	triumph: string;
	steps: Array<{ title: string; description: string }>;
	results: Array<{ title: string; value: string }>;
};

const compact = (value: string) => value.trim().replace(/\n+/g, " ").replace(/\s+/g, " ");

const capture = (text: string, pattern: RegExp, field: string) => {
	const value = text.match(pattern)?.[1];
	if (!value?.trim()) throw new Error(`Could not parse ${field} from case block: ${text.slice(0, 160)}`);
	return compact(value);
};

const languageAt = (offset: number): Locale => {
	const preceding = source.slice(0, offset);
	return /Кейси на сайт Тг Адс укр:/i.test(preceding) ? "ua" : "ru";
};

const visitCardPattern = /(?:VISIT CARD \(homepage preview\):?|VISIT CARD):?\s*\n/gi;
const starts = [...source.matchAll(visitCardPattern)];

const parsed: CaseCopy[] = starts.map((match, index) => {
	const start = (match.index ?? 0) + match[0].length;
	const end = starts[index + 1]?.index ?? source.length;
	const chunk = source.slice(start, end);
	const language = languageAt(match.index ?? 0);
	const label = capture(chunk, /Label:\s*([^\n]+)/i, "label");
	const company = capture(chunk, /Client:\s*([^\n]+)/i, "client");
	const channel = label.toLowerCase().startsWith("telegram")
		? "telegram"
		: label.toLowerCase().startsWith("meta")
			? "meta"
			: "google";
	const title = capture(
		chunk,
		/Client:\s*[^\n]+\n(?:Title:\s*\n)?([\s\S]*?)\n\s*The Problem/i,
		"title",
	);
	const problem = capture(chunk, /The Problem\s*\n([\s\S]*?)\n\s*Our Fix/i, "problem");
	const fix = capture(chunk, /Our Fix\s*\n([\s\S]*?)\n\s*The Work/i, "fix");
	const work = capture(chunk, /The Work\s*\n([\s\S]*?)\n\s*The Triumph/i, "work");
	const triumph = capture(chunk, /The Triumph\s*\n([\s\S]*?)\n\s*EXPANDED VIEW/i, "triumph");
	const expanded = chunk.split(/EXPANDED VIEW0?/i)[1] ?? "";
	const steps = [...expanded.matchAll(/\[(\d+)\]\s*([^\n]+)\n([\s\S]*?)(?=\n\s*\[\d+\]|\n\s*RESULTS)/g)].map(
		(step) => ({ title: compact(step[2]), description: compact(step[3]) }),
	);
	if (steps.length === 0) throw new Error(`No expanded steps parsed for ${company} (${language})`);
	const resultTitles = language === "ru"
		? ["Основной результат", "Выполненная работа", "Ключевой подход"]
		: ["Основний результат", "Виконана робота", "Ключовий підхід"];
	const results = [
		{ title: resultTitles[0], value: capture(expanded, /PRIMARY OUTCOME\s*[—-]\s*([^\n]+)/i, "primary outcome") },
		{ title: resultTitles[1], value: capture(expanded, /WORK COMPLETED\s*[—-]\s*([^\n]+)/i, "work completed") },
		{ title: resultTitles[2], value: capture(expanded, /CORE APPROACH\s*[—-]\s*([^\n]+)/i, "core approach") },
	];
	return { language, label, channel, company, title, problem, fix, work, triumph, steps, results };
});

const normalizedKey = (channel: string, company: string) =>
	`${channel}:${(
		channel === "telegram" && company.trim().toLowerCase() === "telegram mini app"
			? "telegram mini app nda"
			: company
	).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()}`;

async function main() {
	const counts = parsed.reduce<Record<Locale, number>>((result, item) => {
		result[item.language] += 1;
		return result;
	}, { ru: 0, ua: 0 });
	console.log(`Parsed ${parsed.length} translations: ${counts.ru} RU, ${counts.ua} UA.`);

	const duplicates = parsed.filter((item, index) => parsed.findIndex((candidate) =>
		candidate.language === item.language && normalizedKey(candidate.channel, candidate.company) === normalizedKey(item.channel, item.company),
	) !== index);
	if (duplicates.length > 0) throw new Error(`Duplicate translations: ${duplicates.map(({ language, company }) => `${language}:${company}`).join(", ")}`);

	if (process.env.DRY_RUN === "1") {
		for (const item of parsed) console.log(`${item.language.toUpperCase()} ${item.channel.padEnd(8)} ${item.company}`);
		return;
	}

	const existing = await client.fetch<Array<{
		_id: string;
		language: string;
		companyName: string;
		channel: string;
		slug: string;
		publishedAt?: string;
		isFeatured?: boolean;
		status?: string;
	}>>(`*[_type == "caseStudy"]{_id, language, companyName, channel, "slug": slug.current, publishedAt, isFeatured, status}`);

	const existingByKey = new Map(existing.map((item) => [
		`${item.language}:${normalizedKey(item.channel, item.companyName)}`,
		item,
	]));
	const missing = parsed.filter((item) => !existingByKey.has(`${item.language}:${normalizedKey(item.channel, item.company)}`));
	if (missing.length > 0) {
		const related = existing
			.filter((item) => /mini|app/i.test(item.companyName))
			.map((item) => `${item.language}:${item.companyName}`)
			.join(", ");
		throw new Error(`Missing localized Sanity documents: ${missing.map(({ language, company }) => `${language}:${company}`).join(", ")}. Related existing documents: ${related || "none"}`);
	}

	let transaction = client.transaction();
	for (const item of parsed) {
		const document = existingByKey.get(`${item.language}:${normalizedKey(item.channel, item.company)}`)!;
		transaction = transaction.patch(document._id, (patch) => patch.set({
			title: item.title,
			problem: item.problem,
			fix: item.fix,
			work: item.work,
			triumph: item.triumph,
			steps: item.steps.map((step, index) => ({ _type: "caseStep", _key: `step${index + 1}`, ...step })),
			results: item.results.map((result, index) => ({ _type: "caseResult", _key: `result${index + 1}`, ...result })),
			metaTitle: item.title.slice(0, 60),
			metaDescription: `${item.problem} ${item.triumph}`.slice(0, 160),
		}));
	}

	const result = await transaction.commit({ visibility: "sync" });
	console.log(`Updated ${parsed.length} localized case documents. Transaction: ${result.transactionId}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
