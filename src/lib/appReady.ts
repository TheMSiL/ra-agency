export const APP_READY_EVENT = "ra:app-ready";

/** Set by the inline script in the root layout and cleared once the intro is over. */
const LOADING_ATTRIBUTE = "data-loading";
const READY_ATTRIBUTE = "data-app-ready";

export function isAppReady() {
	if (typeof document === "undefined") return false;
	return document.documentElement.hasAttribute(READY_ATTRIBUTE);
}

/** Reveals the page: hides the preloader through CSS and unblocks the intro animations. */
export function markAppReady() {
	if (typeof document === "undefined" || isAppReady()) return;
	document.documentElement.removeAttribute(LOADING_ATTRIBUTE);
	document.documentElement.setAttribute(READY_ATTRIBUTE, "1");
	window.dispatchEvent(new Event(APP_READY_EVENT));
}

/** Subscribes to the reveal, shaped for useSyncExternalStore. */
export function subscribeToAppReady(callback: () => void) {
	window.addEventListener(APP_READY_EVENT, callback);
	return () => window.removeEventListener(APP_READY_EVENT, callback);
}
