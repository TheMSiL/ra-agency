import { useEffect } from "react";

let lockCount = 0;
let previousBodyStyles: {
	overflow: string;
	width: string;
	paddingRight: string;
	position: string;
	top: string;
	left: string;
} | null = null;

let lockedScrollY = 0;

export function useBodyScrollLock(locked: boolean) {
	useEffect(() => {
		if (!locked) {
			return;
		}

		const body = document.body;

		if (lockCount === 0) {
			lockedScrollY = window.scrollY;
			previousBodyStyles = {
				overflow: body.style.overflow,
				width: body.style.width,
				paddingRight: body.style.paddingRight,
				position: body.style.position,
				top: body.style.top,
				left: body.style.left,
			};

			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

			body.classList.add("scroll_locked");
			body.style.overflow = "hidden";
			body.style.width = "100%";
			body.style.position = "fixed";
			body.style.top = `-${lockedScrollY}px`;
			body.style.left = "0";

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
			body.style.width = previousBodyStyles.width;
			body.style.paddingRight = previousBodyStyles.paddingRight;
			body.style.position = previousBodyStyles.position;
			body.style.top = previousBodyStyles.top;
			body.style.left = previousBodyStyles.left;
			previousBodyStyles = null;
			window.scrollTo(0, lockedScrollY);
		};
	}, [locked]);
}
