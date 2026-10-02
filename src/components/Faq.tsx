"use client";

import { useId, useState } from "react";

import { useI18n } from "@/context/I18nContext";
import type { FaqItem } from "@/data/faq";

export default function Faq({ items }: { items: FaqItem[] }) {
	const { t } = useI18n();
	const [openIndex, setOpenIndex] = useState<number | null>(0);
	const baseId = useId();

	if (items.length === 0) return null;

	return (
		<section className="faq">
			<div className="content_container">
				<h2 className="text-center numbers_gradient-text numbers_title">{t("faq.title")}</h2>
				<div className="faq_list">
					{items.map((item, index) => {
						const isOpen = openIndex === index;
						const questionId = `${baseId}-question-${index}`;
						const answerId = `${baseId}-answer-${index}`;
						return (
							<div className={`faq_item${isOpen ? " faq_item--open" : ""}`} key={item.question}>
								<h3 className="faq_question">
									<button
										id={questionId}
										type="button"
										aria-expanded={isOpen}
										aria-controls={answerId}
										onClick={() => setOpenIndex(isOpen ? null : index)}
									>
										<span className="faq_index">{String(index + 1).padStart(2, "0")}</span>
										<span className="faq_question-text">{item.question}</span>
										<span className="faq_toggle" aria-hidden="true" />
									</button>
								</h3>
								{/* Collapsed answers stay in the DOM, so crawlers read every one
								    and the height can transition instead of snapping. */}
								<div className="faq_answer" id={answerId} role="region" aria-labelledby={questionId}>
									<div className="faq_answer-inner">
										<p>{item.answer}</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
