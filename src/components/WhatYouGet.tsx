"use client";

import Image from "next/image";
import type { CSSProperties, TouchEvent as ReactTouchEvent } from "react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
const PIN_SCROLL_DISTANCE = 1500;

export default function WhatYouGet() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [lineStep, setLineStep] = useState(0);
	const sectionRef = useRef<HTMLElement | null>(null);
	const pinRef = useRef<HTMLDivElement | null>(null);
	const sliderRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<HTMLDivElement | null>(null);
	const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
	const activeIndexRef = useRef(0);

	const touchStartX = useRef(0);
	const touchStartY = useRef(0);
	const touchDeltaX = useRef(0);
	const isSwiping = useRef(false);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const section = sectionRef.current;
			const pin = pinRef.current;
			const slider = sliderRef.current;
			const track = trackRef.current;

			if (!section || !pin || !slider || !track) {
				return;
			}

			const updateActiveIndex = (progress: number) => {
				const nextIndex = Math.round(progress * (items.length - 1));

				if (nextIndex === activeIndexRef.current) {
					return;
				}

				activeIndexRef.current = nextIndex;
				setActiveIndex(nextIndex);
				setLineStep(nextIndex);
			};

			const tween = gsap.to(track, {
				x: () => -(track.scrollWidth - slider.clientWidth),
				ease: "none",
				scrollTrigger: {
					trigger: section,
					start: "top top",
					end: `+=${PIN_SCROLL_DISTANCE}`,
					scrub: 1,
					pin,
					anticipatePin: 1,
					invalidateOnRefresh: true,
					onUpdate: (self) => updateActiveIndex(self.progress),
					onRefresh: (self) => updateActiveIndex(self.progress),
				},
			});

			scrollTriggerRef.current = tween.scrollTrigger ?? null;
		}, sectionRef);

		return () => {
			scrollTriggerRef.current = null;
			ctx.revert();
		};
	}, []);

	const goTo = (nextIndex: number) => {
		const boundedIndex = Math.min(items.length - 1, Math.max(0, nextIndex));

		if (boundedIndex === activeIndex) {
			return;
		}

		const trigger = scrollTriggerRef.current;

		if (trigger) {
			const targetProgress = boundedIndex / (items.length - 1);
			const targetY = trigger.start + (trigger.end - trigger.start) * targetProgress;

			window.scrollTo({
				top: targetY,
				behavior: "smooth",
			});
			return;
		}

		activeIndexRef.current = boundedIndex;
		setActiveIndex(boundedIndex);
		setLineStep(boundedIndex);
	};

	const handlePaginationClick = (nextIndex: number) => {
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
		<section className="what_you_get" ref={sectionRef}>
			<div className="what_pin" ref={pinRef}>
				<div className="content_container what_container">
					<h2 className="services_title numbers_gradient-text !capitalize">What you get ?</h2>

					<div className="what_slider" ref={sliderRef} style={{ "--active": activeIndex } as CSSProperties}>
						<div
							className="what_track"
							ref={trackRef}
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
			</div>
		</section>
	);
}
