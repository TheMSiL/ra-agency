export const ATTRIBUTION_CONSENT_KEY = "analytics_consent";
const ATTR_FIRST = "attr_first";
const ATTR_LAST = "attr_last";
const SESSION = "session";
const CLIENT_ID = "client_id";
const SOURCE_ARTICLE = "source_article";
const EVENT_QUEUE = "analytics_event_queue";
const SESSION_TTL = 30 * 60 * 1000;

const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "ttclid", "msclkid"] as const;
export type Attribution = Partial<Record<(typeof trackingKeys)[number], string>> & { landing_page: string; referrer: string; timestamp: string };
type SessionData = { id: string; expiresAt: number };
export type AttributionPayload = { attribution_first: Attribution | null; attribution_last: Attribution | null; client_id: string | null; session_id: string; event_id: string; fbp?: string; fbc?: string; source_article: { id: string; slug: string } | null };

const parse = <T,>(value: string | null): T | null => { try { return value ? JSON.parse(value) as T : null; } catch { return null; } };
const hasConsent = () => localStorage.getItem(ATTRIBUTION_CONSENT_KEY) === "granted";
const storage = () => hasConsent() ? localStorage : sessionStorage;
const cookieValue = (name: string) => document.cookie.split("; ").find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
const setCookie = (name: string, value: string, maxAge = 365 * 24 * 60 * 60) => {
	document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
};

function syncAttributionCookies() {
	for (const key of [ATTR_FIRST, ATTR_LAST, CLIENT_ID]) {
		const value = localStorage.getItem(key);
		if (value) setCookie(key, value);
	}
}

function currentAttribution(): Attribution {
	const params = new URLSearchParams(location.search);
	const result: Attribution = { landing_page: location.pathname, referrer: document.referrer, timestamp: new Date().toISOString() };
	for (const key of trackingKeys) {
		const value = params.get(key);
		if (value) result[key] = value;
	}
	return result;
}

const hasCampaign = (value: Attribution) => Boolean(value.utm_source || value.gclid || value.fbclid || value.ttclid || value.msclkid);

export function captureAttribution() {
	const target = storage();
	const current = currentAttribution();
	if (!target.getItem(ATTR_FIRST)) target.setItem(ATTR_FIRST, JSON.stringify(current));
	if (hasCampaign(current)) target.setItem(ATTR_LAST, JSON.stringify(current));
	else if (!target.getItem(ATTR_LAST)) target.setItem(ATTR_LAST, JSON.stringify(current));
	getSessionId();
	if (hasConsent()) syncAttributionCookies();
}

// Google reads Consent Mode; Meta has its own two-value API and replays the
// events it queued while revoked, so a visitor who accepts after browsing is
// not measured from scratch.
const updateTrackingConsent = (state: "granted" | "denied") => {
	window.gtag?.("consent", "update", { ad_storage: state, ad_user_data: state, ad_personalization: state, analytics_storage: state });
	window.fbq?.("consent", state === "granted" ? "grant" : "revoke");
};

export function grantAnalyticsConsent() {
	localStorage.setItem(ATTRIBUTION_CONSENT_KEY, "granted");
	updateTrackingConsent("granted");
	for (const key of [ATTR_FIRST, ATTR_LAST, SESSION, SOURCE_ARTICLE]) {
		const value = sessionStorage.getItem(key);
		if (value && !localStorage.getItem(key)) localStorage.setItem(key, value);
	}
	if (!localStorage.getItem(CLIENT_ID)) localStorage.setItem(CLIENT_ID, crypto.randomUUID());
	captureAttribution();
	flushQueuedEvents();
}

export function denyAnalyticsConsent() {
	localStorage.setItem(ATTRIBUTION_CONSENT_KEY, "denied");
	updateTrackingConsent("denied");
	for (const key of [ATTR_FIRST, ATTR_LAST, SESSION, CLIENT_ID, SOURCE_ARTICLE]) localStorage.removeItem(key);
	for (const key of [ATTR_FIRST, ATTR_LAST, CLIENT_ID]) setCookie(key, "", 0);
	sessionStorage.removeItem(EVENT_QUEUE);
}

export function getSessionId() {
	const target = storage();
	const now = Date.now();
	let session = parse<SessionData>(target.getItem(SESSION));
	if (!session || session.expiresAt <= now) session = { id: crypto.randomUUID(), expiresAt: now + SESSION_TTL };
	else session.expiresAt = now + SESSION_TTL;
	target.setItem(SESSION, JSON.stringify(session));
	return session.id;
}

export function setSourceArticle(article: { id: string; slug: string }) {
	storage().setItem(SOURCE_ARTICLE, JSON.stringify(article));
}

export function getAttributionPayload(): AttributionPayload {
	const target = storage();
	return {
		attribution_first: parse<Attribution>(target.getItem(ATTR_FIRST)),
		attribution_last: parse<Attribution>(target.getItem(ATTR_LAST)),
		client_id: hasConsent() ? localStorage.getItem(CLIENT_ID) : null,
		session_id: getSessionId(),
		event_id: crypto.randomUUID(),
		...(hasConsent() ? { fbp: cookieValue("_fbp"), fbc: cookieValue("_fbc") } : {}),
		source_article: parse(target.getItem(SOURCE_ARTICLE)),
	};
}

function enrich(event: string, parameters: Record<string, unknown>) {
	const payload = getAttributionPayload();
	return { event, ...parameters, utm_source_first: payload.attribution_first?.utm_source, utm_campaign_first: payload.attribution_first?.utm_campaign, client_id: payload.client_id };
}

// dataLayer/fbq set identifying cookies, so they only ever fire with consent.
function sendToAdPlatforms(event: string, enriched: Record<string, unknown>) {
	window.dataLayer = window.dataLayer ?? [];
	window.dataLayer.push(enriched);
	if (typeof window.fbq === "function") window.fbq("trackCustom", event, enriched);
}

export function trackAnalyticsEvent(event: string, parameters: Record<string, unknown> = {}) {
	const enriched = enrich(event, parameters);

	// GA4 runs under Consent Mode, so it is measured for every visitor — before
	// the banner is accepted the hit is cookieless rather than dropped, which
	// keeps site-level reporting whole. It is sent here and nowhere else: the
	// queue replayed on consent feeds only the ad platforms, so GA4 never
	// records the same interaction twice.
	window.gtag?.("event", event, enriched);

	if (!hasConsent()) {
		const queued = parse<Array<{ event: string; parameters: Record<string, unknown> }>>(sessionStorage.getItem(EVENT_QUEUE)) ?? [];
		queued.push({ event, parameters });
		sessionStorage.setItem(EVENT_QUEUE, JSON.stringify(queued.slice(-50)));
		return;
	}
	sendToAdPlatforms(event, enriched);
}

function flushQueuedEvents() {
	const queued = parse<Array<{ event: string; parameters: Record<string, unknown> }>>(sessionStorage.getItem(EVENT_QUEUE)) ?? [];
	sessionStorage.removeItem(EVENT_QUEUE);
	for (const item of queued) sendToAdPlatforms(item.event, enrich(item.event, item.parameters));
}

declare global { interface Window { dataLayer?: Array<Record<string, unknown>>; fbq?: (...args: unknown[]) => void; gtag?: (...args: unknown[]) => void } }
