"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type SiteSettings = {
	telegramLabel: string; telegramUrl: string; email: string;
	telegramChannelLabel: string; telegramChannelUrl: string;
	linkedinLabel: string; linkedinUrl: string; xLabel: string; xUrl: string;
};

export const defaultSiteSettings: SiteSettings = {
	telegramLabel: "RA Agency Bot", telegramUrl: "https://t.me/ra_agency_bot?start=ra_site_welcome",
	telegramChannelLabel: "RA Agency", telegramChannelUrl: "https://t.me/+TCZaWDh2hdNkM2Q6",
	email: "sales@raagency.tech", linkedinLabel: "Coming soon", linkedinUrl: "",
	xLabel: "@ra_agency_tech", xUrl: "https://x.com/ra_agency_tech?s=11",
};

const SiteSettingsContext = createContext(defaultSiteSettings);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useState(defaultSiteSettings);
	useEffect(() => {
		fetch("/api/site-settings").then((response) => response.ok ? response.json() : null)
			.then((data) => { if (data) setSettings({ ...defaultSiteSettings, ...data }); })
			.catch(() => undefined);
	}, []);
	return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
