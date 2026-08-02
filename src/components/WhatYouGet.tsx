"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/context/I18nContext";
import type { Locale } from "@/i18n/config";

gsap.registerPlugin(ScrollTrigger);

const items = [
	{
		kicker: "01",
		title: "Attracting the target audience",
		text: "We attract users who are genuinely interested in your product. By working with relevant channels and audience segments, we bring not just traffic, but potential customers.",
	},
	{
		kicker: "02",
		title: "Campaign structure and testing",
		text: "We build clear campaign logic, test creatives and audiences and keep the account structure ready for fast decisions without losing control of spend.",
	},
	{
		kicker: "03",
		title: "Scaling what already converts",
		text: "When the numbers prove the route, we scale budgets carefully, protect the strongest segments and keep optimization tied to real business outcomes.",
	},
];

const telegramItems: Record<Locale, typeof items> = {
	en: [
		{
			kicker: "01",
			title: "High-Quality Traffic from Telegram",
			text: "Reach highly engaged users who don't just install or sign up—they stay active, make purchases, complete deposits and generate long-term revenue.",
		},
		{
			kicker: "02",
			title: "End-to-End Analytics",
			text: "Get complete real-time visibility across your entire funnel—from the first impression to repeat purchases. Track every key metric including CPA, CAC, ROAS, LTV, retention, conversion rate, revenue and more.",
		},
		{
			kicker: "03",
			title: "Dedicated Performance Team",
			text: "Work with senior Telegram Ads specialists who manage your campaigns like an in-house growth team. We're available 24/7, proactively optimize every campaign and make data-driven decisions to maximize your results.",
		},
	],
	ru: [
		{
			kicker: "01",
			title: "Качественный трафик из Telegram",
			text: "Привлекайте вовлечённых пользователей, которые не просто устанавливают приложение или регистрируются, а остаются активными, совершают покупки, вносят депозиты и приносят долгосрочный доход.",
		},
		{
			kicker: "02",
			title: "Сквозная аналитика",
			text: "Получайте полную картину всей воронки в реальном времени — от первого показа до повторных покупок. Отслеживайте все ключевые показатели, включая CPA, CAC, ROAS, LTV, удержание, конверсию, выручку и другие метрики.",
		},
		{
			kicker: "03",
			title: "Выделенная performance-команда",
			text: "Работайте с опытными специалистами по Telegram Ads, которые управляют кампаниями как внутренняя growth-команда. Мы доступны 24/7, проактивно оптимизируем каждую кампанию и принимаем решения на основе данных, чтобы максимизировать результат.",
		},
	],
	ua: [
		{
			kicker: "01",
			title: "Якісний трафік із Telegram",
			text: "Залучайте активних користувачів, які не лише встановлюють застосунок або реєструються, а залишаються активними, здійснюють покупки, поповнюють депозити та генерують довгостроковий дохід.",
		},
		{
			kicker: "02",
			title: "Наскрізна аналітика",
			text: "Отримуйте повну картину всієї воронки в реальному часі — від першого показу до повторних покупок. Відстежуйте всі ключові показники, зокрема CPA, CAC, ROAS, LTV, утримання, конверсію, дохід та інші метрики.",
		},
		{
			kicker: "03",
			title: "Виділена performance-команда",
			text: "Працюйте з досвідченими фахівцями з Telegram Ads, які керують кампаніями як внутрішня growth-команда. Ми доступні 24/7, проактивно оптимізуємо кожну кампанію та ухвалюємо рішення на основі даних, щоб максимізувати результат.",
		},
	],
};

