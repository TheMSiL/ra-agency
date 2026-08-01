"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type SiteSettings = {
	telegramLabel: string; telegramUrl: string; email: string;
	linkedinLabel: string; linkedinUrl: string; xLabel: string; xUrl: string;
};

export const defaultSiteSettings: SiteSettings = {
	telegramLabel: "@raagencytech", telegramUrl: "https://t.me/raagencytech",
	email: "hello@raagency.tech", linkedinLabel: "RA Agency",
	linkedinUrl: "https://www.linkedin.com/company/raagencytech",
	xLabel: "@raagencytech", xUrl: "https://x.com/raagencytech",
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
