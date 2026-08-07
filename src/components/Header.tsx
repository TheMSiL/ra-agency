"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Burger from "./Burger";
import LangSwitcher from "./LangSwitcher";
import LocalizedLink from "./LocalizedLink";
import type { Locale } from "@/i18n/config";

export default function Header({ localePaths }: { localePaths?: Partial<Record<Locale, string>> }) {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const updateHeader = () => setIsScrolled(window.scrollY > 8);

		updateHeader();
		window.addEventListener("scroll", updateHeader, { passive: true });

		return () => window.removeEventListener("scroll", updateHeader);
	}, []);

	return (
		<header className={`pt-5 header${isScrolled ? " header_scrolled" : ""}`}>
			<div className="content_container flex items-center justify-between">
				<LocalizedLink href='/'>
					<Image src='/logo.svg' alt="logo" width={50} height={35} loading="eager" />
				</LocalizedLink>
				<div className="flex items-center gap-10">
					<div className="header_lang_switcher">
						<LangSwitcher localePaths={localePaths} />
					</div>
					<Burger localePaths={localePaths} />
				</div>
			</div>
		</header>
	);
}
