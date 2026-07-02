"use client";

import Image from "next/image";
import { useState } from "react";

import ContactModal from "@/components/ContactModal";

export default function FloatingTelegramButton() {
	const [isFormOpen, setIsFormOpen] = useState(false);

	return (
		<>
			<button
				className="floating_tg_btn"
				type="button"
				aria-label="Open contact form"
				onClick={() => setIsFormOpen(true)}
			>
				<Image src="/tg_btn.svg" alt="" width={94} height={74} priority />
			</button>

			<ContactModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
		</>
	);
}
