import CaseDetails from "@/components/CaseDetails";
import { casesItems } from "@/data/cases";
import { locales } from "@/i18n/config";
import { notFound } from "next/navigation";

export function generateStaticParams() {
	return locales.flatMap(({ code: locale }) => casesItems.map(({ id }) => ({ locale, id })));
}

export default async function CasePage({ params }: PageProps<"/[locale]/cases/[id]">) {
	const { id } = await params;
	const caseItem = casesItems.find((item) => item.id === id);

	if (!caseItem) notFound();

	return <CaseDetails caseItem={caseItem} />;
}
