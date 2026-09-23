"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/context/I18nContext";
import type { Locale } from "@/i18n/config";
import ContactModal from "./ContactModal";
import { trackAnalyticsEvent } from "@/analytics/attribution";

const DEFAULT_DELAY_SECONDS = 30;

/**
 * What the popup says when the promoOffer document in the studio is missing, or
 * has a field left blank for this language. Editing it there overrides these;
 * the site never shows an empty offer.
 */
const fallbackCopy = {
	en: { eyebrow: "LIMITED OFFER", title: "$250 OFF OUR COMMISSION", text: "Message our manager now to claim the discount and launch top-performing ads for your project.", cta: "Claim the discount", close: "Close offer" },
	ru: { eyebrow: "ОГРАНИЧЕННОЕ ПРЕДЛОЖЕНИЕ", title: "СКИДКА $250 НА НАШУ КОМИССИЮ", text: "Напишите менеджеру сейчас, чтобы успеть забрать скидку и запустить топовую рекламу для своего проекта.", cta: "Забрать скидку", close: "Закрыть предложение" },
	ua: { eyebrow: "ОБМЕЖЕНА ПРОПОЗИЦІЯ", title: "ЗНИЖКА $250 НА НАШУ КОМІСІЮ", text: "Напишіть менеджеру зараз, щоб встигнути забрати знижку та запустити топову рекламу для свого проєкту.", cta: "Забрати знижку", close: "Закрити пропозицію" },
};

type LocalizedField = Partial<Record<Locale, string>> | null;

type PromoOffer = {
	enabled?: boolean;
	delaySeconds?: number;
	eyebrow?: LocalizedField;
	title?: LocalizedField;
	text?: LocalizedField;
	cta?: LocalizedField;
};

const pick = (field: LocalizedField | undefined, locale: Locale, fallback: string) =>
	field?.[locale]?.trim() || fallback;

export default function PromoPopup() {
	const { locale } = useI18n();
	const pathname = usePathname();
	const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");
	const [open, setOpen] = useState(false);
	const [formOpen, setFormOpen] = useState(false);
	// undefined = the studio has not answered yet. The timer waits for it so an
	// editor's delay is honoured rather than raced by the bundled default.
	const [offer, setOffer] = useState<PromoOffer | undefined>(undefined);

	useEffect(() => {
		if (isStudio) return;

		let cancelled = false;
		fetch("/api/promo")
			.then((response) => (response.ok ? response.json() : null))
			.then((data: PromoOffer | null) => {
				if (!cancelled) setOffer(data ?? {});
			})
			.catch(() => {
				if (!cancelled) setOffer({});
			});

		return () => {
			cancelled = true;
		};
	}, [isStudio]);

	useEffect(() => {
		if (isStudio || offer === undefined) return;
		if (offer.enabled === false) return;
		if (sessionStorage.getItem("ra-promo-seen")) return;

		const seconds = typeof offer.delaySeconds === "number" && offer.delaySeconds >= 0 ? offer.delaySeconds : DEFAULT_DELAY_SECONDS;
		const timer = window.setTimeout(() => setOpen(true), seconds * 1000);
		return () => window.clearTimeout(timer);
	}, [isStudio, offer]);

	useEffect(() => {
		if (!open) return;
		trackAnalyticsEvent("promo_view", { page: window.location.pathname });
	}, [open]);

	const fallback = fallbackCopy[locale];
	const content = {
		eyebrow: pick(offer?.eyebrow, locale, fallback.eyebrow),
		title: pick(offer?.title, locale, fallback.title),
		text: pick(offer?.text, locale, fallback.text),
		cta: pick(offer?.cta, locale, fallback.cta),
		close: fallback.close,
	};

	// The offer funnel: promo_view pairs with promo_click to give the popup its
	// own conversion rate, promo_dismiss is the other half of the same decision,
	// and cta_location="promo" rides through ContactModal so the generate_lead it
	// ends in stays attributable to the offer rather than to the page.
	const close = (reason: "dismissed" | "accepted") => {
		setOpen(false);
		sessionStorage.setItem("ra-promo-seen", "1");
		trackAnalyticsEvent(reason === "accepted" ? "promo_click" : "promo_dismiss", {
			promo_title: content.title,
			page: window.location.pathname,
		});
	};
	const dismiss = () => close("dismissed");

	if (isStudio) return null;

	return <>
		{open && <div className="promo_modal" role="dialog" aria-modal="true" aria-labelledby="promo-title" onClick={dismiss}>
			<div className="promo_card section_background" onClick={(event) => event.stopPropagation()}>
				<button className="promo_close" type="button" onClick={dismiss} aria-label={content.close}>×</button>
				<span className="promo_eyebrow">{content.eyebrow}</span>
				<h2 id="promo-title" className="numbers_gradient-text">{content.title}</h2>
				<p>{content.text}</p>
				<button className="contact_form-submit" type="button" onClick={() => { close("accepted"); setFormOpen(true); }}>{content.cta}</button>
			</div>
		</div>}
		<ContactModal isOpen={formOpen} onClose={() => setFormOpen(false)} source="promo" />
	</>;
}
