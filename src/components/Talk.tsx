"use client";

import Image from "next/image";
import { useState } from "react";

import ContactModal from "@/components/ContactModal";

export default function Talk() {
	const [isFormOpen, setIsFormOpen] = useState(false);

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

			<ContactModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
		</div >
	);
}
