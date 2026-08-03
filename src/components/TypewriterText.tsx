"use client";

import { useEffect, useState } from "react";

import { useAppReady } from "@/hooks/useAppReady";

type TypewriterTextProps = {
	text: string;
	delay?: number;
	step?: number;
	className?: string;
};

export default function TypewriterText({
	text,
	delay = 0,
	step = 32,
	className = "",
}: TypewriterTextProps) {
	const characters = Array.from(text);
	const [visibleCount, setVisibleCount] = useState(0);
	const isAppReady = useAppReady();

	useEffect(() => {
		if (!isAppReady) return;

		let intervalId: ReturnType<typeof setInterval> | undefined;
		let revealId: number | undefined;
		const resetId = window.setTimeout(() => {
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				setVisibleCount(characters.length);
				return;
			}

			setVisibleCount(0);
			revealId = window.setTimeout(() => {
				setVisibleCount(1);
				intervalId = setInterval(() => {
					setVisibleCount((current) => {
						if (current >= characters.length) {
							if (intervalId) clearInterval(intervalId);
							return current;
						}
						return current + 1;
					});
				}, step);
			}, delay);
		}, 0);

		return () => {
			window.clearTimeout(resetId);
			if (revealId) window.clearTimeout(revealId);
			if (intervalId) clearInterval(intervalId);
		};
	}, [characters.length, delay, step, isAppReady]);

	return (
		<span className={`typewriter_text ${className}`.trim()} aria-label={text}>
			{characters.map((character, index) => (
				<span
					className={`typewriter_char${index < visibleCount ? " is-visible" : ""}`}
					aria-hidden="true"
					key={`${character}-${index}`}
				>
					{character}
				</span>
			))}
		</span>
	);
}
