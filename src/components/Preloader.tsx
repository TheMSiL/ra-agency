"use client";

import { useEffect, useState } from "react";

import { markAppReady } from "@/lib/appReady";

/** Keeps the intro from flashing for a single frame on a warm cache. */
const MIN_VISIBLE_MS = 600;
/** Hard ceiling — a slow image must never hold the visitor on the splash. */
const MAX_VISIBLE_MS = 4000;
/** Must stay in sync with the .preloader transition in globals.css. */
const FADE_MS = 500;

const BACKGROUND_URL = /url\(["']?(.*?)["']?\)/;

/**
 * Resolves once the assets of the first screen are painted: web fonts, every
 * image that sits above the fold, and the hero background, which is a CSS
 * background and therefore invisible to the regular image loading events.
 */
function whenFirstScreenIsReady() {
	const jobs: Promise<unknown>[] = [document.fonts.ready];
	const fold = window.innerHeight * 1.15;

	document.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
		if (image.complete || image.getBoundingClientRect().top > fold) return;
		jobs.push(new Promise<void>((resolve) => {
			image.addEventListener("load", () => resolve(), { once: true });
			image.addEventListener("error", () => resolve(), { once: true });
		}));
	});

	const hero = document.querySelector(".home_hero, .about_hero");
	const heroBackground = hero ? window.getComputedStyle(hero).backgroundImage : "";
	const heroUrl = heroBackground.match(BACKGROUND_URL)?.[1];
	if (heroUrl) {
		const probe = new Image();
		probe.src = heroUrl;
		if (!probe.complete) jobs.push(probe.decode().catch(() => undefined));
	}

	return Promise.all(jobs);
}

export default function Preloader() {
	const [isMounted, setIsMounted] = useState(true);

	useEffect(() => {
		const timers: number[] = [];
		let revealed = false;

		const reveal = () => {
			if (revealed) return;
			revealed = true;
			timers.forEach((timer) => window.clearTimeout(timer));
			markAppReady();
			timers.push(window.setTimeout(() => setIsMounted(false), FADE_MS));
		};

		// performance.now() counts from navigation start, so a page that was
		// already fast keeps the splash for the remainder of MIN_VISIBLE_MS only.
		timers.push(window.setTimeout(reveal, Math.max(0, MAX_VISIBLE_MS - performance.now())));

		whenFirstScreenIsReady().then(() => {
			timers.push(window.setTimeout(reveal, Math.max(0, MIN_VISIBLE_MS - performance.now())));
		});

		return () => timers.forEach((timer) => window.clearTimeout(timer));
	}, []);

	if (!isMounted) return null;

	return (
		<div className="preloader" role="presentation" aria-hidden="true">
			<div className="preloader_inner">
				<svg className="preloader_logo" viewBox="0 0 48 34" width="96" height="68" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M19.7396 26.9052L13.7255 19.7129H17.8609C23.1581 19.7129 27.4523 15.3024 27.4523 9.86169C27.4523 4.41527 23.1535 0 17.8508 0H0C0 3.63196 2.86686 6.57648 6.40302 6.57648H17.9688C19.7347 6.57648 21.166 8.04655 21.166 9.86034C21.166 11.6741 19.7347 13.1442 17.9688 13.1442H0L15.9665 32.2456C17.9241 34.5875 21.4507 34.5956 23.4185 32.2625L41.2344 11.0694V27.5184C41.2344 31.0845 44.049 33.9754 47.521 33.9754L47.6141 3.96858C47.6252 0.395709 43.3008 -1.26074 41.0316 1.44711L19.7396 26.9052Z" fill="#FA8A16" />
				</svg>
				<div className="preloader_bar"><span /></div>
			</div>
		</div>
	);
}
