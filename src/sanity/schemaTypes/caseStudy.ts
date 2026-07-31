import { defineArrayMember, defineField, defineType, type SlugIsUniqueValidator } from "sanity";

const normalizeDocumentId = (id: string) => id.replace(/^drafts\./, "");

const isUniqueCaseSlug: SlugIsUniqueValidator = async (slug, context) => {
	const documentId = context.document?._id;
	if (!documentId) return context.defaultIsUnique(slug, context);

	const publishedId = normalizeDocumentId(documentId);
	const client = context.getClient({ apiVersion: "2026-07-22" });
	const result = await client.fetch<{ duplicateIds: string[]; translationIds: string[] | null }>(
		`{
			"duplicateIds": *[
				_type == "caseStudy" &&
				slug.current == $slug &&
				!(_id in [$publishedId, $draftId])
			]._id,
			"translationIds": *[
				_type == "translation.metadata" && references($publishedId)
			][0].translations[].value._ref
		}`,
		{ slug, publishedId, draftId: `drafts.${publishedId}` },
	);

	const translationIds = new Set((result.translationIds ?? []).map(normalizeDocumentId));
	return result.duplicateIds.every((id) => translationIds.has(normalizeDocumentId(id)));
};

export const caseStudy = defineType({
	name: "caseStudy",
	title: "Case studies",
	type: "document",
	groups: [
		{ name: "content", title: "Content", default: true },
		{ name: "publication", title: "Publication" },
		{ name: "seo", title: "SEO" },
	],
	fields: [
		defineField({ name: "language", type: "string", readOnly: true, hidden: true }),
		defineField({ name: "title", title: "Case title", type: "string", group: "content", validation: (rule) => rule.required() }),
		defineField({
			name: "slug", title: "Slug", type: "slug", group: "content",
			options: { source: "title", maxLength: 96, isUnique: isUniqueCaseSlug },
			validation: (rule) => rule.required(),
		}),
		defineField({ name: "companyName", title: "Company name", type: "string", group: "content", validation: (rule) => rule.required() }),
		defineField({
			name: "companyLogo", title: "Company logo", type: "image", group: "content", options: { hotspot: true },
			fields: [{ name: "alt", title: "Alternative text", type: "string", validation: (rule) => rule.required() }],
		}),
		defineField({
			name: "channel", title: "Advertising channel", type: "string", group: "content",
			options: { list: [
				{ title: "Telegram Ads", value: "telegram" },
				{ title: "Google Ads", value: "google" },
				{ title: "Meta Ads", value: "meta" },
			] },
			validation: (rule) => rule.required(),
		}),
		defineField({ name: "problem", title: "Problem", type: "string", group: "content", validation: (rule) => rule.required() }),
		defineField({ name: "fix", title: "Our fix", type: "string", group: "content", validation: (rule) => rule.required() }),
		defineField({ name: "work", title: "The work", type: "string", group: "content", validation: (rule) => rule.required() }),
		defineField({ name: "triumph", title: "The triumph", type: "string", group: "content", validation: (rule) => rule.required() }),
		defineField({
			name: "steps", title: "Project steps", type: "array", group: "content",
			of: [defineArrayMember({
				type: "object", name: "caseStep", title: "Step",
				fields: [
					defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
					defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (rule) => rule.required() }),
				],
				preview: { select: { title: "title", subtitle: "description" } },
			})],
			validation: (rule) => rule.required().min(1).max(7),
		}),
		defineField({
			name: "results", title: "Results", type: "array", group: "content",
			of: [defineArrayMember({
				type: "object", name: "caseResult", title: "Result",
				fields: [
					defineField({ name: "title", title: "Metric", type: "string", validation: (rule) => rule.required() }),
					defineField({ name: "value", title: "Value", type: "string", validation: (rule) => rule.required() }),
				],
				preview: { select: { title: "title", subtitle: "value" } },
			})],
			validation: (rule) => rule.required().min(1).max(3),
		}),
		defineField({
			name: "status", title: "Status", type: "string", group: "publication", initialValue: "draft",
			options: { list: [
				{ title: "Draft", value: "draft" },
				{ title: "Scheduled", value: "scheduled" },
				{ title: "Published", value: "published" },
				{ title: "Unpublished", value: "unpublished" },
			] },
			description: "For scheduled publication, select Scheduled, set a future date, then publish the Sanity document.",
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: "publishedAt", title: "Publication date", type: "datetime", group: "publication",
			description: "Scheduled content becomes visible automatically when this date is reached.",
			validation: (rule) => rule.custom((date, context) => context.document?.status === "scheduled" && !date ? "Publication date is required for scheduled content" : true),
		}),
		defineField({ name: "isFeatured", title: "Featured case", type: "boolean", group: "publication", initialValue: false }),
		defineField({ name: "metaTitle", title: "Meta title", type: "string", group: "seo", validation: (rule) => rule.max(60) }),
		defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 3, group: "seo", validation: (rule) => rule.max(160) }),
		defineField({ name: "ogImage", title: "Open Graph image", type: "image", group: "seo" }),
		defineField({ name: "noindex", title: "Prevent indexing", type: "boolean", group: "seo", initialValue: false }),
	],
	preview: {
		select: { title: "title", company: "companyName", language: "language", status: "status", media: "companyLogo" },
		prepare: ({ title, company, language, status, media }) => ({
			title,
			subtitle: `${company ?? "—"} · ${language?.toUpperCase() ?? "—"} · ${status}`,
			media,
		}),
	},
});
