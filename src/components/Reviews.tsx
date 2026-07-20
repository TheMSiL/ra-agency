'use client';

import Image from 'next/image';
import { gsap } from 'gsap';
import { useLayoutEffect, useRef, useState } from 'react';

const reviewsData = [
	{ id: 'review-1', icon: '/company_review.png', title: 'company name', description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side', date: '8 December 2025' },
	{ id: 'review-2', icon: '/company_review.png', title: 'company name', description: 'The RA Agency team helped us turn Telegram Ads from an experimental channel into a stable acquisition source. They rebuilt the campaign structure, separated warm and cold audiences, and kept testing creatives without losing control of the budget. Reporting was clear, decisions were fast, and every change had a reason behind it.', date: '8 December 2025' },
	{ id: 'review-3', icon: '/company_review.png', title: 'company name', description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side', date: '8 December 2025' },
	{ id: 'review-4', icon: '/company_review.png', title: 'company name', description: 'We needed a partner who could move quickly, understand our offer, and keep performance readable for the whole team. RA Agency handled the media buying, targeting logic, and optimization rhythm with a lot of ownership. The best part was how predictable the process felt: weekly learnings, clean next steps, and no wasted motion.', date: '8 December 2025' },
	{ id: 'review-5', icon: '/company_review.png', title: 'company name', description: 'Before working together, our campaigns were inconsistent and hard to scale. RA Agency gave us a much cleaner setup: sharper channel selection, better audience grouping, and a testing framework that made results easier to compare. Within a short period, we had a stronger understanding of what messages worked and where to invest more aggressively.', date: '8 December 2025' },
	{ id: 'review-6', icon: '/company_review.png', title: 'company name', description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side Communication stood out from the start - clear, fast, no unnecessary back-and-forth.', date: '8 December 2025' },
];

type Direction = 'prev' | 'next';

function wrappedIndex(index: number) {
	return (index + reviewsData.length) % reviewsData.length;
}

function relativePosition(index: number, activeIndex: number) {
	let distance = index - activeIndex;
	const half = reviewsData.length / 2;
	if (distance > half) distance -= reviewsData.length;
	if (distance < -half) distance += reviewsData.length;
	return distance;
}

function cardTransform(index: number, activeIndex: number, compact: boolean) {
	const position = relativePosition(index, activeIndex);
	const depth = Math.abs(position);
	const side = Math.sign(position);
	const step = compact ? 32 : 92;

	return {
		xPercent: -50,
		yPercent: -50,
		x: side * step * Math.min(depth, 2.4),
		y: depth * (compact ? -5 : -12),
		scale: Math.max(0.72, 1 - depth * (compact ? 0.045 : 0.075)),
		rotationY: side * Math.min(depth * 1.7, 4),
		autoAlpha: Math.max(0.2, 1 - depth * 0.19),
		zIndex: 20 - depth,
	};
}

function ReviewCard({ review, index, active }: { review: (typeof reviewsData)[number]; index: number; active: boolean }) {
	return (
		<article className={`review_card review_deck-card${active ? ' review_card-active' : ''}`} data-review-index={index} aria-hidden={!active}>
			<div className="review_card-head">
				<Image src={review.icon} alt="" width={70} height={70} />
				<h3>{review.title}</h3>
			</div>
			<p className="review_card-text">{review.description}</p>
			<div className="review_card-footer"><time>{review.date}</time></div>
		</article>
	);
}

export default function Reviews() {
	const [activeIndex, setActiveIndex] = useState(1);
	const [transition, setTransition] = useState<{ from: number; to: number; direction: Direction } | null>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const touchStartRef = useRef<{ x: number; y: number } | null>(null);

	useLayoutEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const cards = Array.from(track.querySelectorAll<HTMLElement>('.review_deck-card'));
		const compact = window.matchMedia('(max-width: 1200px)').matches;

		if (!transition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			cards.forEach((card, index) => gsap.set(card, cardTransform(index, activeIndex, compact)));
			if (!transition) return;
			const resetTimer = window.setTimeout(() => setTransition(null), 0);
			return () => window.clearTimeout(resetTimer);
		}

		const context = gsap.context(() => {
			cards.forEach((card, index) => gsap.set(card, cardTransform(index, transition.from, compact)));
			const outgoing = cards[transition.from];
			const direction = transition.direction === 'next' ? -1 : 1;
			const timeline = gsap.timeline({ onComplete: () => setTransition(null) });

			timeline.to(outgoing, {
				xPercent: -50,
				yPercent: -50,
				x: direction * (compact ? 58 : 178),
				y: compact ? 8 : 26,
				scale: compact ? 0.92 : 0.84,
				rotationY: direction * -5,
				autoAlpha: compact ? 0.45 : 0.34,
				duration: 0.42,
				ease: 'power2.inOut',
			}, 0);

			cards.forEach((card, index) => {
				if (index === transition.from) return;
				timeline.to(card, { ...cardTransform(index, transition.to, compact), duration: 0.72, ease: 'power3.inOut' }, 0.05);
			});

			timeline.set(outgoing, { zIndex: cardTransform(transition.from, transition.to, compact).zIndex }, 0.4)
				.to(outgoing, { ...cardTransform(transition.from, transition.to, compact), duration: 0.48, ease: 'power3.out' }, 0.4);
		}, track);

		return () => context.revert();
	}, [activeIndex, transition]);

	function goTo(nextIndex: number, direction: Direction) {
		if (transition || nextIndex === activeIndex) return;
		setTransition({ from: activeIndex, to: nextIndex, direction });
		setActiveIndex(nextIndex);
	}

	function changeReview(direction: Direction) {
		goTo(wrappedIndex(activeIndex + (direction === 'next' ? 1 : -1)), direction);
	}

	function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
		const start = touchStartRef.current;
		const touch = event.changedTouches[0];
		touchStartRef.current = null;
		if (!start || !touch) return;
		const deltaX = touch.clientX - start.x;
		const deltaY = touch.clientY - start.y;
		if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) changeReview(deltaX < 0 ? 'next' : 'prev');
	}

	return (
		<div className="reviews sm:pb-28 pb-20 xl:pb-48 pt-20">
			<div className="content_container">
				<h2 className="text-center numbers_gradient-text numbers_title">REVIEW</h2>
				<div className="reviews_slider">
					<button className="review_arrow-cont" type="button" aria-label="Previous review" disabled={transition !== null} onClick={() => changeReview('prev')}><Image src="/review_arrow.svg" alt="" width={24} height={35} /></button>
					<div ref={trackRef} className="reviews_track reviews_deck" onTouchStart={(event) => { const touch = event.touches[0]; touchStartRef.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={handleTouchEnd}>
						{reviewsData.map((review, index) => <ReviewCard key={review.id} review={review} index={index} active={index === activeIndex} />)}
					</div>
					<div className="reviews_pagination" aria-label="Review pagination">{reviewsData.map((review, index) => <button key={review.id} className={`reviews_pagination-dot ${index === activeIndex ? 'active' : ''}`} type="button" aria-label={`Go to review ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined} disabled={transition !== null} onClick={() => { const forward = wrappedIndex(index - activeIndex); const backward = wrappedIndex(activeIndex - index); goTo(index, forward <= backward ? 'next' : 'prev'); }} />)}</div>
					<button className="review_arrow-cont" type="button" aria-label="Next review" disabled={transition !== null} onClick={() => changeReview('next')}><Image className="rotate-180" src="/review_arrow.svg" alt="" width={24} height={35} /></button>
				</div>
			</div>
		</div>
	);
}
