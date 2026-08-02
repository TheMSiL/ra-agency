
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useI18n } from "@/context/I18nContext";
import type { Locale } from "@/i18n/config";
import { telegramAdsWhatWeDo } from "@/data/telegramAdsContent";
import { googleAdsWhatWeDo, metaAdsWhatWeDo } from "@/data/performanceAdsContent";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

type WhatWeDoItem = {
	index: string;
	title: string;
	description: string;
};

const items: WhatWeDoItem[] = [
	{
		index: "01",
		title: "Selection of options and appearance",
		description: "We analyze your product and market to find the most relevant channels and audiences",
	},
	{
		index: "02",
		title: "Google Ads strategy development",
		description: "We build a strategy by defining GEOs, offers, funnel structure, bidding models and scaling approach.",
	},
	{
		index: "03",
		title: "Creative and asset preparation",
		description: "We prepare search ads, display creatives, YouTube assets and Performance Max content for better results.",
	},
	{
		index: "04",
		title: "Search intent clustering",
		description: "We segment search demand, group high-intent queries and align campaign structure with how customers actually look for your offer.",
	},
	{
		index: "05",
		title: "Launch and signal collection",
		description: "We launch campaigns with clean tracking, gather the first conversion signals and isolate which audiences and messages deserve more budget.",
	},
	{
		index: "06",
		title: "Optimization and scaling",
		description: "We optimize bids, creatives and landing routes continuously so the account can scale without losing efficiency.",
	},
];

const itemTranslations: Record<Exclude<Locale, "en">, Array<Pick<WhatWeDoItem, "title" | "description">>> = {
	ru: [
		{ title: "Выбор каналов и подхода", description: "Анализируем продукт и рынок, чтобы найти наиболее релевантные каналы и аудитории." },
		{ title: "Разработка стратегии Google Ads", description: "Определяем GEO, офферы, структуру воронки, модели ставок и подход к масштабированию." },
		{ title: "Подготовка креативов и материалов", description: "Готовим поисковые объявления, баннеры, YouTube-материалы и контент Performance Max." },
		{ title: "Кластеризация поискового спроса", description: "Группируем запросы с высоким намерением и строим кампании под реальный путь поиска клиента." },
		{ title: "Запуск и сбор сигналов", description: "Запускаем чистый трекинг, собираем первые конверсии и определяем лучшие аудитории и сообщения." },
		{ title: "Оптимизация и масштабирование", description: "Постоянно улучшаем ставки, креативы и посадочные страницы без потери эффективности." },
	],
	ua: [
		{ title: "Вибір каналів і підходу", description: "Аналізуємо продукт і ринок, щоб знайти найрелевантніші канали та аудиторії." },
		{ title: "Розробка стратегії Google Ads", description: "Визначаємо GEO, офери, структуру воронки, моделі ставок і підхід до масштабування." },
		{ title: "Підготовка креативів і матеріалів", description: "Готуємо пошукові оголошення, банери, YouTube-матеріали та контент Performance Max." },
		{ title: "Кластеризація пошукового попиту", description: "Групуємо запити з високим наміром і будуємо кампанії під реальний шлях пошуку клієнта." },
		{ title: "Запуск і збір сигналів", description: "Запускаємо чистий трекінг, збираємо перші конверсії та визначаємо найкращі аудиторії й повідомлення." },
		{ title: "Оптимізація та масштабування", description: "Постійно покращуємо ставки, креативи й посадкові сторінки без втрати ефективності." },
	],
};

// 12 slots spread evenly around a full circle (2π / 12 = π/6 per step).
// Only slots near angle=0 (rightward) are visible — gives 2-3 visible rays at once.
const SLOT_STEP = (Math.PI * 2) / 12;

