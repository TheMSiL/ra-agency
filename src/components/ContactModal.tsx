"use client";

import { useEffect, useState } from "react";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type ContactModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
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
				<button className="contact_form-close" type="button" aria-label="Close form" onClick={onClose}>
					x
				</button>
				<h2 id="contact-form-title" className="contact_form-title">Let’s Connect And Talk</h2>
				<label className="contact_form-field">
					<span>Name</span>
					<input type="text" name="name" placeholder="Name" />
				</label>
				<fieldset className="contact_form-method">
					<legend>Preferred contact method</legend>
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
					<span>{contactMethod === "telegram" ? "Telegram Username" : "Email"}</span>
					<input
						type={contactMethod === "telegram" ? "text" : "email"}
						name={contactMethod}
						placeholder={contactMethod === "telegram" ? "@username" : "name@example.com"}
						value={contactValue}
						onChange={(event) => setContactValue(event.target.value)}
					/>
				</label>
				<label className="contact_form-field">
					<span>Details</span>
					<textarea name="details" placeholder="Details" rows={5} />
				</label>
				<button className="contact_form-submit" type="submit">Get started</button>
			</form>
		</div>
	);
}
