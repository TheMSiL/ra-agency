import { I18nProvider } from "@/context/I18nContext";
import { hasLocale, locales } from "@/i18n/config";
import { notFound } from "next/navigation";

export function generateStaticParams() {
	return locales.map(({ code }) => ({ locale: code }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
	const { locale } = await params;

	if (!hasLocale(locale)) notFound();

	return <I18nProvider initialLocale={locale}>{children}</I18nProvider>;
}
