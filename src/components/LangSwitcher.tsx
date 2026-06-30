"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import type { Locale } from "@/i18n/config";
import ArrowDownSwitcherSvg from "../../public/svg/ArrowDownSwitcherSvg";


export default function LangSwitcher() {
	const [isOpen, setIsOpen] = useState(false);
	const { currentLocale, locales, setLocale, t } = useI18n();

	function handleLocaleChange(locale: Locale) {
		setLocale(locale);
		setIsOpen(false);
	}

	return (
		<div className="relative">
			<button
				type="button"
				className={`flex items-center gap-1 cursor-pointer px-4 py-1 lang_switcher duration-300 ${isOpen ? "active" : ""}`}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-label={t("language.switcherLabel")}
				onClick={() => setIsOpen((value) => !value)}
			>
				<span className="font-medium text-[13px] leading-[140%]">
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
