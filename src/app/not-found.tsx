"use client";

import Link from "next/link";

import StatusScreen from "@/components/StatusScreen";
import { useI18n } from "@/context/I18nContext";

// Serves both halves of the routing table: URLs that match nothing, and the
// notFound() calls in app/[locale]/cases/[id] and app/[locale]/blog/[id] for a
// slug Sanity does not have. The locale comes from the path via I18nContext, so
// a Russian visitor on a dead link keeps reading Russian.
export default function NotFound() {
	const { t, localizedPath } = useI18n();

	return (
		<StatusScreen
			code="404"
			title={t("notFound.title")}
			text={t("notFound.text")}
			actions={
				<>
					<Link className="btn home_hero-btn" href={localizedPath("/")}>
						{t("notFound.home")}
					</Link>
					<Link className="btn home_hero-btn" href={localizedPath("/cases")}>
						{t("notFound.cases")}
					</Link>
				</>
			}
		/>
	);
}
