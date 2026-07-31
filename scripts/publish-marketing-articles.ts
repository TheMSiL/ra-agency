import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22" }).withConfig({ perspective: "raw" });
const sourceId = "article-marketing-building-a-cross-channel-paid-growth-system-en";

async function main() {
	const articles = await client.fetch<Array<{
		_id: string;
		title: string;
		coverImage?: { asset?: { _ref?: string }; [key: string]: unknown };
	}>>(`*[_type == "article" && _id match "article-marketing-*"]|order(title asc){_id,title,coverImage}`);
	if (articles.length !== 6) throw new Error(`Expected 6 marketing articles, found ${articles.length}`);

	const source = articles.find(({ _id }) => _id === sourceId);
	if (!source?.coverImage?.asset?._ref) throw new Error("The first article does not have a reusable cover image asset");

	const now = Date.now();
	let transaction = client.transaction();
	for (const [index, article] of articles.entries()) {
		transaction = transaction.patch(article._id, (patch) => patch.set({
			coverImage: { ...source.coverImage, alt: article.title },
			status: "published",
			publishedAt: new Date(now - index * 60_000).toISOString(),
			noindex: false,
		}));
	}

	const result = await transaction.commit({ visibility: "sync" });
	console.log(`Published ${articles.length} articles with the shared cover. Transaction: ${result.transactionId}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
