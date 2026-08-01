"use client";

import { useI18n } from "@/context/I18nContext";
import Background from "@/components/Background";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function ContactsPage() {
	const { t } = useI18n();
	const settings = useSiteSettings();
	const contacts = [
		{ label: "Telegram", value: settings.telegramLabel, href: settings.telegramUrl },
		{ label: "Email", value: settings.email, href: `mailto:${settings.email}` },
		{ label: "LinkedIn", value: settings.linkedinLabel, href: settings.linkedinUrl },
		{ label: "X", value: settings.xLabel, href: settings.xUrl },
	];
	return (
		<div className="wrapper">
			<Background>
				<div className="blog_page-content contacts_page-content">
					<Header />
					<main className="content_container privacy_policy-content blog_page-main contacts_page-main">
						<h1 className="cases_page-title numbers_gradient-text">{t("contact.title")}</h1>
						<div className="contacts_intro">
							<span className="contacts_intro-mark">{t("contact.mark")}</span>
							<p>{t("contact.intro")}</p>
						</div>
						<div className="contacts_list">
							{contacts.map((contact, index) => (
								<a className="contacts_item" href={contact.href} key={contact.label} target={contact.href.startsWith("http") ? "_blank" : undefined} rel={contact.href.startsWith("http") ? "noreferrer" : undefined}>
									<span className="contacts_item-content">
										<span className="contacts_item-index">0{index + 1}</span>
										<span className="contacts_item-label">{contact.label}</span>
										<span className="contacts_item-value">{contact.value}</span>
									</span>
									<span className="contacts_item-arrow" aria-hidden="true">
										<Image src="/cases_card-arrow.png" alt="" width={31} height={45} />
									</span>
								</a>
							))}
						</div>
					</main>
				</div>
			</Background>
			<Footer />
		</div>
	);
}
