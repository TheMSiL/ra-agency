"use client";

import { useCallback, useEffect, useState } from "react";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useI18n } from "@/context/I18nContext";
import { trackAnalyticsEvent } from "@/analytics/attribution";
import { trackOpenAiConversion } from "@/analytics/openai";
import AttributionFields from "./AttributionFields";

type ContactModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

type FieldErrors = Partial<Record<"name" | "contact" | "details", string>>;

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
	const { t } = useI18n();
	const [contactMethod, setContactMethod] = useState<"telegram" | "email">("telegram");
	const [contactValue, setContactValue] = useState("");
	const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	useBodyScrollLock(isOpen);
	const handleClose = useCallback(() => {
		setStatus("idle");
		setFieldErrors({});
		onClose();
	}, [onClose]);

	useEffect(() => {
		if (isOpen) trackAnalyticsEvent("form_open", { form: "contact-modal", page: window.location.pathname });
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handleClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleClose, isOpen]);

	if (!isOpen) {
		return null;
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (status === "sending" || status === "success") return;
		const formElement = event.currentTarget;
		const form = new FormData(formElement);
		const name = String(form.get("name") ?? "").trim();
		const contact = contactValue.trim();
		const details = String(form.get("details") ?? "").trim();
		const errors: FieldErrors = {};

		if (name.length < 2) errors.name = t("form.nameInvalid");
		if (contactMethod === "telegram" ? !contact.startsWith("@") : !contact.includes("@")) {
			errors.contact = contactMethod === "telegram" ? t("form.telegramInvalid") : t("form.emailInvalid");
		}
		if (details.length < 10) errors.details = t("form.detailsInvalid");

		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			setStatus("idle");
			return;
		}

		setFieldErrors({});
		setStatus("sending");
		let attribution = {};
		try { attribution = JSON.parse(String(form.get("attribution") ?? "{}")); } catch { /* ignore malformed client data */ }
		try {
			const response = await fetch("/api/contact", {
				method: "POST", headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name, contactMethod, contact, details,
					attribution, source: "contact-modal",
				}),
			});
			if (response.ok) {
				// GA4 recommended event name — flag it as a key event in the GA4 admin
				// panel and it is counted as a conversion.
				trackAnalyticsEvent("generate_lead", { form: "contact-modal", contact_method: contactMethod, page: window.location.pathname });
				// The conversion OpenAI ads optimises against. Fires here and nowhere
				// else: only a request the API actually accepted is a filled form.
				trackOpenAiConversion("formfilled");
				setStatus("success"); formElement.reset(); setContactValue("");
			} else setStatus("error");
		} catch { setStatus("error"); }
	}

	return (
		<div className="contact_modal" role="dialog" aria-modal="true" aria-labelledby="contact-form-title" onClick={handleClose}>
			<form className="contact_form section_background" noValidate onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
				<AttributionFields />
			<button className="contact_form-close" type="button" aria-label={t("form.close")} onClick={handleClose}>
					x
				</button>
				<h2 id="contact-form-title" className="contact_form-title">{t("form.title")}</h2>
				<label className={`contact_form-field${fieldErrors.name ? " contact_form-field--invalid" : ""}`}>
					<span>{t("form.name")}</span>
					<input type="text" name="name" placeholder={t("form.name")} maxLength={120} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "contact-name-error" : undefined} onChange={() => setFieldErrors((current) => ({ ...current, name: undefined }))} />
					{fieldErrors.name && <small id="contact-name-error" className="contact_form-field-error">{fieldErrors.name}</small>}
				</label>
				<fieldset className="contact_form-method">
					<legend>{t("form.method")}</legend>
					<div className="contact_form-method-options">
						{(["telegram", "email"] as const).map((method) => (
							<label className={contactMethod === method ? "active" : ""} key={method}>
								<input
									type="radio"
									name="contactMethod"
									value={method}
									checked={contactMethod === method}
									onChange={() => {
										setContactMethod(method);
										setContactValue("");
										setFieldErrors((current) => ({ ...current, contact: undefined }));
									}}
								/>
								<span>{method === "telegram" ? "Telegram" : "Email"}</span>
							</label>
						))}
					</div>
				</fieldset>
				<label className={`contact_form-field${fieldErrors.contact ? " contact_form-field--invalid" : ""}`}>
					<span>{contactMethod === "telegram" ? t("form.telegramUser") : "Email"}</span>
					<input
						type="text"
						name={contactMethod}
						placeholder={contactMethod === "telegram" ? "@username" : "name@example.com"}
						value={contactValue}
						maxLength={254}
						aria-invalid={Boolean(fieldErrors.contact)}
						aria-describedby={fieldErrors.contact ? "contact-value-error" : undefined}
						onChange={(event) => {
							setContactValue(event.target.value);
							setFieldErrors((current) => ({ ...current, contact: undefined }));
						}}
					/>
					{fieldErrors.contact && <small id="contact-value-error" className="contact_form-field-error">{fieldErrors.contact}</small>}
				</label>
				<label className={`contact_form-field${fieldErrors.details ? " contact_form-field--invalid" : ""}`}>
					<span>{t("form.details")}</span>
					<textarea name="details" placeholder={t("form.details")} rows={5} maxLength={4000} aria-invalid={Boolean(fieldErrors.details)} aria-describedby={fieldErrors.details ? "contact-details-error" : undefined} onChange={() => setFieldErrors((current) => ({ ...current, details: undefined }))} />
					{fieldErrors.details && <small id="contact-details-error" className="contact_form-field-error">{fieldErrors.details}</small>}
				</label>
				<p className={`contact_form-status contact_form-status--${status}`} role="status" aria-live="polite">
					{status === "success" ? "Thank you! A manager will contact you shortly." : status === "error" ? "Something went wrong. Please try again." : ""}
				</p>
				<button className="contact_form-submit" type="submit" disabled={status === "sending" || status === "success"}>{status === "sending" ? "Sending…" : t("form.submit")}</button>
			</form>
		</div>
	);
}
