import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22" });
const key = () => crypto.randomUUID().replaceAll("-", "").slice(0, 12);

type Section = { heading: string; paragraphs: string[]; bullets?: string[] };
type Article = { slug: string; title: string; excerpt: string; readTime: number; sections: Section[] };

const articles: Article[] = [
	{
		slug: "how-to-scale-meta-ads-without-breaking-cpa",
		title: "How to Scale Meta Ads Without Breaking Your CPA",
		excerpt: "A practical framework for increasing Meta Ads spend while protecting acquisition costs, creative performance, and lead quality.",
		readTime: 8,
		sections: [
			{ heading: "Scaling starts before the budget increase", paragraphs: ["A campaign is not ready to scale just because it produced several cheap conversions. Before adding budget, confirm that tracking is reliable, the offer converts after the lead, and performance holds across more than one creative. A weak funnel can look efficient for a few days and collapse as soon as Meta reaches beyond the easiest audience."] },
			{ heading: "Know the economic ceiling", paragraphs: ["Work backwards from contribution margin, sales conversion rate, and the percentage of qualified leads. This produces a maximum acceptable CPA or CPL. The number should guide every budget decision; platform averages and competitors' screenshots should not."], bullets: ["Define the maximum profitable CPA", "Track qualified leads and sales, not only form submissions", "Keep a margin for creative fatigue and delayed attribution"] },
			{ heading: "Increase spend in controlled steps", paragraphs: ["Large budget jumps can destabilize delivery. Increase proven ad sets gradually, watch results over a complete conversion cycle, and separate genuine deterioration from normal daily volatility. Horizontal scaling—new audiences, placements, or markets—can be safer than forcing all spend through one winner."] },
			{ heading: "Creative capacity is the real constraint", paragraphs: ["As reach grows, frequency rises and winning angles fatigue. A repeatable creative pipeline matters more than a single winning ad. Produce variations around proven hooks while reserving part of the testing budget for genuinely new concepts."] },
			{ heading: "Use a scale-or-stop dashboard", paragraphs: ["Review spend, qualified CPA, revenue, frequency, and creative-level conversion rate together. Scale when economics remain healthy; hold when the signal is mixed; cut when downstream quality or margin breaks. Controlled scaling is slower for a week and much faster over a quarter."] },
		],
	},
	{
		slug: "performance-max-vs-search-which-google-campaign-first",
		title: "Performance Max vs Search: Which Google Campaign Should You Launch First?",
		excerpt: "Choose the right Google Ads starting point based on demand, data quality, product feed strength, and the kind of control your business needs.",
		readTime: 7,
		sections: [
			{ heading: "The campaigns solve different problems", paragraphs: ["Search captures explicit intent: a person types a query and you decide which terms deserve a bid. Performance Max distributes ads across Google's inventory and uses automation to find conversions. Neither is universally better; the right starting point depends on how much reliable data and creative input you can provide."] },
			{ heading: "Start with Search when intent is clear", paragraphs: ["Search is usually the stronger first campaign for high-intent services, narrow B2B offers, local demand, and categories where query meaning matters. It exposes search terms, makes negative-keyword work possible, and shows whether the market responds to the offer."], bullets: ["Use tightly themed ad groups", "Connect calls, forms, and qualified offline conversions", "Review search terms before increasing budget"] },
			{ heading: "Start with Performance Max when the catalogue is the advantage", paragraphs: ["E-commerce brands with a clean Merchant Center feed, enough conversion history, and varied creative assets can benefit from Performance Max earlier. Product titles, images, margins, and conversion values become part of bidding quality, so feed work is campaign work."] },
			{ heading: "The strongest setup often uses both", paragraphs: ["Search can protect priority queries and reveal demand while Performance Max expands reach across Shopping, YouTube, Discover, Gmail, and Display. Clear brand rules, shared conversion definitions, and campaign-level profit reporting reduce overlap and make the combination measurable."] },
			{ heading: "Choose based on evidence", paragraphs: ["Launch the campaign that gives you the cleanest learning loop. If you need query control, begin with Search. If you have a strong feed and conversion data, test Performance Max. Add the second format only when tracking can explain what the first one achieved."] },
		],
	},
	{
		slug: "telegram-ads-creative-testing-framework",
		title: "A Creative Testing Framework for Telegram Ads",
		excerpt: "Turn Telegram Ads testing into a repeatable system for finding strong messages, protecting budget, and scaling beyond one lucky creative.",
		readTime: 7,
		sections: [
			{ heading: "Test messages, not cosmetic variations", paragraphs: ["Changing one adjective or emoji rarely produces useful learning. Start with distinct hypotheses: pain, aspiration, proof, urgency, comparison, or a specific use case. Each creative should make one clear promise to one audience."] },
			{ heading: "Build a simple testing matrix", paragraphs: ["Cross a small number of audience groups with a small number of message angles. Keep bids, landing pages, and measurement consistent long enough to compare outcomes. The goal is not maximum volume on day one; it is identifying combinations worth deeper investment."], bullets: ["One hypothesis per creative", "Comparable budgets and time windows", "A minimum evidence threshold before decisions", "Separate channel quality from message quality"] },
			{ heading: "Judge traffic after the click", paragraphs: ["A low CPM or high CTR can still produce weak users. Connect post-click events—registration, activation, purchase, deposit, or qualified conversation—and rank creatives by the business outcome closest to revenue."] },
			{ heading: "Scale the angle, then refresh the execution", paragraphs: ["When an angle works, expand it through new proof points, formats, and audience contexts rather than cloning the same wording indefinitely. This preserves the strategic insight while reducing fatigue."] },
			{ heading: "Keep a decision log", paragraphs: ["Record the hypothesis, audience, spend, primary metric, downstream quality, and decision for every meaningful test. Over time the log becomes a private playbook of what Telegram audiences respond to—and what your team should stop repeating."] },
		],
	},
	{
		slug: "meta-conversions-api-what-it-fixes-and-what-it-does-not",
		title: "Meta Conversions API: What It Fixes—and What It Does Not",
		excerpt: "Understand how Pixel and Conversions API work together, where attribution improves, and why server-side tracking cannot repair a weak funnel.",
		readTime: 8,
		sections: [
			{ heading: "Why browser-only tracking loses signal", paragraphs: ["Cookie restrictions, browser privacy controls, ad blockers, and slow pages can prevent browser events from reaching Meta. When signal disappears, reporting becomes less complete and delivery models have less information about who converts."] },
			{ heading: "What Conversions API adds", paragraphs: ["Conversions API sends selected events from a server or trusted integration. Used with Pixel, it can improve event coverage, resilience, and matching. The same action may arrive from both sources, so consistent event IDs are necessary for deduplication."], bullets: ["Send only events with a clear business meaning", "Use event IDs across browser and server sources", "Monitor match quality and deduplication", "Respect consent and data-protection requirements"] },
			{ heading: "Offline outcomes matter most for lead generation", paragraphs: ["For lead businesses, the form is not the final conversion. Passing qualified-lead, booked-call, and closed-sale events gives Meta a better optimization target than raw lead volume. This requires a disciplined CRM process and stable identifiers."] },
			{ heading: "What CAPI cannot fix", paragraphs: ["Server-side tracking cannot rescue a vague offer, a slow sales response, poor creative, or an unqualified audience. It improves the measurement and optimization signal; it does not create product-market fit."] },
			{ heading: "A useful implementation checklist", paragraphs: ["Validate event names and values, compare browser and server counts, test deduplication, document consent logic, and verify events in Meta's diagnostics before using them for optimization. Reliable tracking is an operating system, not a one-time technical task."] },
		],
	},
	{
		slug: "roas-cac-and-profit-metrics-that-control-growth",
		title: "ROAS, CAC, and Profit: The Metrics That Should Control Growth",
		excerpt: "Move beyond dashboard vanity metrics and connect ad spend to contribution margin, customer acquisition cost, and scalable profit.",
		readTime: 8,
		sections: [
			{ heading: "ROAS is useful but incomplete", paragraphs: ["Revenue divided by ad spend is easy to understand, but it ignores product margin, fulfilment, refunds, agency fees, sales costs, and repeat purchase. Two campaigns with the same ROAS can have very different profit."] },
			{ heading: "CAC connects marketing to customers", paragraphs: ["Customer acquisition cost should include the spend required to acquire an actual customer, not merely a click or lead. Lead-generation teams must multiply CPL by the real close rate and include the cost of sales operations."], bullets: ["Separate new and returning customers", "Use gross margin, not revenue alone", "Measure cohort payback time", "Include refunds and failed payments"] },
			{ heading: "Set targets from unit economics", paragraphs: ["Start with average order value, gross margin, repeat rate, close rate, and acceptable payback period. From those inputs, calculate the maximum CAC and the minimum contribution-margin ROAS. Targets should be specific to the business, market, and growth stage."] },
			{ heading: "Optimization needs two speeds", paragraphs: ["Platform metrics help with daily decisions; finance metrics confirm whether those decisions create value. Use fast indicators such as CTR and conversion rate for diagnostics, but make scale decisions from qualified CAC, margin, and payback."] },
			{ heading: "Build one shared scorecard", paragraphs: ["Marketing, sales, and finance should review the same definitions. When everyone agrees what a customer, revenue, margin, and acquisition cost mean, budget conversations become decisions instead of debates about competing dashboards."] },
		],
	},
	{
		slug: "building-a-cross-channel-paid-growth-system",
		title: "How to Build a Cross-Channel Paid Growth System",
		excerpt: "Coordinate Google, Meta, and Telegram Ads around one measurement model instead of running three disconnected campaign dashboards.",
		readTime: 9,
		sections: [
			{ heading: "Give every channel a job", paragraphs: ["Channels behave differently. Google Search captures existing intent, Meta can create and convert demand through rich creative, and Telegram reaches concentrated communities and contexts. A cross-channel plan starts by assigning a role to each channel rather than forcing them to report identical surface metrics."] },
			{ heading: "Standardize the conversion language", paragraphs: ["Define the funnel once: visit, lead, qualified lead, sale, repeat purchase, and revenue. Map every platform event to those business stages and document attribution windows. Without shared definitions, channel comparisons are mostly noise."], bullets: ["Use consistent UTM conventions", "Send qualified and revenue events where possible", "Keep a source-of-truth analytics layer", "Review blended and channel-level performance"] },
			{ heading: "Plan creative as a portfolio", paragraphs: ["Insights should travel between channels. A pain point discovered in Search terms can become a Meta hook; a Telegram message with strong activation can inform landing-page copy; a successful video can produce static and text variants."] },
			{ heading: "Allocate budget by marginal return", paragraphs: ["Do not fund channels only because their historical ROAS is highest. Ask where the next unit of budget can produce profitable incremental growth. Saturation, audience overlap, capacity, and payback period all affect the answer."] },
			{ heading: "Operate through a weekly growth loop", paragraphs: ["Review measurement health, funnel quality, creative learning, channel constraints, and next tests every week. The output should be a short list of actions with owners and expected evidence. Cross-channel growth becomes scalable when learning moves faster than spend."] },
		],
	},
];

