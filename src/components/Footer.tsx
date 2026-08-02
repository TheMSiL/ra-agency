"use client";

import { useI18n } from "@/context/I18nContext";
import Image from "next/image";
import LocalizedLink from "./LocalizedLink";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const navigation = [
	{
		href: '/cases',
		title: 'nav.cases'
	},
	{
		href: '/about',
		title: 'nav.about'
	},
	{
		href: '/blog',
		title: 'nav.blog'
	},
	{
		href: '/contacts',
		title: 'nav.contacts'
	},
] as const

const services = [
	{
		href: '/telegram-ads',
		title: 'nav.telegram'
	},
	{
		href: '/google-ads',
		title: 'nav.google'
	},
	{
		href: '/meta-ads',
		title: 'nav.meta'
	},
] as const

const legal = [
	{
		title: 'footer.privacy'
	},
	{
		title: 'footer.terms'
	},
	{
		title: 'footer.cookies'
	},
] as const

export default function Footer() {
	const { t } = useI18n();
	const settings = useSiteSettings();
	return (
		<footer id="contact" className="footer section_background pt-10">
			<div className="content_container footer_container">
				<h1 className="home_hero-title footer_title " data-title="RA AGENCY">
					<span className="footer_title-word">RA</span>{" "}
					<span className="footer_title-word">AGENCY</span>
				</h1>
				<div className="footer_layout">
					<div className="footer_intro">
						<p className="footer_text">{t("footer.text")}</p>
						<div className="burger_socials footer_socials" aria-label="Social links">
							<a href={settings.telegramChannelUrl} target="_blank" rel="noreferrer" aria-label="Telegram">
								<Image src="/tg.svg" alt="" width={30} height={30} />
							</a>
							<a href={settings.linkedinUrl || undefined} className={!settings.linkedinUrl ? "social_link-disabled" : undefined} target={settings.linkedinUrl ? "_blank" : undefined} rel={settings.linkedinUrl ? "noreferrer" : undefined} aria-label="LinkedIn (coming soon)" aria-disabled={!settings.linkedinUrl}>
								<Image src="/linkedin.svg" alt="" width={24} height={24} />
							</a>
							<a href={settings.xUrl} target="_blank" rel="noreferrer" aria-label="X">
								<Image src="/x.svg" alt="" width={24} height={24} />
							</a>
						</div>
					</div>
					<Image className="footer_logo-bg" src="/footer_logo.png" alt="footer_logo" width={600} height={431} unoptimized />
					<div className="footer_nav">
						<div className="footer_nav-column">
							<h5 className="footer_nav-title">{t("footer.navigation")}</h5>
							<ul className="footer_nav-list">
								{
									navigation.map((link) => {
										return <li className="footer_nav-item" key={link.title}>
											<LocalizedLink href={link.href}>{t(link.title)}</LocalizedLink>
										</li>
									})
								}
							</ul>
						</div>
						<div className="footer_nav-column">
							<h5 className="footer_nav-title">{t("footer.services")}</h5>
							<ul className="footer_nav-list">
								{
									services.map((link) => {
										return <li className="footer_nav-item" key={link.title}>
											<LocalizedLink href={link.href}>{t(link.title)}</LocalizedLink>
										</li>
									})
								}
							</ul>
						</div>
						<div className="footer_nav-column">
							<h5 className="footer_nav-title">{t("footer.legal")}</h5>
							<ul className="footer_nav-list">
								{
									legal.map((link) => {
										return <li className="footer_nav-item" key={link.title}>
											<span>{t(link.title)}</span>
										</li>
									})
								}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
