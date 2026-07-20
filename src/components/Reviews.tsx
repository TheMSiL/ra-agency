'use client';

import Image from "next/image";
import { gsap } from "gsap";
import { useLayoutEffect, useRef, useState } from "react";

const reviewsData = [
	{
		id: 'review-1',
		icon: '/company_review.png',
		title: 'company name',
		description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side',
		date: '8 December 2025'
	},
	{
		id: 'review-2',
		icon: '/company_review.png',
		title: 'company name',
		description: 'The RA Agency team helped us turn Telegram Ads from an experimental channel into a stable acquisition source. They rebuilt the campaign structure, separated warm and cold audiences, and kept testing creatives without losing control of the budget. Reporting was clear, decisions were fast, and every change had a reason behind it.',
		date: '8 December 2025'
	},
	{
		id: 'review-3',
		icon: '/company_review.png',
		title: 'company name',
		description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side',
		date: '8 December 2025'
	},
	{
		id: 'review-4',
		icon: '/company_review.png',
		title: 'company name',
		description: 'We needed a partner who could move quickly, understand our offer, and keep performance readable for the whole team. RA Agency handled the media buying, targeting logic, and optimization rhythm with a lot of ownership. The best part was how predictable the process felt: weekly learnings, clean next steps, and no wasted motion.',
		date: '8 December 2025'
	},
	{
		id: 'review-5',
		icon: '/company_review.png',
		title: 'company name',
		description: 'Before working together, our campaigns were inconsistent and hard to scale. RA Agency gave us a much cleaner setup: sharper channel selection, better audience grouping, and a testing framework that made results easier to compare. Within a short period, we had a stronger understanding of what messages worked and where to invest more aggressively.',
		date: '8 December 2025'
	},
	{
		id: 'review-6',
		icon: '/company_review.png',
		title: 'company name',
		description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side',
		date: '8 December 2025'
	},
]

function getWrappedIndex(index: number) {
	return (index + reviewsData.length) % reviewsData.length;
}

function ReviewCard({
	review,
	position,
}: {
	review: (typeof reviewsData)[number];
	position: 'prev' | 'active' | 'next';
}) {
	const positionClass = {
		prev: 'review_card-prev',
		active: 'review_card-active',
		next: 'review_card-next',
	}[position];

	return (
		<article className={`review_card ${positionClass}`}>
			<div className="review_card-head">
				<Image src={review.icon} alt="" width={58} height={58} />
				<h3>{review.title}</h3>
			</div>
			<p className="review_card-text">{review.description}</p>
			<div className="review_card-footer">
				<time>{review.date}</time>
			</div>
		</article>
	);
}

