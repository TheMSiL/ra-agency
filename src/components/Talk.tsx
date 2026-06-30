"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Talk() {
	const [isFormOpen, setIsFormOpen] = useState(false);

	useEffect(() => {
		if (!isFormOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsFormOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isFormOpen]);

	return (
		<div>
			<div className="content_container">
				<h2 className="numbers_title text-center numbers_gradient-text mb-32">Are you ready to talk?</h2>
				<div className="relative flex items-center justify-center">
					<Image src='/radar.png' alt="radar" width={1400} height={590} />
					<button className="talk_btn" type="button" onClick={() => setIsFormOpen(true)}>
						Message us on
						Telegram
					</button>
				</div>
			</div>

			{isFormOpen && (
				<div className="contact_modal" role="dialog" aria-modal="true" aria-labelledby="contact-form-title" onClick={() => setIsFormOpen(false)}>
					<form className="contact_form" onClick={(event) => event.stopPropagation()} onSubmit={(event) => event.preventDefault()}>
						<button className="contact_form-close" type="button" aria-label="Close form" onClick={() => setIsFormOpen(false)}>
							x
						</button>
						<h2 id="contact-form-title" className="contact_form-title">Let’s Connect And Talk</h2>
						<label className="contact_form-field">
							<span>Name</span>
							<input type="text" name="name" placeholder="Name" />
						</label>
						<label className="contact_form-field">
							<span>Telegram Username</span>
							<input type="text" name="telegram" placeholder="@" />
						</label>
						<label className="contact_form-field">
							<span>Details</span>
							<textarea name="details" placeholder="Details" rows={5} />
						</label>
						<button className="contact_form-submit" type="submit">Get started</button>
					</form>
				</div>
			)}
		</div >
	);
}
