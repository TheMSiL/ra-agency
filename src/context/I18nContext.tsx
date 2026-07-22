"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	defaultLocale,
	dictionaries,
	getLocaleMeta,
	locales,
	type Locale,
	type TranslationKey,
} from "@/i18n/config";

type I18nContextValue = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	currentLocale: (typeof locales)[number];
	locales: typeof locales;
	t: (key: TranslationKey) => string;
	localizedPath: (path: string) => string;
};

const storageKey = "ra-agency-locale";
const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
	children,
	initialLocale = defaultLocale,
}: {
	children: React.ReactNode;
	initialLocale?: Locale;
}) {
	const [locale, setActiveLocale] = useState<Locale>(initialLocale);

	useEffect(() => {
		document.documentElement.lang = getLocaleMeta(locale).htmlLang;
		window.localStorage.setItem(storageKey, locale);
	}, [locale]);

	const setLocale = useCallback((nextLocale: Locale) => {
		setActiveLocale(nextLocale);
		window.localStorage.setItem(storageKey, nextLocale);
	}, []);

	const currentLocale = useMemo(() => getLocaleMeta(locale), [locale]);

	const t = useCallback(
		(key: TranslationKey) => dictionaries[locale][key] ?? dictionaries.en[key],
		[locale]
	);
	const localizedPath = useCallback(
		(path: string) => path === "/" ? `/${locale}` : `/${locale}${path.startsWith("/") ? path : `/${path}`}`,
		[locale]
	);

	const value = useMemo(
		() => ({
			locale,
			setLocale,
			currentLocale,
			locales,
			t,
			localizedPath,
		}),
		[currentLocale, locale, localizedPath, setLocale, t]
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	const context = useContext(I18nContext);

	if (!context) {
		throw new Error("useI18n must be used inside I18nProvider");
	}

	return context;
}
