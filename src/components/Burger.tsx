"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useI18n } from "@/context/I18nContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BurgerCloseSvg from "../../public/svg/BurgerCloseSvg";
import BurgerSvg from "../../public/svg/BurgerSvg";
import LangSwitcher from "./LangSwitcher";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const menuItems = [
	{ label: "nav.home", href: "/" }, { label: "nav.about", href: "/about" },
	{ label: "nav.cases", href: "/cases" }, { label: "nav.blog", href: "/blog" },
	{ label: "nav.contacts", href: "/contacts" }, { label: "nav.google", href: "/google-ads" },
	{ label: "nav.telegram", href: "/telegram-ads" }, { label: "nav.meta", href: "/meta-ads" },
] as const;

export default function Burger() {
	const [isOpen, setIsOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const pathname = usePathname();
	const { localizedPath, t } = useI18n();
	const settings = useSiteSettings();

	useBodyScrollLock(isOpen);

	useEffect(() => {
		// The portal target only exists after hydration.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true);
	}, []);

	useEffect(() => {
		document.body.classList.toggle("burger_menu_open", isOpen);

		return () => {
			document.body.classList.remove("burger_menu_open");
		};
	}, [isOpen]);

	function handleMenuClick() {
		setIsOpen(false);
	}

	function isItemActive(href: string) {
		const normalizePath = (value: string) => value.length > 1 ? value.replace(/\/+$/, "") : value;
		const path = normalizePath(localizedPath(href));
		const currentPath = normalizePath(pathname);

		if (href === "/") {
			return currentPath === path;
		}

		return currentPath === path || currentPath.startsWith(`${path}/`);
	}

	return (
		<div className="burger">
			<button
				type="button"
				className="burger_button"
				aria-label={isOpen ? t("nav.close") : t("nav.open")}
				aria-expanded={isOpen}
				aria-controls="burger-menu"
				onClick={() => setIsOpen((value) => !value)}
			>
				<BurgerSvg />
			</button>

			{isMounted && createPortal(
				<>
					<div className={`burger_overlay ${isOpen ? "active" : ""}`} onClick={() => setIsOpen(false)} />
					<aside
						id="burger-menu"
						className={`burger_menu section_background  ${isOpen ? "active" : ""}`}
						aria-hidden={!isOpen}
					>
						<div className="burger_topbar">
							<LangSwitcher variant="burger" onLocaleChange={handleMenuClick} />
							<button
								type="button"
								className="burger_close"
								aria-label={t("nav.close")}
								onClick={() => setIsOpen(false)}
							>
								<BurgerCloseSvg />
							</button>
						</div>

						<nav className="burger_nav" aria-label={t("nav.main")}>
							{menuItems.map((item) => (
								<Link
									key={item.label}
									href={localizedPath(item.href)}
									className={isItemActive(item.href) ? "active" : ""}
									onClick={handleMenuClick}
								>
									{t(item.label)}
								</Link>
							))}
						</nav>

						<div className="burger_footer">
							<div className="burger_socials" aria-label="Social links">
								<a href={settings.telegramChannelUrl} target="_blank" rel="noreferrer" aria-label="Telegram">
									<Image src="/tg.svg" alt="" width={30} height={30} />
								</a>
								<a href={settings.linkedinUrl || undefined} className={!settings.linkedinUrl ? "social_link-disabled" : undefined} target={settings.linkedinUrl ? "_blank" : undefined} rel={settings.linkedinUrl ? "noreferrer" : undefined} aria-label="LinkedIn" aria-disabled={!settings.linkedinUrl}>
									<Image src="/linkedin.svg" alt="" width={24} height={24} />
								</a>
								<a href={settings.xUrl} target="_blank" rel="noreferrer" aria-label="X">
									<Image src="/x.svg" alt="" width={24} height={24} />
								</a>
							</div>

							<Link href={localizedPath("/")} className="burger_brand" onClick={handleMenuClick}>
								RAAGENCY.TECH
							</Link>
						</div>
					</aside>
				</>,
				document.body,
			)}
		</div>
	);
}
