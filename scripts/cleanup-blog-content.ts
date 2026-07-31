import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-22" }).withConfig({ perspective: "raw" });

const categoryBySlug: Record<string, string> = {
	"how-to-scale-meta-ads-without-breaking-cpa": "86f5ee5b-9bde-498b-9054-162c03785462",
	"performance-max-vs-search-which-google-campaign-first": "69879b14-432b-4b05-819e-b694a9936116",
	"telegram-ads-creative-testing-framework": "78f82b20-d7cd-4470-9da9-88e1f3156103",
	"meta-conversions-api-what-it-fixes-and-what-it-does-not": "86f5ee5b-9bde-498b-9054-162c03785462",
	"roas-cac-and-profit-metrics-that-control-growth": "69879b14-432b-4b05-819e-b694a9936116",
	"building-a-cross-channel-paid-growth-system": "86f5ee5b-9bde-498b-9054-162c03785462",
};

const keptCategoryIds = new Set(Object.values(categoryBySlug));

async function main() {
	const [newArticles, oldArticleIds, categories, tagIds] = await Promise.all([
		client.fetch<Array<{ _id: string; slug: string }>>(`*[_type == "article" && _id match "article-marketing-*"]{_id, "slug": slug.current}`),
		client.fetch<string[]>(`*[_type == "article" && !(_id match "article-marketing-*")]._id`),
		client.fetch<Array<{ _id: string }>>(`*[_type == "category"]{_id}`),
		client.fetch<string[]>(`*[_type == "tag"]._id`),
	]);
	const metadataIds = oldArticleIds.length === 0 ? [] : await client.fetch<string[]>(
		`*[_type == "translation.metadata" && count(translations[value._ref in $ids]) > 0]._id`,
		{ ids: oldArticleIds.map((id) => id.replace(/^drafts\./, "")) },
	);

	if (newArticles.length !== 6) throw new Error(`Expected 6 new marketing articles, found ${newArticles.length}`);

	let transaction = client.transaction();
	for (const article of newArticles) {
		const categoryId = categoryBySlug[article.slug];
		if (!categoryId) throw new Error(`No category mapping for ${article.slug}`);
		transaction = transaction.patch(article._id, (patch) => patch
			.set({ category: { _type: "reference", _ref: categoryId }, tags: [], relatedArticles: [] }));
	}

	for (const id of metadataIds) transaction = transaction.delete(id);
	for (const id of oldArticleIds) transaction = transaction.delete(id);
	for (const category of categories) {
		if (!keptCategoryIds.has(category._id)) transaction = transaction.delete(category._id);
	}
	for (const id of tagIds) transaction = transaction.delete(id);

	const result = await transaction.commit({ visibility: "sync" });
	console.log(`Kept ${newArticles.length} new article drafts.`);
	console.log(`Deleted ${oldArticleIds.length} old articles, ${metadataIds.length} translation records, ${categories.length - keptCategoryIds.size} old categories, and ${tagIds.length} tags.`);
	console.log(`Transaction: ${result.transactionId}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
