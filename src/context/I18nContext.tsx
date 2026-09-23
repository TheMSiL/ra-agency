"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { usePathname } from "next/navigation";
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
	// The URL, not the prop, is what decides the language.
	//
	// Two of these providers are mounted on every localized page: the root layout
	// opens one above app/[locale] and can only pass the default locale, and
	// app/[locale]/layout.tsx opens a second one with the real locale. React
	// flushes the child's effects before the parent's, so the outer provider used
	// to stamp `en` over the language the inner one had just written to <html>,
	// and the pieces the root layout renders outside app/[locale] — PromoPopup —
	// drew their copy from the default locale no matter which language the page
	// was in. Deriving the locale from the path makes every provider on the page
	// agree, which is also how LangSwitcher already switches languages: it pushes
	// a locale-prefixed route.
	const pathname = usePathname();
	const routeLocale = useMemo(() => {
		const segment = pathname?.split("/")[1] ?? null;
		return hasLocale(segment) ? segment : initialLocale;
	}, [initialLocale, pathname]);

	// The switcher calls setLocale() so the menu repaints without waiting for
	// router.push to land. Remembering which route the choice was made on is what
	// expires it: once the pathname changes the recorded route no longer matches
	// and the URL takes over again, with no effect and no extra render.
	const [pending, setPending] = useState<{ locale: Locale; madeOn: Locale } | null>(null);
	const locale = pending?.madeOn === routeLocale ? pending.locale : routeLocale;

	useEffect(() => {
		document.documentElement.lang = getLocaleMeta(locale).htmlLang;
		window.localStorage.setItem(storageKey, locale);
	}, [locale]);

	const setLocale = useCallback(
		(nextLocale: Locale) => {
			setPending({ locale: nextLocale, madeOn: routeLocale });
			window.localStorage.setItem(storageKey, nextLocale);
		},
		[routeLocale],
	);

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
