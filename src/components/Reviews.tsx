'use client';

import Image from 'next/image';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const reviewsData = [
	{ id: 'review-1', icon: '/company_review.png', title: 'company name', description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side', date: '8 December 2025' },
	{ id: 'review-2', icon: '/company_review.png', title: 'company name', description: 'The RA Agency team helped us turn Telegram Ads from an experimental channel into a stable acquisition source. They rebuilt the campaign structure, separated warm and cold audiences, and kept testing creatives without losing control of the budget. Reporting was clear, decisions were fast, and every change had a reason behind it.', date: '8 December 2025' },
	{ id: 'review-3', icon: '/company_review.png', title: 'company name', description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side', date: '8 December 2025' },
	{ id: 'review-4', icon: '/company_review.png', title: 'company name', description: 'We needed a partner who could move quickly, understand our offer, and keep performance readable for the whole team. RA Agency handled the media buying, targeting logic, and optimization rhythm with a lot of ownership. The best part was how predictable the process felt: weekly learnings, clean next steps, and no wasted motion.', date: '8 December 2025' },
	{ id: 'review-5', icon: '/company_review.png', title: 'company name', description: 'Before working together, our campaigns were inconsistent and hard to scale. RA Agency gave us a much cleaner setup: sharper channel selection, better audience grouping, and a testing framework that made results easier to compare. Within a short period, we had a stronger understanding of what messages worked and where to invest more aggressively.', date: '8 December 2025' },
	{ id: 'review-6', icon: '/company_review.png', title: 'company name', description: 'Working with RA Agency on our Telegram Ads campaigns was a smooth and productive experience throughout. Communication stood out from the start - clear, fast, no unnecessary back-and-forth. The team always knew what we needed and responded precisely. What genuinely impressed us was their approach to targeting: they combine audience and channel segmentation with automation on the setup side Communication stood out from the start - clear, fast, no unnecessary back-and-forth.', date: '8 December 2025' },
];

const loopReviews = Array.from({ length: 3 }, (_, copyIndex) =>
	reviewsData.map((review, reviewIndex) => ({ review, reviewIndex, copyIndex })),
).flat();

function ReviewCardContent({ review }: { review: (typeof reviewsData)[number] }) {
	return (
		<>
			<div className="review_card-head">
				<Image src={review.icon} alt="" width={70} height={70} />
				<h3>{review.title}</h3>
			</div>
			<p className="review_card-text">{review.description}</p>
			<div className="review_card-footer"><time>{review.date}</time></div>
		</>
	);
}

export default function Reviews() {
	const [activeIndex, setActiveIndex] = useState(1);
	const swiperRef = useRef<SwiperInstance | null>(null);

	function syncActiveSlide(swiper: SwiperInstance) {
		const reviewIndex = Number(swiper.slides[swiper.activeIndex]?.dataset.reviewIndex);
		if (Number.isInteger(reviewIndex)) setActiveIndex(reviewIndex);
	}

	function goToReview(reviewIndex: number) {
		const swiper = swiperRef.current;
		if (!swiper) return;

		const candidates = swiper.slides
			.map((slide, slideIndex) => ({ slide, slideIndex }))
			.filter(({ slide }) => Number(slide.dataset.reviewIndex) === reviewIndex)
			.sort((a, b) => Math.abs(a.slideIndex - swiper.activeIndex) - Math.abs(b.slideIndex - swiper.activeIndex));
		const target = candidates[0];
		if (target) swiper.slideTo(target.slideIndex);
	}

	return (
		<div className="reviews sm:pb-28 pb-20 xl:pb-48 pt-20">
			<div className="content_container">
				<h2 className="text-center numbers_gradient-text numbers_title">REVIEW</h2>
				<div className="reviews_slider">
					<button className="review_arrow-cont" type="button" aria-label="Previous review" onClick={() => swiperRef.current?.slidePrev()}><Image src="/review_arrow.svg" alt="" width={24} height={35} /></button>
					<Swiper
						className="reviews_track reviews_deck reviews_swiper"
						modules={[EffectCoverflow, Autoplay]}
						effect="coverflow"
						grabCursor
						loop
						loopAdditionalSlides={2}
						centeredSlides
						slidesPerView="auto"
						initialSlide={reviewsData.length + 1}
						speed={600}
						coverflowEffect={{ rotate: 0, stretch: '25%', depth: 250, modifier: 2, slideShadows: false }}
						autoplay={{ delay: 4000, pauseOnMouseEnter: true, disableOnInteraction: false }}
						onSwiper={(swiper) => { swiperRef.current = swiper; syncActiveSlide(swiper); }}
						onSlideChange={syncActiveSlide}
					>
						{loopReviews.map(({ review, reviewIndex, copyIndex }) => (
							<SwiperSlide
								key={`${copyIndex}-${review.id}`}
								tag="article"
								className="review_card review_deck-card"
								data-review-index={reviewIndex}
							>
								<ReviewCardContent review={review} />
							</SwiperSlide>
						))}
					</Swiper>
					<div className="reviews_pagination" aria-label="Review pagination">{reviewsData.map((review, index) => <button key={review.id} className={`reviews_pagination-dot ${index === activeIndex ? 'active' : ''}`} type="button" aria-label={`Go to review ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined} onClick={() => goToReview(index)} />)}</div>
					<button className="review_arrow-cont" type="button" aria-label="Next review" onClick={() => swiperRef.current?.slideNext()}><Image className="rotate-180" src="/review_arrow.svg" alt="" width={24} height={35} /></button>
				</div>
			</div>
		</div>
	);
}
