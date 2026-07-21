"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { useI18n } from "@/context/I18nContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BurgerCloseSvg from "../../public/svg/BurgerCloseSvg";
import BurgerSvg from "../../public/svg/BurgerSvg";
import LangSwitcher from "./LangSwitcher";

const menuItems = [
	{ label: "Home", href: "/" },
	{ label: "about us", href: "/about" },
	{ label: "cases", href: "/cases" },
	{ label: "blog", href: "/blog", },
	{ label: "google ads", href: "/google-ads" },
	{ label: "telegram ads", href: "/telegram-ads" },
	{ label: "meta ads", href: "/meta-ads" },
];

export default function Burger() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const { localizedPath } = useI18n();

	useBodyScrollLock(isOpen);

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
				aria-label={isOpen ? "Close menu" : "Open menu"}
				aria-expanded={isOpen}
				aria-controls="burger-menu"
				onClick={() => setIsOpen((value) => !value)}
			>
				<BurgerSvg />
			</button>

			<div
				className={`burger_overlay ${isOpen ? "active" : ""}`}
				onClick={() => setIsOpen(false)}
			/>
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
						aria-label="Close menu"
						onClick={() => setIsOpen(false)}
					>
						<BurgerCloseSvg />
					</button>
				</div>

				<nav className="burger_nav" aria-label="Main menu">
					{menuItems.map((item) => (
						<Link
							key={item.label}
							href={localizedPath(item.href)}
							className={isItemActive(item.href) ? "active" : ""}
							onClick={handleMenuClick}
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="burger_footer">
					<div className="burger_socials" aria-label="Social links">
						<a href="#" aria-label="Telegram">
							<Image src="/tg.svg" alt="" width={30} height={30} />
						</a>
						<a href="#" aria-label="LinkedIn">
							<Image src="/linkedin.svg" alt="" width={24} height={24} />
						</a>
						<a href="#" aria-label="X">
							<Image src="/x.svg" alt="" width={24} height={24} />
						</a>
					</div>

					<Link href={localizedPath("/")} className="burger_brand" onClick={handleMenuClick}>
						RA AGENCY.TECH
					</Link>
				</div>
			</aside>
		</div>
	);
}
