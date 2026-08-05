import CaseDetails from "@/components/CaseDetails";
import { hasLocale } from "@/i18n/config";
import { getCaseStudy, getCaseStudySlugs } from "@/sanity/lib/cases";
import { notFound } from "next/navigation";
import { buildContentMetadata } from "@/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/cases/[id]">) {
	const { locale, id } = await params;
	if (!hasLocale(locale)) return {};
	const item = await getCaseStudy(locale, id);
	if (!item) return {};
	return buildContentMetadata({
		locale,
		path: `/cases/${id}`,
		title: item.metaTitle || item.case_title,
		description: item.metaDescription || `${item.problem}. ${item.triumph}.`,
		image: item.ogImageUrl || item.company_logo,
		noindex: item.noindex,
	});
}

export async function generateStaticParams() {
	return (await getCaseStudySlugs()).map(({ language: locale, id }) => ({ locale, id }));
}

export default async function CasePage({ params }: PageProps<"/[locale]/cases/[id]">) {
	const { locale, id } = await params;
	if (!hasLocale(locale)) notFound();
	const caseItem = await getCaseStudy(locale, id);

	if (!caseItem) notFound();

	return <CaseDetails caseItem={caseItem} />;
}
