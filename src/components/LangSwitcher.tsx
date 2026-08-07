"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/context/I18nContext";
import type { Locale } from "@/i18n/config";
import ArrowDownSwitcherSvg from "../../public/svg/ArrowDownSwitcherSvg";


interface LangSwitcherProps {
	variant?: "header" | "burger";
	onLocaleChange?: () => void;
	localePaths?: Partial<Record<Locale, string>>;
}

export default function LangSwitcher({ variant = "header", onLocaleChange, localePaths }: LangSwitcherProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { currentLocale, locales, setLocale, t } = useI18n();
	const pathname = usePathname();
	const router = useRouter();

	function handleLocaleChange(locale: Locale) {
		setLocale(locale);
		setIsOpen(false);
		onLocaleChange?.();
		const translatedPath = localePaths?.[locale];
		if (translatedPath) {
			router.push(translatedPath);
			return;
		}

		const segments = pathname.split("/");
		segments[1] = locale;
		router.push(segments.join("/") || `/${locale}`);
	}

	if (variant === "burger") {
		return (
			<div className="burger_languages" aria-label={t("language.switcherLabel")}>
				{locales.map((locale) => (
					<button
						type="button"
						key={locale.code}
						className={currentLocale.code === locale.code ? "active" : ""}
						aria-pressed={currentLocale.code === locale.code}
						onClick={() => handleLocaleChange(locale.code)}
					>
						{locale.label}
					</button>
				))}
			</div>
		);
	}

	return (
		<div className="relative">
			<button
				type="button"
				className={`flex items-center gap-[5px] cursor-pointer px-[18px] py-[6px] lang_switcher duration-300 ${isOpen ? "active" : ""}`}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-label={t("language.switcherLabel")}
				onClick={() => setIsOpen((value) => !value)}
			>
				<span className="font-medium text-[14px] leading-[140%]">
					{currentLocale.label}
				</span>
				<span className={`lang_switcher_arrow ${isOpen ? "active" : ""}`}>
					<ArrowDownSwitcherSvg />
				</span>
			</button>

			{isOpen && (
				<div className="lang_switcher_menu" role="listbox">
					{locales.map((locale) => (
						<button
							type="button"
							key={locale.code}
							className={`lang_switcher_option ${currentLocale.code === locale.code ? "active" : ""
								}`}
							role="option"
							aria-selected={currentLocale.code === locale.code}
							onClick={() => handleLocaleChange(locale.code)}
						>
							{locale.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
