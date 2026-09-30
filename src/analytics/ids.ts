// Third-party analytics IDs. Every one is optional: an empty value leaves that
// platform completely uninstalled — no bootstrap, no script request, no events.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
// OpenAI ads pixel ("oaiq"), used for conversion tracking on ChatGPT ads.
export const OPENAI_PIXEL_ID = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID;
// Microsoft Clarity: heatmaps and session recordings.
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
