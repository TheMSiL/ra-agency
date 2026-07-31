import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22", token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false });

const reviews = [
	{
		company: "Gifts.fun",
		author: "Team Gifts.fun",
		role: "",
		text: `Partnering with RA agency on Gifts.fun’s Telegram growth campaigns has been a strong experience from day one. In a fast-moving crypto environment, their team stayed highly responsive, quick to react, quick to iterate, and always aligned with what the data was signaling in real time.

What stood out most was the level of clarity. Reporting wasn’t just numbers on a dashboard, it was structured insight. Their transparent, analytics-driven tools gave us full visibility into performance, attribution, and optimization decisions. We always understood what was happening, why it was happening, and what would be tested next.

Integration was also seamless. From tracking setup to campaign execution, everything connected smoothly with our systems, making collaboration efficient and frictionless.

Responsive team, clear communication, transparent analytics, and easy integration, exactly what you want in a growth partner.`,
	},
	{
		company: "Tribute.top",
		author: "Denis Vishnevskiy",
		role: "Performance Marketing",
		text: `Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout.

Communication stood out from the start — clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely.

What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side. This significantly speeds up the launch process and reduces the margin for error — campaigns that typically take days to configure were live and running much faster.

We also saw results in segments we didn't expect to perform. Telegram Ads is often underestimated for B2B and creator-focused products, yet RA Agency found the right audience pockets and made them work.

Responsive team, smart targeting methodology, and a real edge in execution — exactly what you want in a growth partner.`,
	},
	{
		company: "Kripto Yeşil",
		author: "Sibel Sektan",
		role: "Founder, @cryptoyesil",
		text: "Before starting to work with RA agency, I tried several agencies, and each one lacked something. We met RA agency through a recommendation, and after learning about their working conditions, we started working together. During this process, I was absolutely delighted by how quickly the agency representatives answered all my questions, how well they understood my target audience, and how they created the best creative work for me. I thank the entire team; I've never seen such an organized team before. Thank you for everything, and we will continue to work with them forever.",
	},
	{
		company: "Kazutsugi",
		author: "Kazutsugi",
		role: "Crypto Channels",
		text: "You can always reach their team whenever you need assistance, and they’re always ready to provide technical support on any matter. They’re responsive, professional, and genuinely committed to helping. I’m confident they’ll do everything they can to ensure the best possible experience for their clients. Highly recommended!",
	},
	{
		company: "Tonzo",
		author: "Team Tonzo",
		role: "",
		text: `Working with RA on Tonzo’s Telegram campaigns has been great. The crypto and Telegram landscape shifts fast, and they were always quick to adapt — adjusting targeting, creatives and budgets based on what the data was actually showing.

Their reporting was clear and transparent, so we always knew what was working and why. Decisions felt grounded in metrics, not guesswork, and the iterative approach steadily improved performance over time.

Strong team, responsive communication, and very data-driven throughout.`,
	},
];

async function main() {
	const existingReviewIds = await client.fetch<string[]>(`*[_type == "review"]._id`);
	let transaction = client.transaction();

	for (const id of existingReviewIds) transaction = transaction.delete(id);

	for (const [index, review] of reviews.entries()) {
		transaction = transaction.createOrReplace({
			_id: `review-${String(index + 1).padStart(2, "0")}`,
			_type: "review",
			company: review.company,
			author: review.author,
			role: { _type: "localizedString", en: review.role, ru: review.role, ua: review.role },
			text: { _type: "localizedText", en: review.text, ru: review.text, ua: review.text },
			order: index + 1,
			isVisible: true,
		});
	}

	await transaction.commit();
	console.log(`Replaced ${existingReviewIds.length} existing reviews with ${reviews.length} new reviews.`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
