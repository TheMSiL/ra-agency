import { useEffect } from "react";

let lockCount = 0;
let scrollY = 0;
let previousBodyStyles: {
	overflow: string;
	position: string;
	top: string;
	width: string;
	paddingRight: string;
} | null = null;

export function useBodyScrollLock(locked: boolean) {
	useEffect(() => {
		if (!locked) {
			return;
		}

		const body = document.body;

		if (lockCount === 0) {
			scrollY = window.scrollY;
			previousBodyStyles = {
				overflow: body.style.overflow,
				position: body.style.position,
				top: body.style.top,
				width: body.style.width,
				paddingRight: body.style.paddingRight,
			};

			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

			body.classList.add("scroll_locked");
			body.style.overflow = "hidden";
			body.style.position = "fixed";
			body.style.top = `-${scrollY}px`;
			body.style.width = "100%";

			if (scrollbarWidth > 0) {
				body.style.paddingRight = `${scrollbarWidth}px`;
			}
		}

		lockCount += 1;

		return () => {
			lockCount = Math.max(0, lockCount - 1);

			if (lockCount > 0 || !previousBodyStyles) {
				return;
			}

			body.classList.remove("scroll_locked");
			body.style.overflow = previousBodyStyles.overflow;
			body.style.position = previousBodyStyles.position;
			body.style.top = previousBodyStyles.top;
			body.style.width = previousBodyStyles.width;
			body.style.paddingRight = previousBodyStyles.paddingRight;
			previousBodyStyles = null;

			window.scrollTo(0, scrollY);
		};
	}, [locked]);
}