const googleItems: Record<Locale, typeof items> = {
	en: [
		{ kicker: "01", title: "Target clients from Google", text: "We reach customers who are actively searching for your products or services through Google Search, Shopping, YouTube and Performance Max. They don't just visit - they convert, purchase and generate measurable revenue" },
		{ kicker: "02", title: "End-to-end analytics", text: "We track the entire customer journey in real time - from the first search to repeat purchases, with complete visibility into CPA, CAC, ROAS, LTV, conversion rate, revenue and every key business metric" },
		{ kicker: "03", title: "Senior team of Google Ads", text: "You work with certified Google Ads specialists who continuously optimize your campaigns using real performance data. We manage your advertising better than in-house growth teams proactively improving results every day" },
	],
	ru: [
		{ kicker: "01", title: "Целевых пользователей из Google", text: "Мы охватываем клиентов, которые активно ищут ваши товары или услуги через Google Поиск, Shopping, YouTube и Performance Max. Они не просто заходят на сайт - они конвертируются, покупают и приносят измеримый доход" },
		{ kicker: "02", title: "Сквозную аналитику", text: "Отслеживаем весь путь клиента в реальном времени - от первого поиска до повторных покупок, с полной видимостью CPA, CAC, ROAS, LTV, конверсии, дохода и всех ключевых бизнес-показателей" },
		{ kicker: "03", title: "Команду профи по Google Ads", text: "Вы работаете с сертифицированными специалистами по Google Ads, которые непрерывно оптимизируют ваши кампании на основе реальных данных об эффективности. Мы управляем вашей рекламой лучше внутренних команд роста, проактивно улучшая результаты каждый день" },
	],
	ua: [
		{ kicker: "01", title: "Цільових користувачів із Google", text: "Ми охоплюємо клієнтів, які активно шукають ваші товари або послуги через Google Пошук, Shopping, YouTube та Performance Max. Вони не просто заходять на сайт - вони конвертуються, купують і приносять вимірюваний дохід" },
		{ kicker: "02", title: "Повну аналітику ефективності", text: "Ми відстежуємо весь шлях клієнта в реальному часі - від першого пошуку до повторних покупок, з повною видимістю CPA, CAC, ROAS, LTV, конверсії, доходу та всіх ключових бізнес-показників" },
		{ kicker: "03", title: "Команду профі Google Ads", text: "Ви працюєте із сертифікованими фахівцями з Google Ads, які безперервно оптимізують ваші кампанії на основі реальних даних про ефективність. Ми керуємо вашою рекламою краще за внутрішні команди росту, проактивно покращуючи результати щодня" },
	],
};

const metaItems: Record<Locale, typeof items> = {
	en: [
	{
		kicker: "01",
		title: "High-Quality Customers",
		text: "Reach people who are most likely to purchase, subscribe, or become long-term customers—not just generate clicks or traffic.",
	},
	{
		kicker: "02",
		title: "End-to-end analytics",
		text: "Track every stage of the customer journey in real time—from the first click to repeat purchases—with complete visibility into ROAS, CPA, CAC, LTV, revenue and every key business metric.",
	},
	{
		kicker: "03",
		title: "Senior Meta Ads Team",
		text: "Work with experienced Meta Ads specialists who continuously test, optimize and scale your campaigns. We act as an extension of your team and are always focused on maximizing your results.",
	},
	],
	ru: [
		{ kicker: "01", title: "Качественных клиентов", text: "Мы охватываем людей, которые с наибольшей вероятностью совершат покупку, оформят подписку или станут постоянными клиентами - а не просто кликнут по объявлению" },
		{ kicker: "02", title: "Сквозную аналитику", text: "Отслеживаем каждый этап пути клиента в реальном времени - от первого клика до повторных покупок - с полной видимостью ROAS, CPA, CAC, LTV, дохода и всех ключевых бизнес-показателей" },
		{ kicker: "03", title: "Опытную команду по Meta Ads", text: "Вы работаете с опытными специалистами по Meta Ads, которые непрерывно тестируют, оптимизируют и масштабируют ваши кампании. Мы работаем как часть вашей команды, всегда фокусируясь на максимизации результата" },
	],
	ua: [
		{ kicker: "01", title: "Якісних клієнтів", text: "Ми охоплюємо людей, які з найбільшою ймовірністю здійснять покупку, оформлять підписку або стануть постійними клієнтами - а не просто клікнуть по оголошенню" },
		{ kicker: "02", title: "Повну аналітику", text: "Відстежуємо кожен етап шляху клієнта в реальному часі - від першого кліку до повторних покупок - з повною видимістю ROAS, CPA, CAC, LTV, доходу та всіх ключових бізнес-показників" },
		{ kicker: "03", title: "Досвідчену команду з Meta Ads", text: "Ви працюєте з досвідченими фахівцями з Meta Ads, які безперервно тестують, оптимізують і масштабують ваші кампанії. Ми працюємо як частина вашої команди, завжди фокусуючись на максимізації результату" },
	],
};

