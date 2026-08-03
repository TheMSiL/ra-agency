"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

import { useI18n } from "@/context/I18nContext";
import { useAppReady } from "@/hooks/useAppReady";
import Header from "./Header";
import TypewriterText from "./TypewriterText";

type HeroType = "home" | "tg" | "meta" | "google";

const serviceContent: Record<Exclude<HeroType, "home">, {
	title: string;
	textKey: "hero.telegramText" | "hero.metaText" | "hero.googleText";
	background: string;
	mobileBackground?: string;
	mobileImage?: { src: string; width: number; height: number };
}> = {
	tg: {
		title: "Telegram ads",
		textKey: "hero.telegramText",
		background: "/tg_hero-bg.webp",
		mobileBackground: "/tg_hero-mob_bg.webp",
	},
	meta: {
		title: "Meta ads",
		textKey: "hero.metaText",
		background: "/meta_bg.webp",
		mobileBackground: "/meta_bg-mob.webp",
	},
	google: {
		title: "Google ads",
		textKey: "hero.googleText",
		background: "/google_bg.webp",
		mobileImage: { src: "/google_hero-mob.png", width: 402, height: 738 },
	},
};

export default function Hero({ type = "home" }: { type?: HeroType }) {
	const { t } = useI18n();
	const heroRef = useRef<HTMLElement>(null);
	const astronautDesktopRef = useRef<HTMLImageElement>(null);
	const astronautMobileRef = useRef<HTMLImageElement>(null);
	const roiMarqueeRef = useRef<HTMLDivElement>(null);
	const alignRoiRef = useRef<() => void>(() => undefined);
	const isAppReady = useAppReady();
	const isHome = type === "home";
	const content = isHome ? null : serviceContent[type];

	useLayoutEffect(() => {
		if (!isHome) return;
		const marquee = roiMarqueeRef.current;
		const desktopAstronaut = astronautDesktopRef.current;
		const mobileAstronaut = astronautMobileRef.current;
		if (!desktopAstronaut || !mobileAstronaut || !marquee) return;

		const alignMarquee = () => {
			const astronaut = window.matchMedia("(max-width: 768px)").matches
				? mobileAstronaut
				: desktopAstronaut;
			const astronautBox = astronaut.getBoundingClientRect();
			const marqueeBox = marquee.getBoundingClientRect();
			const titleBox = heroRef.current?.querySelector<HTMLElement>(".home_hero-title")?.getBoundingClientRect();
			const currentOffset = Number.parseFloat(marquee.style.top) || 0;
			const naturalMarqueeCenter = marqueeBox.top + marqueeBox.height / 2 - currentOffset;
			const naturalMarqueeTop = marqueeBox.top - currentOffset;
			const helmetLine = astronautBox.top + astronautBox.height * 0.16;
			const helmetOffset = helmetLine - naturalMarqueeCenter;
			const titleOffsetLimit = titleBox ? titleBox.bottom + 12 - naturalMarqueeTop : helmetOffset;
			marquee.style.top = `${Math.round(Math.max(helmetOffset, titleOffsetLimit))}px`;
		};

		alignRoiRef.current = alignMarquee;
		const observer = new ResizeObserver(alignMarquee);
		observer.observe(desktopAstronaut);
		observer.observe(mobileAstronaut);
		if (heroRef.current) observer.observe(heroRef.current);
		window.addEventListener('resize', alignMarquee);
		const frame = window.requestAnimationFrame(alignMarquee);
		document.fonts.ready.then(alignMarquee);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', alignMarquee);
			window.cancelAnimationFrame(frame);
			alignRoiRef.current = () => undefined;
		};
	}, [isHome]);

	useLayoutEffect(() => {
		const hero = heroRef.current;
		let updateRoiDepth: (() => void) | undefined;
		let observer: IntersectionObserver | undefined;
		let measure: (() => void) | undefined;

		if (!isAppReady) return;
		if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const context = gsap.context(() => {
			const revealItems = hero.querySelectorAll(".hero_reveal");
			const roiPills = Array.from(hero.querySelectorAll<HTMLElement>(".home_hero-roi-pill"));

			gsap.set(revealItems, { y: 72 });
			gsap.to(revealItems, {
				y: 0,
				autoAlpha: 1,
				duration: 1.05,
				ease: "power3.out",
				onUpdate: () => alignRoiRef.current(),
				onComplete: () => {
					alignRoiRef.current();
				},
			});

			const track = hero.querySelector<HTMLElement>(".home_hero-roi-track");

			if (roiPills.length > 0 && track) {
				// Reading a rect per pill on every frame forced a full layout 60
				// times a second, which is what made the hero stutter. The pill
				// positions inside the track never change, so they are measured
				// once and only the animated track is read per frame.
				let pillCenters: number[] = [];
				let heroCenter = 0;
				let depthRadius = 0;

				measure = () => {
					const heroBox = hero.getBoundingClientRect();
					heroCenter = heroBox.left + heroBox.width / 2;
					depthRadius = Math.min(340, Math.max(150, heroBox.width * 0.18));

					// Offsets are stored relative to the track, so the marquee
					// animation cancels out and they stay valid frame after frame.
					const trackLeft = track.getBoundingClientRect().left;
					pillCenters = roiPills.map((pill) => {
						const box = pill.getBoundingClientRect();
						return box.left + box.width / 2 - trackLeft;
					});
				};

				updateRoiDepth = () => {
					const trackLeft = track.getBoundingClientRect().left;

					roiPills.forEach((pill, index) => {
						const offset = trackLeft + pillCenters[index] - heroCenter;
						const distance = Math.abs(offset);
						const depth = 1 - gsap.utils.clamp(0, 1, distance / depthRadius);
						const fold = Math.pow(depth, 1.45);
						const foldDirection = offset < 0 ? -1 : 1;

						gsap.set(pill, {
							scale: 1 - fold * 0.62,
							autoAlpha: 1 - fold * 0.58,
							y: fold * -28,
							z: fold * -90,
							rotationY: foldDirection * fold * 52,
							transformPerspective: 700,
						});
					});
				};

				measure();
				window.addEventListener("resize", measure);

				// The marquee only matters while the hero is on screen; keeping the
				// ticker running below the fold cost frames on the rest of the page.
				observer = new IntersectionObserver(([entry]) => {
					if (!updateRoiDepth) return;
					if (entry.isIntersecting) {
						measure?.();
						gsap.ticker.add(updateRoiDepth);
					} else {
						gsap.ticker.remove(updateRoiDepth);
					}
				});
				observer.observe(hero);
			}
		}, hero);

		return () => {
			if (measure) window.removeEventListener("resize", measure);
			observer?.disconnect();
			if (updateRoiDepth) gsap.ticker.remove(updateRoiDepth);
			context.revert();
		};
	}, [isAppReady]);

	return (
		<section
			id={isHome ? "home" : "tg_home"}
			className={`home_hero${isHome ? " section_background" : ` tg_hero service_hero--${type}${type !== "meta" ? " section_background" : ""}`}`}
			ref={heroRef}
			style={content ? {
				backgroundImage: `url(${content.background})`,
				"--service-hero-bg-mobile": `url(${content.mobileBackground ?? content.background})`,
			} as React.CSSProperties : undefined}
		>
			{/* React hoists these into <head>. The hero backdrop is a CSS
			    background, so without a preload the browser only discovers it
			    after the stylesheet is parsed — the reason the first screen
			    stayed empty for a beat even on a fast connection. */}
			{content && (
				<link
					rel="preload"
					as="image"
					href={content.background}
					fetchPriority="high"
					media={content.mobileBackground ? "(min-width: 769px)" : undefined}
				/>
			)}
			{content?.mobileBackground && (
				<link rel="preload" as="image" href={content.mobileBackground} fetchPriority="high" media="(max-width: 768px)" />
			)}
			<div className="home_hero-visible">
				<Header />
				<div className="content_container home_hero-container">
					{isHome && <h1 className="home_hero-title typewriter_host"><TypewriterText text="RA AGENCY" step={70} /></h1>}
					{isHome && (
						<div ref={roiMarqueeRef} className="home_hero-roi-marquee" aria-label="ROI or DIE">
							<div className="home_hero-roi-track" aria-hidden="true">
								{[0, 1].map((group) => (
									<div className="home_hero-roi-group" key={group}>
										{Array.from({ length: 12 }, (_, index) => (
											<span className="home_hero-roi-pill" key={`${group}-${index}`}>ROI or DIE</span>
										))}
									</div>
								))}
							</div>
						</div>
					)}
					{isHome && (
						<>
							<span className="home_hero-planet-glow" aria-hidden="true" />
							<Image src="/planet.png" alt="" width={1165} height={783} loading="eager" className="home_hero-planet" aria-hidden="true" />
							<Image ref={astronautDesktopRef} src="/hero_img.png" alt="" width={1218} height={812} loading="eager" fetchPriority="high" className="home_hero-image home_hero-image--desktop hero_reveal" onLoad={() => alignRoiRef.current()} />
							<Image ref={astronautMobileRef} src="/home_hero_img-mob.png" alt="" width={402} height={457} loading="eager" fetchPriority="high" className="home_hero-image home_hero-image--mobile hero_reveal" aria-hidden="true" onLoad={() => alignRoiRef.current()} />
						</>
					)}
					{content?.mobileImage && (
						<Image
							src={content.mobileImage.src}
							alt=""
							width={content.mobileImage.width}
							height={content.mobileImage.height}
							loading="eager"
							className={`service_hero-image service_hero-image--${type} hero_reveal`}
							aria-hidden="true"
						/>
					)}
					{isHome ? (
						<div className="home_hero-content">
							<div className="mb-5">
								<h2 className="home_hero-heading"><TypewriterText text={t("hero.heading")} delay={180} step={32} /></h2>
								<p className="home_hero-text"><TypewriterText text={t("hero.text")} delay={420} step={20} /></p>
							</div>
							<div className="btn home_hero-btn home_hero-btn-anchor" aria-hidden="true" />
						</div>
					) : (
						<div className="service_hero-content">
							<h1 className="home_hero-title sub_hero-title typewriter_host"><TypewriterText text={content?.title ?? ""} step={58} /></h1>
							<div className="service_hero-bottom">
								<p className="home_hero-text opacity-80"><TypewriterText text={content ? t(content.textKey) : ""} delay={280} step={8} /></p>
								<div className="btn home_hero-btn home_hero-btn-anchor" aria-hidden="true" />
							</div>
						</div>
					)}
				</div>
			</div>
			{isHome && (
				<div className="home_hero-next-wrap">
					<div className="content_container">
						<h2 className="home_hero-next"><TypewriterText text={t("hero.next")} delay={700} step={36} /></h2>
					</div>
				</div>
			)}
		</section>
	);
}
