"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useSyncExternalStore,
} from "react";
import {
	defaultLocale,
	dictionaries,
	getLocaleMeta,
	hasLocale,
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
};

const storageKey = "ra-agency-locale";
const localeChangeEvent = "ra-agency-locale-change";

const I18nContext = createContext<I18nContextValue | null>(null);

function getBrowserLocale(): Locale {
	const browserLanguage = window.navigator.language.split("-")[0];

	if (hasLocale(browserLanguage)) {
		return browserLanguage;
	}

	return defaultLocale;
}

function getStoredLocale(): Locale {
	const savedLocale = window.localStorage.getItem(storageKey);

	if (hasLocale(savedLocale)) {
		return savedLocale;
	}

	return getBrowserLocale();
}

function subscribeToLocaleChange(callback: () => void) {
	window.addEventListener("storage", callback);
	window.addEventListener(localeChangeEvent, callback);

	return () => {
		window.removeEventListener("storage", callback);
		window.removeEventListener(localeChangeEvent, callback);
	};
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const locale = useSyncExternalStore<Locale>(
		subscribeToLocaleChange,
		getStoredLocale,
		() => defaultLocale
	);

	useEffect(() => {
		document.documentElement.lang = getLocaleMeta(locale).htmlLang;
		window.localStorage.setItem(storageKey, locale);
	}, [locale]);

	const setLocale = useCallback((nextLocale: Locale) => {
		window.localStorage.setItem(storageKey, nextLocale);
		window.dispatchEvent(new Event(localeChangeEvent));
	}, []);

	const currentLocale = useMemo(() => getLocaleMeta(locale), [locale]);

	const t = useCallback(
		(key: TranslationKey) => dictionaries[locale][key] ?? dictionaries.en[key],
		[locale]
	);

	const value = useMemo(
		() => ({
			locale,
			setLocale,
			currentLocale,
			locales,
			t,
		}),
		[currentLocale, locale, setLocale, t]
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
