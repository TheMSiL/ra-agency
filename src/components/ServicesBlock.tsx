'use client'

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

interface ServicesBlockProps {
	title: string;
	subtitle: string;
	items: string[];
	icon: string;
}

export default function ServicesBlock({ title, subtitle, items, icon }: ServicesBlockProps) {
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
						return;
					}

					const getExpandedHeight = () => {
						gsap.set(block, { height: 'auto' });
						const height = block.offsetHeight;
						gsap.set(block, { height: 118 });
						return height;
					};

					const tween = gsap.fromTo(
						block,
						{ height: 118 },
						{
							height: getExpandedHeight,
							ease: 'power2.inOut',
							scrollTrigger: {
								trigger: block,
								start: 'top 95%',
								end: 'top 5%',
								scrub: 1.6,
								invalidateOnRefresh: true,
							},
						},
					);

					return () => tween.kill();
				},
			);

			return () => media.revert();
		}, block);

		return () => context.revert();
	}, []);

	return (
		<section className="services_block" ref={blockRef}>
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

					<Button title="See more" extra="services_btn" />
				</div>
			</div>
		</section>
	);
}
