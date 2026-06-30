export const locales = [
	{ code: "en", label: "EN", htmlLang: "en" },
	{ code: "ru", label: "RU", htmlLang: "ru" },
	{ code: "ua", label: "UA", htmlLang: "uk" },
] as const;

export type Locale = (typeof locales)[number]["code"];

export const defaultLocale = "en" satisfies Locale;

const en = {
	"language.switcherLabel": "Choose language",
	"language.en": "English",
	"language.ru": "Russian",
	"language.ua": "Ukrainian",
} as const;

export type TranslationKey = keyof typeof en;

export const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
	en,
	ru: {
		"language.switcherLabel": "Выбрать язык",
		"language.en": "Английский",
		"language.ru": "Русский",
		"language.ua": "Украинский",
	},
	ua: {
		"language.switcherLabel": "Обрати мову",
		"language.en": "Англійська",
		"language.ru": "Російська",
		"language.ua": "Українська",
	},
};

export function hasLocale(value: string | null): value is Locale {
	return locales.some((locale) => locale.code === value);
}

export function getLocaleMeta(locale: Locale) {
	return locales.find((item) => item.code === locale) ?? locales[0];
}