export default function Reviews() {
	const [activeIndex, setActiveIndex] = useState(1);
	const touchStartRef = useRef<{ x: number; y: number } | null>(null);
	const [animation, setAnimation] = useState<{
		direction: 'prev' | 'next';
		previousIndex: number;
	} | null>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const prevReview = reviewsData[getWrappedIndex(activeIndex - 1)];
	const activeReview = reviewsData[activeIndex];
	const nextReview = reviewsData[getWrappedIndex(activeIndex + 1)];
	const trackClassName = [
		'reviews_track',
		animation ? `reviews_track-${animation.direction}` : '',
	].filter(Boolean).join(' ');

	useLayoutEffect(() => {
		if (!animation || !trackRef.current) {
			return;
		}

		const track = trackRef.current;
		const incoming = Array.from(track.children).find(
			(element) => element.classList.contains('review_card-active')
		) as HTMLElement | undefined;
		const outgoing = track.querySelector<HTMLElement>('.review_card-outgoing');
		const sideCards = Array.from(
			track.querySelectorAll<HTMLElement>(':scope > .review_card-prev, :scope > .review_card-next')
		);
		const transitionFx = track.querySelector<HTMLElement>('.review_transition-fx');
		const transitionGlow = track.querySelector<HTMLElement>('.review_transition-glow');

		if (!incoming || !outgoing || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setAnimation(null);
			return;
		}

		const incomingContent = incoming.children;
		const direction = animation.direction === 'next' ? 1 : -1;
		const isCompact = window.matchMedia('(max-width: 1200px)').matches;
		const context = gsap.context(() => {
			gsap.set(incoming, {
				autoAlpha: 0,
				x: direction * (isCompact ? 72 : 150),
				y: isCompact ? 8 : 18,
				scale: isCompact ? 0.96 : 0.86,
				rotationY: isCompact ? 0 : direction * -13,
				filter: 'blur(10px)',
			});
			gsap.set(outgoing, { autoAlpha: 1 });
			gsap.set(sideCards, { autoAlpha: 0.12, scale: 0.94 });
			gsap.set(incomingContent, { autoAlpha: 0, y: 26, filter: 'blur(7px)' });
			gsap.set(transitionFx, { autoAlpha: 1 });
			gsap.set(transitionGlow, { autoAlpha: 0, scale: 0.42 });

			gsap.timeline({
				defaults: { overwrite: 'auto' },
				onComplete: () => setAnimation(null),
			})
				.to(outgoing, {
					autoAlpha: 0,
					x: direction * (isCompact ? -72 : -170),
					y: isCompact ? -6 : -20,
					scale: isCompact ? 0.96 : 0.82,
					rotationY: isCompact ? 0 : direction * 12,
					filter: 'blur(10px)',
					duration: 0.62,
					ease: 'power3.in',
				}, 0)
				.to(transitionGlow, {
					autoAlpha: 0.9,
					scale: 1.18,
					duration: 0.46,
					ease: 'power2.out',
				}, 0.08)
				.to(transitionGlow, {
					autoAlpha: 0,
					scale: 1.55,
					duration: 0.62,
					ease: 'power2.in',
				}, 0.46)
				.to(incoming, {
					autoAlpha: 1,
					x: 0,
					y: 0,
					scale: 1,
					rotationY: 0,
					filter: 'blur(0px)',
					duration: 0.9,
					ease: 'expo.out',
				}, 0.28)
				.to(incomingContent, {
					autoAlpha: 1,
					y: 0,
					filter: 'blur(0px)',
					duration: 0.62,
					stagger: 0.09,
					ease: 'power3.out',
				}, 0.48)
				.to(sideCards, {
					autoAlpha: 0.3,
					scale: 1,
					duration: 0.82,
					ease: 'expo.out',
				}, 0.34)
				.to(transitionFx, { autoAlpha: 0, duration: 0.3 }, 0.94);
		}, track);

		return () => context.revert();
	}, [animation]);

	function startReviewTransition(nextIndex: number, direction: 'prev' | 'next') {
		if (animation) {
			return;
		}

		setAnimation({ direction, previousIndex: activeIndex });
		setActiveIndex(nextIndex);
	}

	function changeReview(direction: 'prev' | 'next') {
		startReviewTransition(
			getWrappedIndex(direction === 'next' ? activeIndex + 1 : activeIndex - 1),
			direction
		);
	}

	function goToReview(nextIndex: number) {
		if (nextIndex === activeIndex || animation) {
			return;
		}

		const forwardDistance = getWrappedIndex(nextIndex - activeIndex);
		const backwardDistance = getWrappedIndex(activeIndex - nextIndex);
		startReviewTransition(nextIndex, forwardDistance <= backwardDistance ? 'next' : 'prev');
	}

	function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
		const touch = event.touches[0];
		touchStartRef.current = { x: touch.clientX, y: touch.clientY };
	}

	function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
		const start = touchStartRef.current;
		const touch = event.changedTouches[0];
		touchStartRef.current = null;

		if (!start || !touch || animation) {
			return;
		}

		const deltaX = touch.clientX - start.x;
		const deltaY = touch.clientY - start.y;
		const isHorizontalSwipe = Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

		if (!isHorizontalSwipe) {
			return;
		}

		changeReview(deltaX < 0 ? 'next' : 'prev');
	}

	return (
		<div className="reviews sm:pb-28 pb-20 xl:pb-48 pt-20">
			<div className="content_container">
				<h2 className="text-center numbers_gradient-text numbers_title">REVIEW</h2>
				<div className="reviews_slider">
					<button
						className="review_arrow-cont"
						type="button"
						aria-label="Previous review"
						disabled={animation !== null}
						onClick={() => changeReview('prev')}
					>
						<Image src='/review_arrow.svg' alt="" width={24} height={35} />
					</button>
					<div ref={trackRef} className={trackClassName} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
						<div className="review_transition-fx" aria-hidden="true">
							<span className="review_transition-glow" />
						</div>
						<ReviewCard key={`prev-${prevReview.id}`} review={prevReview} position="prev" />
						<ReviewCard key={`active-${activeReview.id}`} review={activeReview} position="active" />
						{animation && (
							<div className="review_card-outgoing" aria-hidden="true">
								<ReviewCard review={reviewsData[animation.previousIndex]} position="active" />
							</div>
						)}
						<ReviewCard key={`next-${nextReview.id}`} review={nextReview} position="next" />
					</div>
					<div className="reviews_pagination" aria-label="Review pagination">
						{reviewsData.map((review, index) => (
							<button
								key={review.id}
								className={`reviews_pagination-dot ${index === activeIndex ? 'active' : ''}`}
								type="button"
								aria-label={`Go to review ${index + 1}`}
								aria-current={index === activeIndex ? 'true' : undefined}
								disabled={animation !== null}
								onClick={() => goToReview(index)}
							/>
						))}
					</div>
					<button
						className="review_arrow-cont"
						type="button"
						aria-label="Next review"
						disabled={animation !== null}
						onClick={() => changeReview('next')}
					>
						<Image className="rotate-180" src='/review_arrow.svg' alt="" width={24} height={35} />
					</button>
				</div>
			</div>
		</div>
	);
}
