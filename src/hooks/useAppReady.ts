"use client";

import { useSyncExternalStore } from "react";
import { isAppReady, subscribeToAppReady } from "@/lib/appReady";

const notReadyOnServer = () => false;

/**
 * `false` while the preloader still covers the page. Intro animations wait for
 * this so they measure a settled layout instead of half-loaded fonts and images.
 */
export function useAppReady() {
	return useSyncExternalStore(subscribeToAppReady, isAppReady, notReadyOnServer);
}
