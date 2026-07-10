import CaseDetails from "@/components/CaseDetails";
import { casesItems } from "@/data/cases";
import { notFound } from "next/navigation";

export function generateStaticParams() {
	return casesItems.map(({ id }) => ({ id }));
}

export default async function CasePage({ params }: PageProps<"/cases/[id]">) {
	const { id } = await params;
	const caseItem = casesItems.find((item) => item.id === id);

	if (!caseItem) notFound();

	return <CaseDetails caseItem={caseItem} />;
}