const SWIPE_THRESHOLD_PX = 40;
const PIN_SCROLL_DISTANCE = 1500;
function AnimatedCount({ value }: { value: string }) {
	const [displayedValue, setDisplayedValue] = useState(value);
	const currentRef = useRef<HTMLSpanElement | null>(null);
	const nextRef = useRef<HTMLSpanElement | null>(null);

	useLayoutEffect(() => {
		if (value === displayedValue || !currentRef.current || !nextRef.current) return;

		const current = currentRef.current;
		const next = nextRef.current;
		const timeline = gsap.timeline({
			onComplete: () => {
				flushSync(() => setDisplayedValue(value));
				gsap.set(current, { yPercent: 0, autoAlpha: 1 });
				gsap.set(next, { yPercent: 100, autoAlpha: 0 });
			},
		});

		gsap.set(next, { yPercent: 100, autoAlpha: 1 });
		timeline
			.to(current, { yPercent: -100, duration: 0.42, ease: "power3.inOut" }, 0)
			.to(next, { yPercent: 0, duration: 0.42, ease: "power3.inOut" }, 0);

		return () => {
			timeline.kill();
		};
	}, [value, displayedValue]);

	return (
		<span className="what_count font-display" aria-live="polite">
			<span className="what_count-value" ref={currentRef}>{displayedValue}</span>
			<span className="what_count-value what_count-value-next" ref={nextRef} aria-hidden="true">{value}</span>
		</span>
	);
}

