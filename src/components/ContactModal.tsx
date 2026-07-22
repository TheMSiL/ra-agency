"use client";

import { useEffect, useState } from "react";

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
	useBodyScrollLock(isOpen);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	return (
		<div className="contact_modal" role="dialog" aria-modal="true" aria-labelledby="contact-form-title" onClick={onClose}>
			<form className="contact_form section_background" onClick={(event) => event.stopPropagation()} onSubmit={(event) => event.preventDefault()}>
				<AttributionFields />
			<button className="contact_form-close" type="button" aria-label={t("form.close")} onClick={onClose}>
					x
				</button>
				<h2 id="contact-form-title" className="contact_form-title">{t("form.title")}</h2>
				<label className="contact_form-field">
					<span>{t("form.name")}</span>
					<input type="text" name="name" placeholder={t("form.name")} />
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
						onChange={(event) => setContactValue(event.target.value)}
					/>
				</label>
				<label className="contact_form-field">
					<span>{t("form.details")}</span>
					<textarea name="details" placeholder={t("form.details")} rows={5} />
				</label>
				<button className="contact_form-submit" type="submit">{t("form.submit")}</button>
			</form>
		</div>
	);
}
