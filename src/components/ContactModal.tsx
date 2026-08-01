"use client";

import { useCallback, useEffect, useState } from "react";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useI18n } from "@/context/I18nContext";
import AttributionFields from "./AttributionFields";

type ContactModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
	const { t } = useI18n();
	const [contactMethod, setContactMethod] = useState<"telegram" | "email">("telegram");
	const [contactValue, setContactValue] = useState("");
	const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
	useBodyScrollLock(isOpen);
	const handleClose = useCallback(() => {
		setStatus("idle");
		onClose();
	}, [onClose]);

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
		setStatus("sending");
		const form = new FormData(formElement);
		let attribution = {};
		try { attribution = JSON.parse(String(form.get("attribution") ?? "{}")); } catch { /* ignore malformed client data */ }
		try {
			const response = await fetch("/api/contact", {
				method: "POST", headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: form.get("name"), contactMethod,
					contact: form.get(contactMethod), details: form.get("details"),
					attribution, source: "contact-modal",
				}),
			});
			if (response.ok) {
				setStatus("success"); formElement.reset(); setContactValue("");
			} else setStatus("error");
		} catch { setStatus("error"); }
	}

	return (
		<div className="contact_modal" role="dialog" aria-modal="true" aria-labelledby="contact-form-title" onClick={handleClose}>
			<form className="contact_form section_background" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
				<AttributionFields />
			<button className="contact_form-close" type="button" aria-label={t("form.close")} onClick={handleClose}>
					x
				</button>
				<h2 id="contact-form-title" className="contact_form-title">{t("form.title")}</h2>
				<label className="contact_form-field">
					<span>{t("form.name")}</span>
					<input type="text" name="name" placeholder={t("form.name")} required maxLength={120} />
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
									}}
								/>
								<span>{method === "telegram" ? "Telegram" : "Email"}</span>
							</label>
						))}
					</div>
				</fieldset>
				<label className="contact_form-field">
					<span>{contactMethod === "telegram" ? t("form.telegramUser") : "Email"}</span>
					<input
						type={contactMethod === "telegram" ? "text" : "email"}
						name={contactMethod}
						placeholder={contactMethod === "telegram" ? "@username" : "name@example.com"}
						value={contactValue}
						required
						onChange={(event) => setContactValue(event.target.value)}
					/>
				</label>
				<label className="contact_form-field">
					<span>{t("form.details")}</span>
					<textarea name="details" placeholder={t("form.details")} rows={5} />
				</label>
				<p className={`contact_form-status contact_form-status--${status}`} role="status" aria-live="polite">
					{status === "success" ? "Thank you! A manager will contact you shortly." : status === "error" ? "Something went wrong. Please try again." : ""}
				</p>
				<button className="contact_form-submit" type="submit" disabled={status === "sending" || status === "success"}>{status === "sending" ? "Sending…" : t("form.submit")}</button>
			</form>
		</div>
	);
}
