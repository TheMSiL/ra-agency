"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import ContactModal from "@/components/ContactModal";

export default function FloatingTelegramButton() {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isHeroVisible, setIsHeroVisible] = useState(true);

	useEffect(() => {
		const updateVisibility = () => {
			setIsHeroVisible(window.scrollY < window.innerHeight);
		};

		updateVisibility();
		window.addEventListener("scroll", updateVisibility, { passive: true });
		window.addEventListener("resize", updateVisibility);

		return () => {
			window.removeEventListener("scroll", updateVisibility);
			window.removeEventListener("resize", updateVisibility);
		};
	}, []);

	return (
		<>
			<button
				className={`floating_tg_btn ${isHeroVisible ? "hidden" : ""}`}
				type="button"
				aria-label="Open contact form"
				onClick={() => setIsFormOpen(true)}
			>
				<Image src="/tg_btn.svg" alt="tg" width={52} height={41} priority />
			</button>

			<ContactModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
		</>
	);
}