const SCENE_SLOTS = [
	{ angle: -Math.PI, opacity: 0, scale: 0.52, zIndex: 0 },
	{ angle: -Math.PI + SLOT_STEP, opacity: 0, scale: 0.52, zIndex: 0 },
	{ angle: -Math.PI + 2 * SLOT_STEP, opacity: 0, scale: 0.52, zIndex: 0 },
	{ angle: -Math.PI + 3 * SLOT_STEP, opacity: 0, scale: 0.52, zIndex: 0 }, // -1.571 (top)
	{ angle: -Math.PI + 4 * SLOT_STEP, opacity: 0, scale: 0.54, zIndex: 0 }, // -1.047
	{ angle: -Math.PI + 5 * SLOT_STEP, opacity: 0.68, scale: 0.78, zIndex: 3 }, // -0.524 (entering)
	{ angle: -Math.PI + 6 * SLOT_STEP, opacity: 1, scale: 1.0, zIndex: 4 }, //  0     (active)
	{ angle: -Math.PI + 7 * SLOT_STEP, opacity: 0.68, scale: 0.78, zIndex: 3 }, // +0.524 (exiting)
	{ angle: -Math.PI + 8 * SLOT_STEP, opacity: 0, scale: 0.54, zIndex: 0 }, // +1.047
	{ angle: -Math.PI + 9 * SLOT_STEP, opacity: 0, scale: 0.52, zIndex: 0 }, // +1.571 (bottom)
	{ angle: -Math.PI + 10 * SLOT_STEP, opacity: 0, scale: 0.52, zIndex: 0 },
	{ angle: -Math.PI + 11 * SLOT_STEP, opacity: 0, scale: 0.52, zIndex: 0 },
] as const;

const PIN_SCROLL_DISTANCE = 1800;
const START_PROGRESS = 8;

const getItemLeftFraction = (sceneWidth: number) => {
	if (sceneWidth < 640) {
		return 0.21;
	}

	if (sceneWidth < 901) {
		return 0.32;
	}

	return 0.37;
};

function lerp(from: number, to: number, progress: number) {
	return from + (to - from) * progress;
}

function normalizeAngleTransition(from: number, to: number) {
	if (to < from) {
		return to + Math.PI * 2;
	}

	return to;
}

function interpolateSlots<T extends Record<string, number>>(slots: readonly T[], position: number) {
	const wrapped = gsap.utils.wrap(0, slots.length, position);
	const startIndex = Math.floor(wrapped);
	const endIndex = (startIndex + 1) % slots.length;
	const progress = wrapped - startIndex;
	const start = slots[startIndex];
	const end = slots[endIndex];

	return Object.keys(start).reduce<Record<string, number>>((accumulator, key) => {
		const startValue = start[key];
		const endValue = key === "angle" ? normalizeAngleTransition(startValue, end[key]) : end[key];

		accumulator[key] = lerp(startValue, endValue, progress);
		return accumulator;
	}, {});
}

function getEndProgress(sceneWidth: number, sceneHeight: number, itemCount: number) {
	const wideProgress = gsap.utils.clamp(0, 1, (sceneWidth - 1200) / 1100);
	const tallProgress = gsap.utils.clamp(0, 1, (sceneHeight - 820) / 520);
	const adaptiveTrim = Math.max(wideProgress, tallProgress) * 0.46;

	return START_PROGRESS + itemCount - 1.54 - adaptiveTrim;
}

