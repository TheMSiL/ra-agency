"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { trackAnalyticsEvent } from "@/analytics/attribution";
import ContactForm, { type ContactFormSource } from "./ContactForm";

type ContactModalProps = {
	isOpen: boolean;
	onClose: () => void;
	/** Which CTA opened the form. */
	source?: Exclude<ContactFormSource, "inline">;
};

export default function ContactModal({ isOpen, onClose, source = "floating" }: ContactModalProps) {
	const titleId = useId();
	useBodyScrollLock(isOpen);

	useEffect(() => {
		if (isOpen) trackAnalyticsEvent("form_open", { form: "contact-modal", cta_location: source, page: window.location.pathname });
	}, [isOpen, source]);

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
	}, [onClose, isOpen]);

	if (!isOpen) {
		return null;
	}

	// Portalled to <body>: rendered in place, the modal sits inside whichever
	// section opened it, and a transform on any ancestor (GSAP sets them while
	// animating) turns position: fixed into "fixed to that section" — the
	// overlay then covers only part of the page and the footer paints over it.
	// It only ever opens on a click, so document exists by the time this runs.
	// The form unmounts on close, which is what resets its status and errors.
	return createPortal(
		<div
			className="contact_modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			onClick={(event) => {
				if (event.target === event.currentTarget) onClose();
			}}
		>
			<ContactForm source={source} variant="modal" titleId={titleId} onClose={onClose} />
		</div>,
		document.body,
	);
}