export default function WhatYouGet({ variant = "default" }: { variant?: "default" | "telegram" | "google" | "meta" }) {
	const { locale } = useI18n();
	const defaultLocalizedItems = locale === "ru" ? [
		{ kicker: "01", title: "Привлечение целевой аудитории", text: "Привлекаем пользователей, действительно заинтересованных в продукте, — не просто трафик, а потенциальных клиентов." },
		{ kicker: "02", title: "Структура кампаний и тестирование", text: "Выстраиваем понятную логику кампаний, тестируем креативы и аудитории, сохраняя контроль расходов." },
		{ kicker: "03", title: "Масштабирование рабочих связок", text: "Аккуратно увеличиваем бюджеты, защищаем сильные сегменты и связываем оптимизацию с бизнес-результатами." },
	] : locale === "ua" ? [
		{ kicker: "01", title: "Залучення цільової аудиторії", text: "Залучаємо користувачів, справді зацікавлених у продукті, — не просто трафік, а потенційних клієнтів." },
		{ kicker: "02", title: "Структура кампаній і тестування", text: "Вибудовуємо зрозумілу логіку кампаній, тестуємо креативи й аудиторії, зберігаючи контроль витрат." },
		{ kicker: "03", title: "Масштабування робочих зв’язок", text: "Обережно збільшуємо бюджети, захищаємо сильні сегменти та пов’язуємо оптимізацію з бізнес-результатами." },
	] : items;
	const localizedItems = variant === "telegram" ? telegramItems[locale] : variant === "google" ? googleItems[locale] : variant === "meta" ? metaItems[locale] : defaultLocalizedItems;
	const itemCount = localizedItems.length;
	const sectionTitle = locale === "ru" ? "Что вы получаете?" : locale === "ua" ? "Що ви отримуєте?" : "What you get?";
	const [activeIndex, setActiveIndex] = useState(0);
	const [lineStep, setLineStep] = useState(0);
	const sectionRef = useRef<HTMLElement | null>(null);
	const pinRef = useRef<HTMLDivElement | null>(null);
	const sliderRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<HTMLDivElement | null>(null);
	const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
	const activeIndexRef = useRef(0);
	const wheelLockedRef = useRef(false);

	useEffect(() => {
		if (!window.matchMedia("(min-width: 901px)").matches) return;

		const section = sectionRef.current;
		const pin = pinRef.current;
		const slider = sliderRef.current;
		const track = trackRef.current;
		if (!section || !pin || !slider || !track) return;

		const setStep = (nextIndex: number, animate = true) => {
			const boundedIndex = Math.min(itemCount - 1, Math.max(0, nextIndex));
			const distance = track.scrollWidth - slider.clientWidth;

			gsap.to(track, {
				x: -(distance * boundedIndex) / (itemCount - 1),
				duration: animate ? 0.42 : 0,
				ease: "power3.inOut",
				overwrite: true,
			});

			if (boundedIndex === activeIndexRef.current) return;
			activeIndexRef.current = boundedIndex;
			setActiveIndex(boundedIndex);
			setLineStep(boundedIndex);
		};

		const trigger = ScrollTrigger.create({
			trigger: section,
			start: "top top",
			end: `+=${PIN_SCROLL_DISTANCE}`,
			pin,
			anticipatePin: 1,
			invalidateOnRefresh: true,
			onUpdate: (self) => {
				if (!wheelLockedRef.current) setStep(Math.round(self.progress * (itemCount - 1)));
			},
			onRefresh: (self) => setStep(Math.round(self.progress * (itemCount - 1)), false),
		});

		const handleWheel = (event: WheelEvent) => {
			if (!trigger.isActive || Math.abs(event.deltaY) < 4) return;

			const direction = event.deltaY > 0 ? 1 : -1;
			const currentIndex = activeIndexRef.current;
			const atBoundary = direction > 0
				? currentIndex === itemCount - 1
				: currentIndex === 0;
			if (atBoundary) return;

			if (event.cancelable) event.preventDefault();
			if (wheelLockedRef.current) return;
			wheelLockedRef.current = true;

			const nextIndex = currentIndex + direction;
			setStep(nextIndex);
			window.scrollTo({
				top: trigger.start + (trigger.end - trigger.start) * (nextIndex / (itemCount - 1)),
				behavior: "auto",
			});

			window.setTimeout(() => {
				wheelLockedRef.current = false;
			}, 460);
		};

		window.addEventListener("wheel", handleWheel, { passive: false });
		scrollTriggerRef.current = trigger;

		return () => {
			window.removeEventListener("wheel", handleWheel);
			scrollTriggerRef.current = null;
			trigger.kill();
		};
	}, [itemCount]);

	const goTo = useCallback((nextIndex: number) => {
		const boundedIndex = Math.min(itemCount - 1, Math.max(0, nextIndex));

		if (boundedIndex === activeIndex) {
			return;
		}

		const track = trackRef.current;
		const slider = sliderRef.current;

		activeIndexRef.current = boundedIndex;
		setActiveIndex(boundedIndex);
		setLineStep(boundedIndex);

		if (track && slider) {
			gsap.to(track, {
				x: -((track.scrollWidth - slider.clientWidth) * boundedIndex) / (itemCount - 1),
				duration: 0.42,
				ease: "power3.inOut",
				overwrite: true,
			});
		}

		const trigger = scrollTriggerRef.current;
		if (trigger) {
			wheelLockedRef.current = true;
			window.scrollTo({
				top: trigger.start + (trigger.end - trigger.start) * (boundedIndex / (itemCount - 1)),
				behavior: "auto",
			});
			window.setTimeout(() => {
				wheelLockedRef.current = false;
			}, 460);
		}
	}, [activeIndex, itemCount]);

	useEffect(() => {
		if (!window.matchMedia("(max-width: 900px)").matches) return;

		const timer = window.setTimeout(() => {
			goTo((activeIndex + 1) % itemCount);
		}, 10_000);

		return () => window.clearTimeout(timer);
	}, [activeIndex, goTo, itemCount]);

	useEffect(() => {
		const slider = sliderRef.current;
		const section = sectionRef.current;
		const gestureArea = window.matchMedia("(max-width: 900px)").matches ? section : slider;
		if (!gestureArea) return;

		let startX = 0;
		let startY = 0;
		let deltaX = 0;
		let horizontalGesture = false;

		const handleTouchStart = (event: TouchEvent) => {
			const touch = event.touches[0];
			if (!touch) return;

			startX = touch.clientX;
			startY = touch.clientY;
			deltaX = 0;
			horizontalGesture = false;
		};

		const handleTouchMove = (event: TouchEvent) => {
			const touch = event.touches[0];
			if (!touch) return;

			deltaX = touch.clientX - startX;
			const deltaY = touch.clientY - startY;

			if (!horizontalGesture && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
				horizontalGesture = true;
			}

			if (horizontalGesture && event.cancelable) event.preventDefault();
		};

		const handleTouchEnd = () => {
			if (horizontalGesture && Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
				const direction = deltaX < 0 ? 1 : -1;
				goTo((activeIndex + direction + itemCount) % itemCount);
			}

			deltaX = 0;
			horizontalGesture = false;
		};

		gestureArea.addEventListener("touchstart", handleTouchStart, { passive: true });
		gestureArea.addEventListener("touchmove", handleTouchMove, { passive: false });
		gestureArea.addEventListener("touchend", handleTouchEnd, { passive: true });
		gestureArea.addEventListener("touchcancel", handleTouchEnd, { passive: true });

		return () => {
			gestureArea.removeEventListener("touchstart", handleTouchStart);
			gestureArea.removeEventListener("touchmove", handleTouchMove);
			gestureArea.removeEventListener("touchend", handleTouchEnd);
			gestureArea.removeEventListener("touchcancel", handleTouchEnd);
		};
	}, [activeIndex, goTo, itemCount]);

	const handlePaginationClick = (nextIndex: number) => {
		goTo(nextIndex);
	};

	return (
		<section className="what_you_get" ref={sectionRef}>
			<div className="what_pin section_background" ref={pinRef}>
				<div className="content_container what_container">
					<h2 className="services_title numbers_gradient-text !capitalize">{sectionTitle}</h2>

					<div className="what_slider" ref={sliderRef} style={{ "--active": activeIndex } as CSSProperties}>
						<div
							className="what_track"
							ref={trackRef}
						>
							{localizedItems.map((item, index) => (
								<article
									className={`what_panel ${index === activeIndex ? "active" : ""}`}
									key={item.kicker}
									aria-hidden={index !== activeIndex}
								>
									<h3 className="what_subtitle">{item.title}</h3>
									<p className="what_text">{item.text}</p>
								</article>
							))}
						</div>
					</div>
					<div className="what_line" aria-hidden="true">
						<div className="what_line-track" style={{ "--line-step": lineStep } as CSSProperties}>
							{Array.from({ length: 4 }, (_, patternIndex) => (
								<div className="what_line-pattern" key={patternIndex}>
									{Array.from({ length: 43 }, (_, lineIndex) => (
										<span className="what_line-bar" key={lineIndex} />
									))}
								</div>
							))}
						</div>
					</div>
					<div className="what_footer" aria-label="What you get progress">
						<AnimatedCount value={localizedItems[activeIndex].kicker} />
						<div className="what_dots">
							{localizedItems.map((item, index) => (
								<button
									className={`what_dot ${index === activeIndex ? "active" : ""}`}
									key={item.kicker}
									type="button"
									aria-label={`Show item ${item.kicker}`}
									aria-current={index === activeIndex}
									onClick={() => handlePaginationClick(index)}
								/>
							))}
						</div>
					</div>
				</div>
				<div className="what_bottom-fade" aria-hidden="true" />
			</div>
		</section>
	);
}
