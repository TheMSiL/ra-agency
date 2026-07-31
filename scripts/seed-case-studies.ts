import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22", token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false });
const languages = ["en", "ru", "ua"] as const;

type CaseSeed = {
	slug: string;
	company: string;
	title: string;
	problem: string;
	fix: string;
	work: string;
	triumph: string;
	steps: Array<{ title: string; description: string }>;
	results: Array<{ title: string; value: string }>;
};

const cases: CaseSeed[] = [
	{
		slug: "telegram-moderation-72-hours",
		company: "Dating Project",
		title: "Telegram Ads Moderation Passed in 72 Hours",
		problem: "Campaigns kept getting declined and traffic was stuck.",
		fix: "A compliant funnel built strictly by Telegram Ads rules.",
		work: "Funnel + redirect to the client's project, sent to moderation.",
		triumph: "Passed in 72h — live 3+ months, zero declines.",
		steps: [
			{ title: "Audit and diagnosis", description: "We reviewed the account and the declined campaigns and confirmed the main constraint: ads kept getting rejected in moderation, so traffic couldn't move." },
			{ title: "Strategy", description: "We built a focused action plan around the core solution: a white-hat funnel that meets Telegram Ads rules instead of fighting moderation head-on." },
			{ title: "Implementation", description: "The team built the setup and completed the main work: a compliant funnel with a redirect to the client's project." },
			{ title: "Moderation", description: "We submitted the funnel with every element aligned to platform requirements — and it cleared review in 72 hours." },
			{ title: "Sustained result", description: "With the funnel approved, it kept running clean and delivered the final outcome: 3+ months live, steady traffic, zero declines." },
		],
		results: [{ title: "Primary outcome", value: "Passed in 72 hours" }, { title: "Work completed", value: "3+ months live, 0 declines" }, { title: "Core approach", value: "White-hat funnel by the rules" }],
	},
	{
		slug: "telegram-crypto-turkey-subscribers",
		company: "Crypto Project · Turkey",
		title: "6,940 Subscribers at $1.44 Each",
		problem: "Expensive subscribers and campaigns moderation kept rejecting.",
		fix: "A conversion-built channel plus creatives that pass review.",
		work: "35 creatives tested, top 5 scaled, placements tuned.",
		triumph: "$1.44 per sub — less than half the $2 KPI.",
		steps: [
			{ title: "Audit and diagnosis", description: "We reviewed the brief and the account and confirmed the main constraints: subscribers were too expensive and campaigns kept getting rejected in moderation. We agreed on the KPI — $2 per subscriber — and opened the ad account." },
			{ title: "Strategy", description: "We built a focused action plan around the core solution: a channel set up for sign-up conversion, backed by broad creative testing and placement control instead of relying on a single creative." },
			{ title: "Implementation", description: "The team completed the main work: advised on the channel setup for better sign-up conversion, then produced and launched the creative testing." },
			{ title: "Testing and optimization", description: "The first test came in at $3 per subscriber — too expensive. We tested 35 creatives, picked the top 5 to scale, and adjusted placements to spend less during national holidays." },
			{ title: "Scaling the result", description: "After stabilizing performance, we scaled the winning setup and delivered the final outcome: 6,940 subscribers at $1.44 each — well under KPI." },
		],
		results: [{ title: "Primary outcome", value: "$1.44 per subscriber (KPI was $2)" }, { title: "Work completed", value: "6,940 subs on $10,000 spend" }, { title: "Core approach", value: "Conversion channel + 35 tested creatives" }],
	},
	{
		slug: "telegram-active-creators-cost",
		company: "Telegram Paid-Subscriptions Service",
		title: "Cost per Active Creator Cut 10× — 833 € → 73 €",
		problem: "Cold targeting delivered creators at 833 € each — far too expensive.",
		fix: "Retarget competitors' audiences and buy out their traffic.",
		work: "Full traffic buyout via our own CPM bidder across all competitor channels.",
		triumph: "73 € per creator — a 10× drop, 68 active creators.",
		steps: [
			{ title: "Audit and diagnosis", description: "We reviewed the niche and goals — paid subscriptions on Telegram, CIS + worldwide, a 7,500 € budget — and ran a test on classic cold targeting to confirm the baseline: 2,500 € spend brought 152 leads but only 3 active creators, at 833 € each." },
			{ title: "Strategy", description: "We built a focused action plan around the core solution: stop paying for cold reach and instead concentrate spend on competitors' warm audiences, buying out their traffic directly." },
			{ title: "Implementation", description: "The team completed the main work: narrowed targeting to competitors' audiences only and set up full traffic buyout through our own CPM bidder — covering every competitor channel plus our own media sources." },
			{ title: "Testing and optimization", description: "We compared the reworked buyout approach against the cold-targeting baseline and redirected the full budget toward the setup that converted leads into active creators, not just clicks." },
			{ title: "Scaling the result", description: "After the new approach proved out, we scaled it and delivered the final outcome: 5,000 € spend brought 884 leads and 68 active creators at 73 € each — a 10× cost reduction." },
		],
		results: [{ title: "Primary outcome", value: "73 € per creator (from 833 €)" }, { title: "Work completed", value: "68 active creators · 884 leads" }, { title: "Core approach", value: "Competitor traffic buyout via CPM bidder" }],
	},
	{
		slug: "telegram-vpn-cac",
		company: "VPN Project",
		title: "CAC Cut 3× — $9 → $3 in a VPN Project",
		problem: "Broad targeting delivered paying users at $9 — too expensive to scale.",
		fix: "One campaign per channel/bot, each with its own UTM and CAC.",
		work: "507 campaigns across 4 segments, tracked and pruned per source.",
		triumph: "CAC down to $3 — best source at $0.22.",
		steps: [
			{ title: "Audit and diagnosis", description: "We put the first $500 into testing broad hypotheses to confirm the baseline: CAC came out at $9 — expensive, but it gave us a solid data pool for the next rounds." },
			{ title: "Strategy", description: "We built a focused action plan around the core solution: drop broad targeting and move to a 1 campaign = 1 channel/bot structure, so every source gets its own UTM link and a separately calculated CAC." },
			{ title: "Implementation", description: "The team completed the main work: launched across four audience segments — competitor VPN bots, niche VPN channels, news channels, and IT/Tech channels — running 507 campaigns with 13 creatives in one language over two weeks." },
			{ title: "Testing and optimization", description: "We ran a tight optimization loop on subscription data sent every 1–2 days, matched against UTM: campaigns above $4 CAC paused, campaigns under $3 given more budget, and top sources whitelisted and duplicated into fresh campaigns." },
			{ title: "Scaling the result", description: "After the loop stabilized performance, we scaled the winning sources and delivered the final outcome on $3k spend: 1,019 paying users and CAC down from $9 to $3." },
		],
		results: [{ title: "Primary outcome", value: "CAC $9 → $3" }, { title: "Work completed", value: "1,019 paying users · 507 campaigns" }, { title: "Core approach", value: "1 campaign = 1 channel, UTM-tracked" }],
	},
	{
		slug: "telegram-crypto-subscriber-cost",
		company: "Crypto Project",
		title: "Cost per Subscriber $2 → $0.57 in Crypto",
		problem: "$2 per subscriber and constant moderation rejections.",
		fix: "Clean creatives that pass review, launched channel by channel.",
		work: "SPY + AI channel selection, fraud filtered, best channels pooled.",
		triumph: "$0.57 per sub — 3.5× cheaper, KPI was $1.",
		steps: [
			{ title: "Audit and diagnosis", description: "We took on the project with a $5,000 budget and a 3-week timeline, and confirmed the main constraints: $2 per subscriber and a stream of moderation rejections. In the research phase ($1,000) we found top channels using SPY services and our AI selection tool and tested creative formats — expensive at $2, but we knew where to dig." },
			{ title: "Strategy", description: "We built a focused action plan around the core solution: fix what moderation was cutting and concentrate spend on channels that actually convert, instead of pushing flashy banners that kept getting declined." },
			{ title: "Implementation", description: "In the cleanup phase ($2,000) the team completed the main work: selected the working creatives, replaced the flashy banners that moderation was rejecting, launched one channel at a time, and filtered out fraud — bringing the cost to $0.50 per subscriber." },
			{ title: "Testing and optimization", description: "We validated which channels held their cost and quality, keeping the winners and cutting the rest so budget only went to sources that performed." },
			{ title: "Scaling the result", description: "In the scaling phase ($2,000) we pooled the best channels and scaled, delivering the final outcome: $0.74 per subscriber during scaling and $0.57 across the full campaign." },
		],
		results: [{ title: "Primary outcome", value: "$0.57 per subscriber (KPI was $1)" }, { title: "Work completed", value: "$2 → $0.57 · 3.5× cheaper" }, { title: "Core approach", value: "Clean creatives + channel-by-channel launch" }],
	},
	{
		slug: "telegram-tonzo-wallet-cost",
		company: "Tonzo",
		title: "Cost per Wallet $2.00 → $0.56 — 3.6× Cheaper",
		problem: "Connected wallets were coming in at $2.00 — KPI hit, but with room to improve.",
		fix: "Test creatives at scale, then isolate one channel per campaign.",
		work: "50+ creatives across segments, weak channels cut, winners scaled.",
		triumph: "$0.56 per wallet — 30,000 wallets, 3.6× cheaper.",
		steps: [
			{ title: "Audit and diagnosis", description: "We started with a $1,000 test to confirm the channel works for the product — a blockchain lottery inside Telegram aiming for connected wallets at a reasonable cost. Result: $2.00 per wallet, KPI hit and the client happy, but we saw clear room to improve." },
			{ title: "Strategy", description: "We built a focused action plan around the core solution: test creatives at scale to find what resonates per audience, then isolate performance channel by channel instead of scaling on averaged data." },
			{ title: "Implementation", description: "The team completed the main work: ran 50+ creatives across traders, gamers, and casino audiences, kept what converted and cut what didn't — bringing cost to $1.00 per wallet on ad quality alone, before channel selection even began." },
			{ title: "Testing and optimization", description: "We used our internal 1 campaign = 1 channel tool to see exactly which channels performed, with no averaged data masking weak results: channels with bots or poor conversion were cut immediately, and the strong ones got more budget. Best individual channels hit $0.20 per wallet." },
			{ title: "Scaling the result", description: "After isolating the winners, we scaled and delivered the final outcome: $0.35 per wallet on average at scale, and $0.56 across the full campaign — 30,000 connected wallets on a $17,000 budget." },
		],
		results: [{ title: "Primary outcome", value: "$0.56 per wallet (from $2.00)" }, { title: "Work completed", value: "30,000 wallets on $17,000" }, { title: "Core approach", value: "50+ creatives + 1 campaign = 1 channel" }],
	},
	{
		slug: "telegram-mini-app-675k-users",
		company: "Telegram Mini App (TMA)",
		title: "675K Users at $0.075 Each",
		problem: "Scaling a TMA needs more than raw traffic — data, automation, and creative.",
		fix: "Deep analytics plus automated placement on newly launched games.",
		work: "50+ creatives, bot channels filtered, 4 language markets.",
		triumph: "675,000 players at $0.075 — over 10 months.",
		steps: [
			{ title: "Audit and diagnosis", description: "Before spending a dollar, we set up the foundation: deep analytics connected directly to the client's dashboard for real-time data, plus a tool for automatic link generation to track every source. The constraint was clear — scaling a Telegram Mini App takes data and automation, not just traffic." },
			{ title: "Strategy", description: "We built a focused action plan around the core solution: target the right markets and games, keep traffic clean of bots, and get onto new games before competitors arrive." },
			{ title: "Implementation", description: "The team completed the main work: targeted English, Russian, Spanish, and Indonesian markets, scraped top TMAs filtered by category (Games, Crypto, Tech), and used partner analytics to filter out bot-heavy channels for pure human traffic." },
			{ title: "Testing and optimization", description: "We launched 50+ unique creatives to find the winners and redirected budget toward what converted, keeping traffic quality high across every source." },
			{ title: "Scaling the result", description: "We built a custom tool to place ads automatically on newly launched games before competitors arrived, then scaled — delivering the final outcome: 675,000 players at $0.075 each over 10 months, with 150% ROAS on new-game channels." },
		],
		results: [{ title: "Primary outcome", value: "$0.075 per user" }, { title: "Work completed", value: "675,000 players on $51,418" }, { title: "Core approach", value: "Auto-placement on new games + bot filtering" }],
	},
	{
		slug: "telegram-mini-app-nda-players",
		company: "Telegram Mini App (NDA)",
		title: "36,000 Players at $0.045 Each",
		problem: "Test channels delivered users at $0.10–0.12 with CTR below 1%.",
		fix: "Scrape top TMA channels, filter bots, target real monetized audiences.",
		work: "One creative, bot traffic and inflated stats cut out.",
		triumph: "36,000 players in 2 weeks at $0.045 (0.012 TON) each.",
		steps: [
			{ title: "Audit and diagnosis", description: "The client — a Telegram Mini App, name under NDA — came to us with one goal: high-quality users, fast. We launched test campaigns across channels that talk about Mini Apps to confirm the baseline: $0.10–0.12 per user and CTR below 1%. Not good enough." },
			{ title: "Strategy", description: "We built a focused action plan around the core solution: stop advertising on channels that merely discuss Mini Apps and instead target channels with real, monetized audiences — clean of bots and inflated stats." },
			{ title: "Implementation", description: "The team completed the main work: scraped all the top-performing TMA channels, filtered out bot traffic and inflated stats, and locked in on channels with genuine monetized audiences." },
			{ title: "Testing and optimization", description: "We concentrated spend on the channels that proved real and cut everything padded or bot-heavy, holding quality high — the shift lifted CTR to 2.09% and dropped cost per user well below the test baseline." },
			{ title: "Scaling the result", description: "Running on a single creative against the cleaned channel set, we delivered the final outcome: 36,000 players in just 2 weeks at $0.045 (0.012 TON) each." },
		],
		results: [{ title: "Primary outcome", value: "$0.045 per user (0.012 TON)" }, { title: "Work completed", value: "36,000 players in 2 weeks" }, { title: "Core approach", value: "Top TMA channels, bot traffic filtered" }],
	},
];

