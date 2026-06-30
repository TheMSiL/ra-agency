'use client';

import Image from "next/image";
import { useState } from "react";

const reviewsData = [
	{
		id: 'review-1',
		icon: '/company_review.png',
		title: 'company name',
		description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side',
		rating: 5,
		date: '8 December 2025'
	},
	{
		id: 'review-2',
		icon: '/company_review.png',
		title: 'company name',
		description: 'The RA Agency team helped us turn Telegram Ads from an experimental channel into a stable acquisition source. They rebuilt the campaign structure, separated warm and cold audiences, and kept testing creatives without losing control of the budget. Reporting was clear, decisions were fast, and every change had a reason behind it.',
		rating: 5,
		date: '8 December 2025'
	},
	{
		id: 'review-3',
		icon: '/company_review.png',
		title: 'company name',
		description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side',
		rating: 5,
		date: '8 December 2025'
	},
	{
		id: 'review-4',
		icon: '/company_review.png',
		title: 'company name',
		description: 'We needed a partner who could move quickly, understand our offer, and keep performance readable for the whole team. RA Agency handled the media buying, targeting logic, and optimization rhythm with a lot of ownership. The best part was how predictable the process felt: weekly learnings, clean next steps, and no wasted motion.',
		rating: 5,
		date: '8 December 2025'
	},
	{
		id: 'review-5',
		icon: '/company_review.png',
		title: 'company name',
		description: 'Before working together, our campaigns were inconsistent and hard to scale. RA Agency gave us a much cleaner setup: sharper channel selection, better audience grouping, and a testing framework that made results easier to compare. Within a short period, we had a stronger understanding of what messages worked and where to invest more aggressively.',
		rating: 5,
		date: '8 December 2025'
	},
	{
		id: 'review-6',
		icon: '/company_review.png',
		title: 'company name',
		description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side',
		rating: 5,
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
				<div className="review_rating" aria-label={`${review.rating} stars`}>
					{Array.from({ length: review.rating }).map((_, index) => (
						<span key={index}>★</span>
					))}
				</div>
				<time>{review.date}</time>
			</div>
		</article>
	);
}

export default function Reviews() {
	const [activeIndex, setActiveIndex] = useState(1);
	const [animation, setAnimation] = useState<{
		direction: 'prev' | 'next';
		phase: 'exit' | 'enter';
	} | null>(null);
	const prevReview = reviewsData[getWrappedIndex(activeIndex - 1)];
	const activeReview = reviewsData[activeIndex];
	const nextReview = reviewsData[getWrappedIndex(activeIndex + 1)];
	const trackClassName = [
		'reviews_track',
		animation ? `reviews_track-${animation.direction}-${animation.phase}` : '',
	].filter(Boolean).join(' ');

	function changeReview(direction: 'prev' | 'next') {
		if (animation) {
			return;
		}

		setAnimation({ direction, phase: 'exit' });

		window.setTimeout(() => {
			setActiveIndex((current) =>
				getWrappedIndex(direction === 'next' ? current + 1 : current - 1)
			);
			setAnimation({ direction, phase: 'enter' });
		}, 320);

		window.setTimeout(() => {
			setAnimation(null);
		}, 860);
	}

	return (
		<div className="reviews pb-48">
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
					<div className={trackClassName}>
						<ReviewCard key={`prev-${prevReview.id}`} review={prevReview} position="prev" />
						<ReviewCard key={`active-${activeReview.id}`} review={activeReview} position="active" />
						<ReviewCard key={`next-${nextReview.id}`} review={nextReview} position="next" />
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
