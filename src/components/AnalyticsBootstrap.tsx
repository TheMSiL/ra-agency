"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ATTRIBUTION_CONSENT_KEY, captureAttribution, denyAnalyticsConsent, grantAnalyticsConsent } from "@/analytics/attribution";
import { dictionaries, hasLocale } from "@/i18n/config";

export default function AnalyticsBootstrap() {
	const pathname = usePathname();
	const localeSegment = pathname.split("/")[1] ?? null;
	const locale = hasLocale(localeSegment) ? localeSegment : "en";
	const t = (key: "consent.title" | "consent.text" | "consent.accept" | "consent.reject") => dictionaries[locale][key];
	const [choice, setChoice] = useState<string | null | undefined>(undefined);

	useEffect(() => {
		captureAttribution();
		queueMicrotask(() => setChoice(localStorage.getItem(ATTRIBUTION_CONSENT_KEY)));
	}, []);

	// Wait until the saved choice has been read on the client. Rendering the
	// banner during this initial state makes it flash for returning visitors.
	if (choice === undefined) return null;
	if (choice) return null;
	return (
		<div className="cookie_consent" role="dialog" aria-live="polite" aria-label={t("consent.title")}>
			<div><strong>{t("consent.title")}</strong><p>{t("consent.text")}</p></div>
			<div className="cookie_consent-actions">
				<button type="button" onClick={() => { denyAnalyticsConsent(); setChoice("denied"); }}>{t("consent.reject")}</button>
				<button type="button" className="cookie_consent-accept" onClick={() => { grantAnalyticsConsent(); setChoice("granted"); }}>{t("consent.accept")}</button>
			</div>
		</div>
	);
}
