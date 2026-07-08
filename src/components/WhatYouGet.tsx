"use client";

import Image from "next/image";
import type { CSSProperties, TouchEvent as ReactTouchEvent } from "react";
import { useEffect, useRef, useState } from "react";

const items = [
	{
		kicker: "01",
		title: "Attracting the target audience",
		text: "We attract users who are genuinely interested in your product. By working with relevant channels and audience segments, we bring not just traffic, but potential customers.",
	},
	{
		kicker: "02",
		title: "Campaign structure and testing",
		text: "We build clear campaign logic, test creatives and audiences, and keep the account structure ready for fast decisions without losing control of spend.",
	},
	{
		kicker: "03",
		title: "Scaling what already converts",
		text: "When the numbers prove the route, we scale budgets carefully, protect the strongest segments, and keep optimization tied to real business outcomes.",
	},
];

const SWIPE_THRESHOLD_PX = 40;

export default function WhatYouGet() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [lineStep, setLineStep] = useState(0);
	const isAutoPaused = useRef(false);

	const touchStartX = useRef(0);
	const touchStartY = useRef(0);
	const touchDeltaX = useRef(0);
	const isSwiping = useRef(false);

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			if (isAutoPaused.current) {
				window.clearInterval(intervalId);
				return;
			}

			setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
			setLineStep((currentStep) => currentStep + 1);
		}, 5000);

		return () => window.clearInterval(intervalId);
	}, []);

	const goTo = (nextIndex: number) => {
		const loopedIndex = ((nextIndex % items.length) + items.length) % items.length;

		if (loopedIndex === activeIndex) {
			return;
		}

		setActiveIndex(loopedIndex);
		setLineStep((currentStep) => currentStep + 1);
	};

	const handlePaginationClick = (nextIndex: number) => {
		isAutoPaused.current = true;
		goTo(nextIndex);
	};

	const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
		const touch = event.touches[0];
		touchStartX.current = touch.clientX;
		touchStartY.current = touch.clientY;
		touchDeltaX.current = 0;
		isSwiping.current = false;
	};

	const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
		const touch = event.touches[0];
		const deltaX = touch.clientX - touchStartX.current;
		const deltaY = touch.clientY - touchStartY.current;

		touchDeltaX.current = deltaX;

		if (!isSwiping.current && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
			isSwiping.current = true;
		}

		if (isSwiping.current) {
			event.preventDefault();
		}
	};

	const handleTouchEnd = () => {
		if (!isSwiping.current) {
			return;
		}

		const deltaX = touchDeltaX.current;

		if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
			isAutoPaused.current = true;

			if (deltaX < 0) {
				goTo(activeIndex + 1);
			} else {
				goTo(activeIndex - 1);
			}
		}

		isSwiping.current = false;
		touchDeltaX.current = 0;
	};

	return (
		<section className="what_you_get">
			<div className="content_container what_container">
				<h2 className="services_title numbers_gradient-text !capitalize">What you get ?</h2>

				<div className="what_slider" style={{ "--active": activeIndex } as CSSProperties}>
					<div
						className="what_track"
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						{items.map((item, index) => (
							<article
								className={`what_panel ${index === activeIndex ? "active" : ""}`}
								key={item.kicker}
								aria-hidden={index !== activeIndex}
							>
								<h3 className="what_subtitle">{item.title}</h3>
								<p className="what_text">{item.text}</p>
							</article>
						))}
					</div>
				</div>
				<div className="what_line" aria-hidden="true">
					<div className="what_line-track" style={{ "--line-step": lineStep } as CSSProperties}>
						<Image src="/what_line.svg" alt="" width={1920} height={100} className="what_line-img" unoptimized />
						<Image src="/what_line.svg" alt="" width={1920} height={100} className="what_line-img" unoptimized />
						<Image src="/what_line.svg" alt="" width={1920} height={100} className="what_line-img" unoptimized />
						<Image src="/what_line.svg" alt="" width={1920} height={100} className="what_line-img" unoptimized />
					</div>
				</div>
				<div className="what_footer" aria-label="What you get progress">
					<span className="what_count font-display" key={items[activeIndex].kicker}>
						{items[activeIndex].kicker}
					</span>
					<div className="what_dots">
						{items.map((item, index) => (
							<button
								className={`what_dot ${index === activeIndex ? "active" : ""}`}
								key={item.kicker}
								type="button"
								aria-label={`Show item ${item.kicker}`}
								aria-current={index === activeIndex}
								onClick={() => handlePaginationClick(index)}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}