const key = () => crypto.randomUUID().replaceAll("-", "").slice(0, 12);

async function main() {
	const existingIds = await client.fetch<string[]>(`*[_type == "caseStudy" && channel == "telegram"]._id`);
	const metadataIds = existingIds.length === 0 ? [] : await client.fetch<string[]>(
		`*[_type == "translation.metadata" && count(translations[value._ref in $ids]) > 0]._id`,
		{ ids: existingIds },
	);
	let transaction = client.transaction();

	for (const id of metadataIds) transaction = transaction.delete(id);
	for (const id of existingIds) transaction = transaction.delete(id);

	const now = Date.now();
	for (const [caseIndex, item] of cases.entries()) {
		for (const language of languages) {
			transaction = transaction.createOrReplace({
				_id: `case-${item.slug}-${language}`,
				_type: "caseStudy",
				language,
				title: item.title,
				slug: { _type: "slug", current: item.slug },
				companyName: item.company,
				channel: "telegram",
				problem: item.problem,
				fix: item.fix,
				work: item.work,
				triumph: item.triumph,
				steps: item.steps.map((step) => ({ _type: "caseStep", _key: key(), ...step })),
				results: item.results.map((result) => ({ _type: "caseResult", _key: key(), ...result })),
				status: "published",
				publishedAt: new Date(now - caseIndex * 86_400_000).toISOString(),
				isFeatured: caseIndex === 0,
				metaTitle: item.title.slice(0, 60),
				metaDescription: `${item.problem} ${item.triumph}`.slice(0, 160),
				noindex: false,
			});
		}

		transaction = transaction.createOrReplace({
			_id: `translation.metadata.case-${item.slug}`,
			_type: "translation.metadata",
			schemaTypes: ["caseStudy"],
			translations: languages.map((language) => ({
				_type: "internationalizedArrayReferenceValue",
				_key: key(),
				language,
				value: { _type: "reference", _ref: `case-${item.slug}-${language}` },
			})),
		});
	}

	const result = await transaction.commit({ visibility: "sync" });
	console.log(`Replaced ${existingIds.length} Telegram case documents with ${cases.length * languages.length} documents for ${cases.length} new cases. Transaction: ${result.transactionId}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
