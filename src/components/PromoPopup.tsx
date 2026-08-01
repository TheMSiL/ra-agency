"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/context/I18nContext";
import ContactModal from "./ContactModal";

const copy = {
	en: { eyebrow: "LIMITED OFFER", title: "$250 OFF OUR COMMISSION", text: "Message our manager now to claim the discount and launch top-performing ads for your project.", cta: "Claim the discount", close: "Close offer" },
	ru: { eyebrow: "ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ", title: "СКИДКА $250 НА НАШУ КОМИССИЮ", text: "Напишите менеджеру сейчас, чтобы успеть забрать скидку и запустить топовую рекламу для своего проекта.", cta: "Забрать скидку", close: "Закрыть предложение" },
	ua: { eyebrow: "ОБМЕЖЕНА ПРОПОЗИЦІЯ", title: "ЗНИЖКА $250 НА НАШУ КОМІСІЮ", text: "Напишіть менеджеру зараз, щоб встигнути забрати знижку та запустити топову рекламу для свого проєкту.", cta: "Забрати знижку", close: "Закрити пропозицію" },
};

export default function PromoPopup() {
	const { locale } = useI18n();
	const [open, setOpen] = useState(false);
	const [formOpen, setFormOpen] = useState(false);
	useEffect(() => {
		if (sessionStorage.getItem("ra-promo-seen")) return;
		const timer = window.setTimeout(() => setOpen(true), 7000);
		return () => window.clearTimeout(timer);
	}, []);
	const dismiss = () => { setOpen(false); sessionStorage.setItem("ra-promo-seen", "1"); };
	const content = copy[locale];
	return <>
		{open && <div className="promo_modal" role="dialog" aria-modal="true" aria-labelledby="promo-title" onClick={dismiss}>
			<div className="promo_card section_background" onClick={(event) => event.stopPropagation()}>
				<button className="promo_close" type="button" onClick={dismiss} aria-label={content.close}>×</button>
				<span className="promo_eyebrow">{content.eyebrow}</span>
				<h2 id="promo-title" className="numbers_gradient-text">{content.title}</h2>
				<p>{content.text}</p>
				<button className="contact_form-submit" type="button" onClick={() => { dismiss(); setFormOpen(true); }}>{content.cta}</button>
			</div>
		</div>}
		<ContactModal isOpen={formOpen} onClose={() => setFormOpen(false)} />
	</>;
}
