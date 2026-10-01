// Third-party analytics IDs. Every one is optional: an empty value leaves that
// platform completely uninstalled — no bootstrap, no script request, no events.
//
// NEXT_PUBLIC_* values are baked in at `next build`, so a variable missing from
// the server's env silently drops that platform from production (this is how
// Clarity and the OpenAI pixel went missing). The IDs are public anyway — they
// ship in the page source — so the production ones are the fallback when the
// variable is unset. Set it to an empty string to switch a platform off.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-T15BGEFZXK";
export const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-M2CP52GS";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1707450710558708";
// OpenAI ads pixel ("oaiq"), used for conversion tracking on ChatGPT ads.
export const OPENAI_PIXEL_ID = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID ?? "28p9gw5EbU4CD1Ywr7rDAZ";
// Microsoft Clarity: heatmaps and session recordings.
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "yqej097ay3";
