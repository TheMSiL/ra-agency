"use client";

import { useId, useState } from "react";

import { useI18n } from "@/context/I18nContext";
import { trackAnalyticsEvent } from "@/analytics/attribution";
import { trackOpenAiConversion } from "@/analytics/openai";
import AttributionFields from "./AttributionFields";

/**
 * Which CTA the form was reached through. Rides along on form_open and
 * generate_lead so the funnel from the promo popup to a submitted lead can be
 * read off GA4 instead of guessed at. "inline" is the form that sits open on
 * the page instead of behind a button.
 */
export type ContactFormSource = "floating" | "talk" | "promo" | "inline";

type ContactFormProps = {
	source: ContactFormSource;
	variant: "modal" | "inline";
	/** Lets the modal point its aria-labelledby at the title. */
	titleId?: string;
	/** Renders the close button; only the modal has one. */
	onClose?: () => void;
};

type FieldErrors = Partial<Record<"name" | "contact" | "details", string>>;

export default function ContactForm({ source, variant, titleId, onClose }: ContactFormProps) {
	const { t } = useI18n();
	const [contactMethod, setContactMethod] = useState<"telegram" | "email">("telegram");
	const [contactValue, setContactValue] = useState("");
	const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	// The inline form and the modal can be on the page at the same time, so the
	// ids the labels and errors point at have to be unique per instance.
	const id = useId();
	const formName = variant === "modal" ? "contact-modal" : "contact-inline";

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
				// source stays "contact-modal" for both forms: it is forwarded to the
				// client's CRM, and which form a lead came from is already in GA4.
				body: JSON.stringify({
					name, contactMethod, contact, details,
					attribution, source: "contact-modal",
				}),
			});
			if (response.ok) {
				// GA4 recommended event name — flag it as a key event in the GA4 admin
				// panel and it is counted as a conversion.
				trackAnalyticsEvent("generate_lead", { form: formName, contact_method: contactMethod, cta_location: source, page: window.location.pathname });
				// The conversion OpenAI ads optimises against. Fires here and nowhere
				// else: only a request the API actually accepted is a filled form.
				trackOpenAiConversion("formfilled");
				setStatus("success"); formElement.reset(); setContactValue("");
			} else setStatus("error");
		} catch { setStatus("error"); }
	}

	return (
		<form
			className={`contact_form section_background${variant === "inline" ? " contact_form--inline" : ""}`}
			noValidate
			aria-labelledby={titleId ?? `${id}-title`}
			onSubmit={handleSubmit}
		>
			<AttributionFields />
			{onClose && (
				<button className="contact_form-close" type="button" aria-label={t("form.close")} onClick={onClose}>
					x
				</button>
			)}
			<h2 id={titleId ?? `${id}-title`} className="contact_form-title">{t("form.title")}</h2>
			<label className={`contact_form-field${fieldErrors.name ? " contact_form-field--invalid" : ""}`}>
				<span>{t("form.name")}</span>
				<input type="text" name="name" placeholder={t("form.name")} maxLength={120} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? `${id}-name-error` : undefined} onChange={() => setFieldErrors((current) => ({ ...current, name: undefined }))} />
				{fieldErrors.name && <small id={`${id}-name-error`} className="contact_form-field-error">{fieldErrors.name}</small>}
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
					aria-describedby={fieldErrors.contact ? `${id}-value-error` : undefined}
					onChange={(event) => {
						setContactValue(event.target.value);
						setFieldErrors((current) => ({ ...current, contact: undefined }));
					}}
				/>
				{fieldErrors.contact && <small id={`${id}-value-error`} className="contact_form-field-error">{fieldErrors.contact}</small>}
			</label>
			<label className={`contact_form-field${fieldErrors.details ? " contact_form-field--invalid" : ""}`}>
				<span>{t("form.details")}</span>
				<textarea name="details" placeholder={t("form.details")} rows={5} maxLength={4000} aria-invalid={Boolean(fieldErrors.details)} aria-describedby={fieldErrors.details ? `${id}-details-error` : undefined} onChange={() => setFieldErrors((current) => ({ ...current, details: undefined }))} />
				{fieldErrors.details && <small id={`${id}-details-error`} className="contact_form-field-error">{fieldErrors.details}</small>}
			</label>
			<p className={`contact_form-status contact_form-status--${status}`} role="status" aria-live="polite">
				{status === "success" ? "Thank you! A manager will contact you shortly." : status === "error" ? "Something went wrong. Please try again." : ""}
			</p>
			<button className="contact_form-submit" type="submit" disabled={status === "sending" || status === "success"}>{status === "sending" ? "Sending…" : t("form.submit")}</button>
		</form>
	);
}
