"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import ContactModal from "@/components/ContactModal";

const radarItems = [
	{ src: '/radar/cpa.png', label: 'CPA', x: 52, y: 35 },
	{ src: '/radar/meta.png', label: 'Meta Ads', x: 68, y: 48 },
	{ src: '/radar/google.png', label: 'Google Ads', x: 74, y: 70 },
	{ src: '/radar/roas.png', label: 'ROAS', x: 57, y: 66 },
	{ src: '/radar/tg.png', label: 'Telegram Ads', x: 42, y: 48 },
	{ src: '/radar/cac.png', label: 'CAC', x: 25, y: 54 },
	{ src: '/radar/roi.png', label: 'ROI', x: 34, y: 76 },
];

export default function Talk() {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [loadedIconCount, setLoadedIconCount] = useState(0);
	const radarRef = useRef<HTMLDivElement>(null);
	const beamRef = useRef<SVGGElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const iconRefs = useRef<Array<HTMLImageElement | null>>([]);
	const loadedIconsRef = useRef(new Set<number>());

	const handleIconReady = (index: number) => {
		if (loadedIconsRef.current.has(index)) return;
		loadedIconsRef.current.add(index);
		setLoadedIconCount(loadedIconsRef.current.size);
	};

	useLayoutEffect(() => {
		const radar = radarRef.current;
		const beam = beamRef.current;
		const button = buttonRef.current;

		if (!radar || !beam || !button || loadedIconCount < radarItems.length) return;

		const context = gsap.context(() => {
			const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			const canFollowPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
			const scanner = { angle: -32 };
			const revealEase = gsap.parseEase('power2.out');
			const trailEase = gsap.parseEase('power2.inOut');
			let iconAngles: number[] = [];

			const measureIcons = () => {
				const radarBox = radar.getBoundingClientRect();
				const originX = radarBox.width * (968 / 1920);
				const originY = radarBox.height * (1050 / 1044);
				iconAngles = iconRefs.current.map((icon) => {
					if (!icon) return 0;
					const box = icon.getBoundingClientRect();
					const x = box.left - radarBox.left + box.width / 2 - originX;
					const y = originY - (box.top - radarBox.top + box.height / 2);
					return Math.atan2(x, y) * 180 / Math.PI;
				});
			};

			const updateScanner = () => {
				gsap.set(beam, { rotation: scanner.angle, svgOrigin: '968 1040' });
				iconRefs.current.forEach((icon, index) => {
					if (!icon) return;
					// The path's leading edge is 15deg ahead: reveal only after it crosses an icon.
					const passedAngle = gsap.utils.wrap(-180, 180, scanner.angle - iconAngles[index] - 15);
					let intensity = 0;
					if (passedAngle >= 0 && passedAngle < 20) {
						intensity = revealEase(passedAngle / 20);
					} else if (passedAngle >= 20 && passedAngle < 90) {
						intensity = 1 - trailEase((passedAngle - 20) / 70);
					}
					gsap.set(icon, {
						autoAlpha: intensity,
						scale: 0.86 + intensity * 0.14,
					});
				});
			};

			measureIcons();
			gsap.set(button, { xPercent: -50, yPercent: -50, x: radar.clientWidth * (968 / 1920), y: radar.clientHeight * 0.58 });

			if (reduceMotion) {
				gsap.set(iconRefs.current, { autoAlpha: 1, scale: 1 });
				gsap.set(beam, { autoAlpha: 0 });
				return;
			}

			const scannerTween = gsap.to(scanner, {
				angle: 328,
				duration: 3.8,
				repeat: -1,
				ease: 'none',
				onUpdate: updateScanner,
			});
			const moveX = gsap.quickTo(button, 'x', { duration: 0.62, ease: 'power3.out' });
			const moveY = gsap.quickTo(button, 'y', { duration: 0.62, ease: 'power3.out' });
			const constrainToRadar = (x: number, y: number) => {
				const centerX = radar.clientWidth * (968 / 1920);
				const centerY = radar.clientHeight * (1050 / 1044);
				const buttonRadius = button.offsetWidth / 2;
				const radarRadius = radar.clientWidth * (800 / 1920) - buttonRadius;
				const deltaX = x - centerX;
				const deltaY = y - centerY;
				const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

				if (distance <= radarRadius) return { x, y };
				return {
					x: centerX + deltaX / distance * radarRadius,
					y: centerY + deltaY / distance * radarRadius,
				};
			};

			const handlePointerMove = (event: PointerEvent) => {
				if (event.pointerType === 'touch') return;
				const box = radar.getBoundingClientRect();
				const position = constrainToRadar(event.clientX - box.left, event.clientY - box.top);
				moveX(position.x);
				moveY(position.y);
			};
			const handlePointerLeave = () => {
				moveX(radar.clientWidth * (968 / 1920));
				moveY(radar.clientHeight * 0.56);
			};
			const handleResize = () => {
				measureIcons();
				handlePointerLeave();
			};
			const handleVisibilityChange = () => {
				if (document.hidden) {
					scannerTween.pause();
				} else {
					handleResize();
					scannerTween.resume();
				}
			};
			const resizeObserver = new ResizeObserver(handleResize);

			if (canFollowPointer) {
				radar.addEventListener('pointermove', handlePointerMove);
				radar.addEventListener('pointerleave', handlePointerLeave);
			}
			window.addEventListener('resize', handleResize);
			window.visualViewport?.addEventListener('resize', handleResize);
			document.addEventListener('visibilitychange', handleVisibilityChange);
			resizeObserver.observe(radar);

			return () => {
				scannerTween.kill();
				if (canFollowPointer) {
					radar.removeEventListener('pointermove', handlePointerMove);
					radar.removeEventListener('pointerleave', handlePointerLeave);
				}
				window.removeEventListener('resize', handleResize);
				window.visualViewport?.removeEventListener('resize', handleResize);
				document.removeEventListener('visibilitychange', handleVisibilityChange);
				resizeObserver.disconnect();
			};
		}, radar);

		return () => context.revert();
	}, [loadedIconCount]);

	return (
		<section className="talk_section">
			<div className="content_container">
				<h2 className="numbers_title text-center numbers_gradient-text">Are you ready to talk?</h2>
				<div className="talk_radar" ref={radarRef}>
					<Image className="talk_radar-img" src='/radar/Radar.svg' alt="radar" width={1920} height={1044} />
					<svg className="talk_radar-beam-svg" viewBox="0 0 1920 1044" aria-hidden="true">
						<defs>
							<linearGradient id="animatedRadarBeam" x1="994.5" y1="676.5" x2="770.43" y2="879.056" gradientUnits="userSpaceOnUse">
								<stop stopColor="#FA8A16" stopOpacity="0.64" />
								<stop offset="1" stopColor="#4E2605" stopOpacity="0" />
							</linearGradient>
						</defs>
						<g ref={beamRef} className="talk_radar-beam">
							<path d="M773.886 331.556C592.802 380.077 436.456 494.656 335.651 652.72C234.847 810.783 196.893 1000.87 229.269 1185.52L968 1056L773.886 331.556Z" fill="url(#animatedRadarBeam)" />
						</g>
					</svg>
					{radarItems.map((item, index) => (
						<Image
							key={item.label}
							className={`talk_radar-icon talk_radar-icon--${item.label.toLowerCase().replaceAll(' ', '-')}`}
							src={item.src}
							alt={item.label}
							width={120}
							height={120}
							style={{ left: `${item.x}%`, top: `${item.y}%` }}
							ref={(node) => { iconRefs.current[index] = node; }}
							onLoad={() => handleIconReady(index)}
							onError={() => handleIconReady(index)}
						/>
					))}
					<button ref={buttonRef} className="talk_btn" type="button" onClick={() => setIsFormOpen(true)}>
						Message us on
						Telegram
					</button>
				</div>
			</div>

			<ContactModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
		</section>
	);
}