const block = (style: "normal" | "h2", text: string) => ({
	_type: "block",
	_key: key(),
	style,
	markDefs: [],
	children: [{ _type: "span", _key: key(), marks: [], text }],
});

const bodyFor = (article: Article) => article.sections.flatMap((section) => [
	block("h2", section.heading),
	...section.paragraphs.map((paragraph) => block("normal", paragraph)),
	...(section.bullets ?? []).map((text) => ({ ...block("normal", text), listItem: "bullet", level: 1 })),
]);

async function main() {
	const base = await client.fetch(`*[_type == "article" && language == "en" && defined(coverImage.asset) && defined(category._ref) && defined(author._ref)][0]{coverImage, category, author, tags}`);
	if (!base?.coverImage?.asset?._ref || !base.category?._ref || !base.author?._ref) {
		throw new Error("A complete English article with cover, category, and author is required as an asset template");
	}

	let transaction = client.transaction();
	for (const article of articles) {
		transaction = transaction.createOrReplace({
			_id: `article-marketing-${article.slug}-en`,
			_type: "article",
			language: "en",
			title: article.title,
			slug: { _type: "slug", current: article.slug },
			excerpt: article.excerpt,
			coverImage: { ...base.coverImage, alt: article.title },
			category: base.category,
			tags: base.tags ?? [],
			author: base.author,
			body: bodyFor(article),
			relatedArticles: [],
			status: "draft",
			readTime: article.readTime,
			views: 0,
			isFeatured: false,
			metaTitle: article.title.slice(0, 60),
			metaDescription: article.excerpt.slice(0, 160),
			noindex: false,
		});
	}

	const result = await transaction.commit({ visibility: "sync" });
	console.log(`Imported ${articles.length} English marketing article drafts. Transaction: ${result.transactionId}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