export default function WhatWeDo({ variant = "default" }: { variant?: "default" | "telegram" | "google" | "meta" }) {
	const { locale, t } = useI18n();
	const defaultLocalizedItems = locale === "en" ? items : items.map((item, index) => ({ ...item, ...itemTranslations[locale][index] }));
	const localizedItems = variant === "telegram" ? telegramAdsWhatWeDo[locale] : variant === "google" ? googleAdsWhatWeDo[locale] : variant === "meta" ? metaAdsWhatWeDo[locale] : defaultLocalizedItems;
	const itemCount = localizedItems.length;
	const orbitItems = Array.from({ length: SCENE_SLOTS.length }, (_, index) => ({
		...localizedItems[index % localizedItems.length],
		orbitKey: `${localizedItems[index % localizedItems.length].index}-${index}`,
	}));
	const rootRef = useRef<HTMLDivElement | null>(null);
	const sceneRef = useRef<HTMLDivElement | null>(null);
	const circleRef = useRef<SVGCircleElement | null>(null);
	const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
	const markerRefs = useRef<Array<HTMLSpanElement | null>>([]);
	const rayRefs = useRef<Array<HTMLSpanElement | null>>([]);

	useEffect(() => {
		const root = rootRef.current;
		const scene = sceneRef.current;
		const circle = circleRef.current;

		if (!root || !scene || !circle) {
			return;
		}

		const context = gsap.context(() => {
			const itemNodes = itemRefs.current;
			const markerNodes = markerRefs.current;
			const rayNodes = rayRefs.current;
			const media = gsap.matchMedia();
			const progress = { value: 0 };
			const circleMetrics = {
				centerX: 0,
				centerY: 0,
				radiusX: 0,
				radiusY: 0,
				itemXOffset: 0,
				endProgress: getEndProgress(scene.clientWidth, scene.clientHeight, itemCount),
			};

			const updateCircleMetrics = () => {
				const sceneBox = scene.getBoundingClientRect();
				const circleBox = circle.getBoundingClientRect();

				circleMetrics.centerX = circleBox.left - sceneBox.left + circleBox.width / 2;
				circleMetrics.centerY = circleBox.top - sceneBox.top + circleBox.height / 2;
				circleMetrics.radiusX = circleBox.width / 2;
				circleMetrics.radiusY = circleBox.height / 2;
				// Horizontal distance from circle center to where item column sits.
				circleMetrics.itemXOffset = sceneBox.width * getItemLeftFraction(sceneBox.width) - circleMetrics.centerX;
				circleMetrics.endProgress = getEndProgress(sceneBox.width, sceneBox.height, itemCount);
			};

			const applyFrame = () => {
				itemNodes.forEach((node, index) => {
					if (!node) {
						return;
					}

					// Item i sits BETWEEN ray i (upper boundary) and ray i+1 (lower boundary).
					// Compute each ray's Y at the item column X, then midpoint.
					const upperPos = gsap.utils.wrap(0, SCENE_SLOTS.length, index + 1 - progress.value);
					const lowerPos = gsap.utils.wrap(0, SCENE_SLOTS.length, index + 2 - progress.value);
					const upper = interpolateSlots(SCENE_SLOTS, upperPos);
					const lower = interpolateSlots(SCENE_SLOTS, lowerPos);

					const opacity = Math.max(upper.opacity, lower.opacity);

					if (opacity < 0.01) {
						gsap.set(node, { autoAlpha: 0 });
						return;
					}

					const { centerX, centerY, itemXOffset } = circleMetrics;
					const upperY = centerY + Math.tan(upper.angle) * itemXOffset;
					const lowerY = centerY + Math.tan(lower.angle) * itemXOffset;
					const isNarrowScene = scene.clientWidth < 640;
					const itemX = centerX + itemXOffset;

					const midAngle = (upper.angle + lower.angle) / 2;
					const rotation = (midAngle * 180) / Math.PI * 0.55;
					const orbitScale = lerp(upper.scale, lower.scale, 0.5);
					let scale = orbitScale;
					const desktopDrop = Math.min(88, Math.max(48, scene.clientHeight * 0.07));
					let itemY = (upperY + lowerY) / 2 + (isNarrowScene ? 0 : desktopDrop);

					if (isNarrowScene) {
						const rotationInRadians = Math.abs(rotation * Math.PI / 180);
						const projectedHeight =
							node.offsetHeight * Math.cos(rotationInRadians) +
							node.offsetWidth * Math.sin(rotationInRadians);
						const lineGap = 28;
						const topBoundary = Math.min(upperY, lowerY);
						const availableHeight = Math.abs(lowerY - upperY) - lineGap * 2;
						const fitScale = projectedHeight > 0 ? availableHeight / projectedHeight : 1;

						scale = Math.min(orbitScale, gsap.utils.clamp(0.62, 1, fitScale));
						itemY = topBoundary + lineGap + (projectedHeight * scale) / 2;
					}

					const isAboveMobileViewport = isNarrowScene && itemY < 80;

					gsap.set(node, {
						left: itemX,
						top: itemY,
						xPercent: 0,
						yPercent: -50,
						rotation,
						scale,
						autoAlpha: isAboveMobileViewport ? 0 : opacity,
						zIndex: Math.round(lerp(upper.zIndex, lower.zIndex, 0.5)),
					});
				});

				rayNodes.forEach((node, index) => {
					if (!node) {
						return;
					}

					const slotPosition = gsap.utils.wrap(0, SCENE_SLOTS.length, index + 1 - progress.value);
					const state = interpolateSlots(SCENE_SLOTS, slotPosition);
					const angleInDegrees = (state.angle * 180) / Math.PI;

					gsap.set(node, {
						left: circleMetrics.centerX,
						top: circleMetrics.centerY,
						rotation: angleInDegrees,
						autoAlpha: state.opacity,
					});
				});

				markerNodes.forEach((node, index) => {
					if (!node) {
						return;
					}

					const slotPosition = gsap.utils.wrap(0, SCENE_SLOTS.length, index + 1 - progress.value);
					const state = interpolateSlots(SCENE_SLOTS, slotPosition);
					const x = circleMetrics.centerX + Math.cos(state.angle) * circleMetrics.radiusX;
					const y = circleMetrics.centerY + Math.sin(state.angle) * circleMetrics.radiusY;

					gsap.set(node, {
						left: x,
						top: y,
						scale: state.scale,
						autoAlpha: state.opacity,
					});
				});
			};

			media.add(
				{
					allowMotion: "(prefers-reduced-motion: no-preference)",
				},
				(mediaContext) => {
					const { allowMotion } = mediaContext.conditions as {
						allowMotion: boolean;
					};

					updateCircleMetrics();
					progress.value = START_PROGRESS;
					applyFrame();

					if (
						!allowMotion ||
						itemNodes.some((node) => !node) ||
						markerNodes.some((node) => !node) ||
						rayNodes.some((node) => !node)
					) {
						return;
					}

					const hasMobilePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
					let viewportWidth = window.innerWidth;
					let resizeFrame = 0;

					const handleResize = () => {
						const nextViewportWidth = window.innerWidth;

						// Mobile Safari fires resize while its address bar opens and
						// closes. Refreshing a pinned ScrollTrigger at that moment
						// changes the spacer height and makes the page jump.
						if (hasMobilePointer && Math.abs(nextViewportWidth - viewportWidth) < 2) {
							return;
						}

						viewportWidth = nextViewportWidth;
						window.cancelAnimationFrame(resizeFrame);
						resizeFrame = window.requestAnimationFrame(() => {
							updateCircleMetrics();
							applyFrame();
							ScrollTrigger.refresh();
						});
					};

					window.addEventListener("resize", handleResize);

					const tween = gsap.to(progress, {
						value: () => circleMetrics.endProgress,
						ease: "none",
						onUpdate: applyFrame,
						scrollTrigger: {
							trigger: root,
							start: "top top",
							end: `+=${PIN_SCROLL_DISTANCE + Math.max(0, itemCount - 6) * 240}`,
							scrub: 1,
							pin: true,
							anticipatePin: 1,
							invalidateOnRefresh: true,
							onRefresh: () => {
								updateCircleMetrics();
								applyFrame();
							},
						},
					});

					return () => {
						window.removeEventListener("resize", handleResize);
						window.cancelAnimationFrame(resizeFrame);
						tween.kill();
					};
				},
			);

			return () => {
				media.revert();
			};
		}, root);

		return () => {
			context.revert();
		};
	}, [itemCount]);

	return (
		<div className="what_we_do section_background" ref={rootRef}>
			<div className="content_container">
				<h2 className="services_title numbers_gradient-text !text-start !capitalize">{t("hero.next")}</h2>
				<div className="what_we_do-scene" ref={sceneRef}>
					<div className="what_we_do-orbit" aria-hidden="true">
						<svg className="what_we_do-orbit-svg" viewBox="0 0 920 920" preserveAspectRatio="xMidYMid meet">
							<circle
								ref={circleRef}
								cx="460"
								cy="460"
								r="402"
								fill="none"
								stroke="rgba(250, 138, 22, 0.34)"
								strokeWidth="1.5"
							/>
						</svg>
						{orbitItems.map((item, index) => (
							<span
								key={`marker-${item.orbitKey}`}
								className="what_we_do-line-marker"
								ref={(node) => {
									markerRefs.current[index] = node;
								}}
							>
								<span className="what_we_do-line-marker-core"></span>
							</span>
						))}
					</div>
					<div className="what_we_do-rays" aria-hidden="true">
						{orbitItems.map((item, index) => (
							<span
								key={`ray-${item.orbitKey}`}
								className="what_we_do-ray"
								ref={(node) => {
									rayRefs.current[index] = node;
								}}
							/>
						))}
					</div>
					<div className="what_we_do-items">
						{orbitItems.map((item, index) => (
							<div
								key={item.orbitKey}
								className="what_we_do-item"
								ref={(node) => {
									itemRefs.current[index] = node;
								}}
							>
								<div className="what_we_do-item--num numbers_gradient-text">{item.index}</div>
								<div className="what_we_do-item_content">
									<h3 className="what_we_do-item--title">{item.title}</h3>
									<p className="what_we_do-item--desc">{item.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
