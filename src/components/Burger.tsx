"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import BurgerCloseSvg from "../../public/svg/BurgerCloseSvg";
import BurgerSvg from "../../public/svg/BurgerSvg";

const menuItems = [
	{ label: "Home", href: "#home" },
	{ label: "about us", href: "#about" },
	{ label: "cases", href: "#cases" },
	{ label: "contact", href: "#contact" },
	{ label: "google ads", href: "#google-ads" },
	{ label: "telegram ads", href: "#telegram-ads" },
	{ label: "meta ads", href: "#meta-ads" },
	{ label: "open ai ads", href: "#open-ai-ads" },
];

export default function Burger() {
	const [isOpen, setIsOpen] = useState(false);
	const [activeHref, setActiveHref] = useState("#home");

	useEffect(() => {
		function updateActiveHref() {
			setActiveHref(window.location.hash || "#home");
		}

		updateActiveHref();
		window.addEventListener("hashchange", updateActiveHref);

		return () => window.removeEventListener("hashchange", updateActiveHref);
	}, []);

	function handleMenuClick(href: string) {
		setActiveHref(href);
		setIsOpen(false);
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
						<a
							key={item.href}
							href={item.href}
							className={activeHref === item.href ? "active" : ""}
							onClick={() => handleMenuClick(item.href)}
						>
							{item.label}
						</a>
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

					<a href="#home" className="burger_brand" onClick={() => handleMenuClick("#home")}>
						RA AGENCY.TECH
					</a>
				</div>
			</aside>
		</div>
	);
}
