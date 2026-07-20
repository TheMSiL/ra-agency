"use client";

import { useEffect, useState } from "react";

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

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setVisibleCount(characters.length);
			return;
		}

		setVisibleCount(0);
		let intervalId: ReturnType<typeof setInterval> | undefined;
		const timeoutId = window.setTimeout(() => {
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

		return () => {
			window.clearTimeout(timeoutId);
			if (intervalId) clearInterval(intervalId);
		};
	}, [characters.length, delay, step]);

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
