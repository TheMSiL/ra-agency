"use client";

import { useEffect } from "react";

import StatusScreen from "@/components/StatusScreen";
import { useI18n } from "@/context/I18nContext";

// Catches render failures anywhere below the root layout. The queries in
// src/sanity/lib fall back to cached or bundled content rather than throwing,
// so reaching this screen means something genuinely unexpected happened — worth
// logging, and worth offering reset() since the usual cause is transient.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const { t } = useI18n();

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<StatusScreen
			code="500"
			title={t("error.title")}
			text={t("error.text")}
			actions={
				<button type="button" className="btn home_hero-btn" onClick={reset}>
					{t("error.retry")}
				</button>
			}
		/>
	);
}
