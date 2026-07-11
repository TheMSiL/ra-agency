"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import BurgerCloseSvg from "../../public/svg/BurgerCloseSvg";
import BurgerSvg from "../../public/svg/BurgerSvg";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
	{ label: "Home", href: "/" },
	{ label: "about us", href: "/about" },
	{ label: "cases", href: "/cases" },
	{ label: "contact", href: "/#contact" },
	{ label: "google ads", href: "/google-ads" },
	{ label: "telegram ads", href: "/telegram-ads" },
	{ label: "meta ads", href: "/meta-ads" },
];

export default function Burger() {
	const [isOpen, setIsOpen] = useState(false);
	const [activeHash, setActiveHash] = useState("");
	const pathname = usePathname();

	useBodyScrollLock(isOpen);

	useEffect(() => {
		document.body.classList.toggle("burger_menu_open", isOpen);

		return () => {
			document.body.classList.remove("burger_menu_open");
		};
	}, [isOpen]);

	useEffect(() => {
		function updateActiveHash() {
			setActiveHash(window.location.hash);
		}

		updateActiveHash();
		window.addEventListener("hashchange", updateActiveHash);

		return () => window.removeEventListener("hashchange", updateActiveHash);
	}, []);

	function handleMenuClick(href: string) {
		setActiveHash(href.includes("#") ? `#${href.split("#")[1]}` : "");
		setIsOpen(false);
	}

	function isItemActive(href: string) {
		if (href === "/#contact") return activeHash === "#contact";
		if (href === "/") return pathname === "/" && activeHash !== "#contact";

		return pathname === href || pathname.startsWith(`${href}/`);
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
				className={`burger_menu ${isOpen ? "active" : ""}`}
				aria-hidden={!isOpen}
			>
				<button
					type="button"
					className="burger_close"
					aria-label="Close menu"
					onClick={() => setIsOpen(false)}
				>
					<BurgerCloseSvg />
				</button>

				<nav className="burger_nav" aria-label="Main menu">
					{menuItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={isItemActive(item.href) ? "active" : ""}
							onClick={() => handleMenuClick(item.href)}
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

					<Link href="/" className="burger_brand" onClick={() => handleMenuClick("#home")}>
						RA AGENCY.TECH
					</Link>
				</div>
			</aside>
		</div>
	);
}
