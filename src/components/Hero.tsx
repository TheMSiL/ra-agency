"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import Button from "./Button";
import ContactModal from "./ContactModal";
import Header from "./Header";
import TypewriterText from "./TypewriterText";
import { useI18n } from "@/context/I18nContext";

type HeroType = "home" | "tg" | "meta" | "google";

const serviceContent: Record<Exclude<HeroType, "home">, { title: string; textKey: "hero.telegramText" | "hero.metaText" | "hero.googleText"; background: string }> = {
	tg: {
		title: "Telegram ads",
		textKey: "hero.telegramText",
		background: "/tg_bg.png",
	},
	meta: {
		title: "Meta ads",
		textKey: "hero.metaText",
		background: "/meta_bg.png",
	},
	google: {
		title: "Google ads",
		textKey: "hero.googleText",
		background: "/google_bg.png",
	},
};

export default function Hero({ type = "home" }: { type?: HeroType }) {
	const { t } = useI18n();
	const heroRef = useRef<HTMLElement>(null);
	const astronautRef = useRef<HTMLImageElement>(null);
	const roiMarqueeRef = useRef<HTMLDivElement>(null);
	const alignRoiRef = useRef<() => void>(() => undefined);
	const [isContactOpen, setIsContactOpen] = useState(false);
	const isHome = type === "home";
	const content = isHome ? null : serviceContent[type];

	useLayoutEffect(() => {
		if (!isHome) return;
		const astronaut = astronautRef.current;
		const marquee = roiMarqueeRef.current;
		if (!astronaut || !marquee) return;

		const alignMarquee = () => {
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
		observer.observe(astronaut);
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

		if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const context = gsap.context(() => {
			const revealItems = hero.querySelectorAll(".hero_reveal");
			const button = hero.querySelector(".home_hero-btn");
			const roiPills = Array.from(hero.querySelectorAll<HTMLElement>(".home_hero-roi-pill"));

			gsap.set(button, { transition: "none" });
			gsap.set(revealItems, { y: 72 });
			gsap.to(revealItems, {
				y: 0,
				autoAlpha: 1,
				duration: 1.05,
				ease: "power3.out",
				onComplete: () => gsap.set(button, { clearProps: "transition" }),
			});

			if (roiPills.length > 0) {
				updateRoiDepth = () => {
					const heroBox = hero.getBoundingClientRect();
					const center = heroBox.left + heroBox.width / 2;
					const depthRadius = Math.min(340, Math.max(150, heroBox.width * 0.18));

					roiPills.forEach((pill) => {
						const box = pill.getBoundingClientRect();
						const pillCenter = box.left + box.width / 2;
						const offset = pillCenter - center;
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

				gsap.ticker.add(updateRoiDepth);
			}
		}, hero);

		return () => {
			if (updateRoiDepth) gsap.ticker.remove(updateRoiDepth);
			context.revert();
		};
	}, []);

	return (
		<section
			id={isHome ? "home" : "tg_home"}
			className={`home_hero${isHome ? " section_background" : ` tg_hero service_hero--${type}`}`}
			ref={heroRef}
			style={content ? { backgroundImage: `url(${content.background})` } : undefined}
		>
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
							<Image ref={astronautRef} src="/hero_img.png" alt="" width={1218} height={812} loading="eager" className="home_hero-image hero_reveal" onLoad={() => alignRoiRef.current()} />
						</>
					)}
					{isHome ? (
						<div className="home_hero-content">
							<div className="mb-5">
								<h2 className="home_hero-heading"><TypewriterText text={t("hero.heading")} delay={180} step={32} /></h2>
								<p className="home_hero-text"><TypewriterText text={t("hero.text")} delay={420} step={20} /></p>
							</div>
							<Button title={<TypewriterText text={t("common.message")} delay={480} step={22} />} extra="home_hero-btn hero_reveal" onClick={() => setIsContactOpen(true)} />
						</div>
					) : (
						<div className="service_hero-content">
							<h1 className="home_hero-title sub_hero-title typewriter_host"><TypewriterText text={content?.title ?? ""} step={58} /></h1>
							<div className="service_hero-bottom">
								<p className="home_hero-text opacity-80"><TypewriterText text={content ? t(content.textKey) : ""} delay={280} step={type === "google" ? 8 : 13} /></p>
								<Button title={<TypewriterText text={t("common.message")} delay={480} step={22} />} extra="home_hero-btn hero_reveal" onClick={() => setIsContactOpen(true)} />
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
			<ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
		</section>
	);
}
