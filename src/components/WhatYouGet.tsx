"use client";

import Image from "next/image";
import type { CSSProperties, TouchEvent as ReactTouchEvent } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
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

function AnimatedCount({ value }: { value: string }) {
	const [displayedValue, setDisplayedValue] = useState(value);
	const currentRef = useRef<HTMLSpanElement | null>(null);
	const nextRef = useRef<HTMLSpanElement | null>(null);

	useLayoutEffect(() => {
		if (value === displayedValue || !currentRef.current || !nextRef.current) return;

		const current = currentRef.current;
		const next = nextRef.current;
		const timeline = gsap.timeline({
			onComplete: () => {
				flushSync(() => setDisplayedValue(value));
				gsap.set(current, { yPercent: 0, autoAlpha: 1 });
				gsap.set(next, { yPercent: 100, autoAlpha: 0 });
			},
		});

		gsap.set(next, { yPercent: 100, autoAlpha: 1 });
		timeline
			.to(current, { yPercent: -100, duration: 0.42, ease: "power3.inOut" }, 0)
			.to(next, { yPercent: 0, duration: 0.42, ease: "power3.inOut" }, 0);

		return () => {
			timeline.kill();
		};
	}, [value, displayedValue]);

	return (
		<span className="what_count font-display" aria-live="polite">
			<span className="what_count-value" ref={currentRef}>{displayedValue}</span>
			<span className="what_count-value what_count-value-next" ref={nextRef} aria-hidden="true">{value}</span>
		</span>
	);
}

export default function WhatYouGet() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [lineStep, setLineStep] = useState(0);
	const sectionRef = useRef<HTMLElement | null>(null);
	const pinRef = useRef<HTMLDivElement | null>(null);
	const sliderRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<HTMLDivElement | null>(null);
	const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
	const activeIndexRef = useRef(0);
	const wheelLockedRef = useRef(false);

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

			const setStep = (nextIndex: number, animate = true) => {
				const boundedIndex = Math.min(items.length - 1, Math.max(0, nextIndex));
				const distance = track.scrollWidth - slider.clientWidth;

				gsap.to(track, {
					x: -(distance * boundedIndex) / (items.length - 1),
					duration: animate ? 0.72 : 0,
					ease: "power3.inOut",
					overwrite: true,
				});

				if (boundedIndex === activeIndexRef.current) return;
				activeIndexRef.current = boundedIndex;
				setActiveIndex(boundedIndex);
				setLineStep(boundedIndex);
			};

			const updateActiveIndex = (progress: number, animate = true) => {
				const nextIndex = Math.round(progress * (items.length - 1));
				setStep(nextIndex, animate);
			};

			const trigger = ScrollTrigger.create({
				trigger: section,
				start: "top top",
				end: `+=${PIN_SCROLL_DISTANCE}`,
				pin,
				anticipatePin: 1,
				invalidateOnRefresh: true,
				onUpdate: (self) => updateActiveIndex(self.progress),
				onRefresh: (self) => updateActiveIndex(self.progress, false),
			});

			const onWheel = (event: WheelEvent) => {
				if (!trigger.isActive || Math.abs(event.deltaY) < 4) return;

				const direction = event.deltaY > 0 ? 1 : -1;
				const currentIndex = activeIndexRef.current;
				const atBoundary = direction > 0
					? currentIndex === items.length - 1
					: currentIndex === 0;

				if (atBoundary) return;

				event.preventDefault();
				if (wheelLockedRef.current) return;
				wheelLockedRef.current = true;

				const nextIndex = currentIndex + direction;
				setStep(nextIndex);
				const targetProgress = nextIndex / (items.length - 1);
				window.scrollTo({
					top: trigger.start + (trigger.end - trigger.start) * targetProgress,
					behavior: "smooth",
				});

				window.setTimeout(() => {
					wheelLockedRef.current = false;
				}, 760);
			};

			window.addEventListener("wheel", onWheel, { passive: false });
			scrollTriggerRef.current = trigger;

			return () => {
				window.removeEventListener("wheel", onWheel);
				trigger.kill();
			};
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
		const track = trackRef.current;
		const slider = sliderRef.current;

		activeIndexRef.current = boundedIndex;
		setActiveIndex(boundedIndex);
		setLineStep(boundedIndex);

		if (track && slider) {
			gsap.to(track, {
				x: -((track.scrollWidth - slider.clientWidth) * boundedIndex) / (items.length - 1),
				duration: 0.72,
				ease: "power3.inOut",
				overwrite: true,
			});
		}

		if (trigger) {
			const targetProgress = boundedIndex / (items.length - 1);
			const targetY = trigger.start + (trigger.end - trigger.start) * targetProgress;

			window.scrollTo({
				top: targetY,
				behavior: "smooth",
			});
			return;
		}
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
			<div className="what_pin section_background" ref={pinRef}>
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
						<AnimatedCount value={items[activeIndex].kicker} />
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
