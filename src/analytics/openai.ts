// Conversions for the OpenAI ads pixel (the `oaiq` global installed by
// analyticsBootstrapScript). Separate from trackAnalyticsEvent because these are
// not general analytics events: the ad account counts them as conversions, so
// they fire only where the conversion genuinely happened.
//
// The call shape is the one the pixel dashboard generates for a custom
// conversion — the third argument declares the type, the fourth carries the
// event name the conversion is matched on in the OpenAI ads UI.
export function trackOpenAiConversion(customEventName: string) {
	// The queue stub is defined in <head>, so this only misses when the pixel is
	// not configured for this environment at all.
	window.oaiq?.("measure", "custom", { type: "custom" }, { custom_event_name: customEventName });
}

declare global {
	interface Window {
		oaiq?: (...args: unknown[]) => void;
	}
}
