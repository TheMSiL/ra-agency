'use client'

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "./VersionedImage";
import { useLayoutEffect, useRef } from "react";

import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

interface ServicesBlockProps {
	title: string;
	subtitle: string;
	items: string[];
	icon: string;
	href: string;
}

export default function ServicesBlock({ title, subtitle, items, icon, href }: ServicesBlockProps) {
	const isCompactTimeline = items.length === 3;
	const blockRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const block = blockRef.current;

		if (!block) {
			return;
		}

		const context = gsap.context(() => {
			const media = gsap.matchMedia();

			media.add(
				{
					desktop: '(min-width: 769px)',
					allowMotion: '(prefers-reduced-motion: no-preference)',
				},
				(mediaContext) => {
					const { desktop, allowMotion } = mediaContext.conditions as {
						desktop: boolean;
						allowMotion: boolean;
					};

					if (!desktop || !allowMotion) {
						gsap.set(block, { clearProps: 'height' });
						gsap.set('.services_timeline-line, .services_circle, .services_item-text', {
							clearProps: 'all',
						});
						return;
					}

					const collapsedHeight = 118;
					const getExpandedHeight = () => {
						gsap.set(block, { height: 'auto' });
						// scrollHeight includes the section's bottom padding, even while it is clipped.
						const height = Math.ceil(block.scrollHeight);
						gsap.set(block, { height: collapsedHeight });
						return height + 1;
					};

					gsap.set('.services_timeline-line', { scaleX: 0, transformOrigin: 'center center' });
					gsap.set('.services_circle', { autoAlpha: 0, scale: 0 });
					gsap.set('.services_item-text', { autoAlpha: 0, y: 14 });

					const timeline = gsap.timeline({
						scrollTrigger: {
							trigger: block,
							start: 'top 95%',
							end: 'top 35%',
							scrub: 1.6,
							invalidateOnRefresh: true,
						},
					});

					timeline.fromTo(block, { height: collapsedHeight }, {
						height: getExpandedHeight,
						ease: 'power2.inOut',
						duration: 1,
					});

					const detailsTimeline = gsap.timeline({
						scrollTrigger: {
							trigger: block,
							start: 'top 72%',
							end: 'top 5%',
							scrub: 2.2,
							invalidateOnRefresh: true,
						},
					});

					detailsTimeline
						.to('.services_timeline-line', {
							scaleX: 1,
							ease: 'power2.out',
							duration: 0.55,
						})
						.to('.services_circle', {
							autoAlpha: 1,
							scale: 1,
							ease: 'back.out(1.8)',
							stagger: 0.07,
							duration: 0.32,
						}, 0.36)
						.to('.services_item-text', {
							autoAlpha: 1,
							y: 0,
							ease: 'power2.out',
							stagger: 0.07,
							duration: 0.42,
						}, 0.56);

					return () => {
						timeline.kill();
						detailsTimeline.kill();
					};
				},
			);

			return () => media.revert();
		}, block);

		return () => context.revert();
	}, []);

	return (
		<section className="services_block section_background " ref={blockRef}>
			<div className="content_container">
				<div className="services_inner">
					<div className="services_header">
						<Image
							src={icon}
							alt=""
							width={230}
							height={230}
							className="services_icon"
						/>
						<div className="services_copy">
							<h2 className="services_title">{title}</h2>
							<p className="services_subtitle">{subtitle}</p>
						</div>
						<Image
							src={icon}
							alt=""
							width={230}
							height={230}
							className="services_icon services_icon-mirror"
						/>
					</div>

					<div className={`services_timeline ${isCompactTimeline ? "services_timeline-compact" : ""}`}>
						<div
							className="services_timeline-line"
							style={{
								left: `calc(100% / ${items.length * 2})`,
								right: `calc(100% / ${items.length * 2})`,
							}}
						/>
						<div
							className="services_items"
							style={{
								gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
							}}
						>
							{items.map((item, index) => {
								return (
									<div key={`${item}-${index}`} className="services_item">
										<span className="services_circle" />
										<p className="services_item-text">
											{item}
										</p>
									</div>
								);
							})}
						</div>
					</div>

					<Button title="See more" extra="services_btn" href={href} />
				</div>
			</div>
		</section>
	);
}
