'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useI18n } from '@/context/I18nContext';
import type { SanityReview } from '@/sanity/lib/reviews';

function ReviewCardContent({ review }: { review: SanityReview }) {
	return (
		<>
			<div className="review_card-head">
				{review.icon && <Image src={review.icon} alt="" width={70} height={70} />}
				<h3>{review.title}</h3>
			</div>
			<div className="review_card-author">
				<strong>{review.author}</strong>
				<span>{review.role}</span>
			</div>
			<p className="review_card-text">{review.description}</p>
		</>
	);
}

export default function Reviews({ reviewsData }: { reviewsData: SanityReview[] }) {
	const { t } = useI18n();
	const [activeIndex, setActiveIndex] = useState(0);
	const swiperRef = useRef<SwiperInstance | null>(null);
	const loopReviews = Array.from({ length: 3 }, (_, copyIndex) =>
		reviewsData.map((review, reviewIndex) => ({ review, reviewIndex, copyIndex })),
	).flat();

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
		<div className="reviews py-20">
			<Image className="reviews_background-art reviews_background-art--left" src="/left_bg-asset.svg" alt="" width={890} height={995} aria-hidden="true" />
			<Image className="reviews_background-art reviews_background-art--right" src="/right_bg-asset.svg" alt="" width={1008} height={1464} aria-hidden="true" />
			<div className="content_container">
				<h2 className="text-center numbers_gradient-text numbers_title">{t("reviews.title")}</h2>
				{reviewsData.length > 0 && <div className="reviews_slider">
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
						initialSlide={reviewsData.length}
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
				</div>}
			</div>
		</div>
	);
}
