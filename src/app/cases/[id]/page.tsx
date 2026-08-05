import CaseDetails from "@/components/CaseDetails";
import { getCaseStudy, getCaseStudySlugs } from "@/sanity/lib/cases";
import { notFound } from "next/navigation";
import { buildContentMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/cases/[id]">) {
	const { id } = await params;
	const item = await getCaseStudy("en", id);
	if (!item) return {};
	return buildContentMetadata({
		locale: "en",
		path: `/cases/${id}`,
		title: item.metaTitle || item.case_title,
		description: item.metaDescription || `${item.problem}. ${item.triumph}.`,
		image: item.ogImageUrl || item.company_logo,
		noindex: item.noindex,
		translations: item.translations,
	});
}

export async function generateStaticParams() {
	return (await getCaseStudySlugs()).filter(({ language }) => language === "en").map(({ id }) => ({ id }));
}

export default async function CasePage({ params }: PageProps<"/cases/[id]">) {
	const { id } = await params;
	const caseItem = await getCaseStudy("en", id);

	if (!caseItem) notFound();

	return <CaseDetails caseItem={caseItem} />;
}
