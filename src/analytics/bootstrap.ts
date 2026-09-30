import { ATTRIBUTION_CONSENT_KEY } from "./attribution";
import { CLARITY_PROJECT_ID, GA_MEASUREMENT_ID, GTM_CONTAINER_ID, META_PIXEL_ID, OPENAI_PIXEL_ID } from "./ids";

// The inline <head> script that has to run before anything else on the page.
//
// It exists for two reasons. First, Consent Mode has to be declared before any
// Google library initialises, or the library assumes full consent. Second,
// gtag() and fbq() are queue stubs: defining them here means an event fired
// during the very first render is buffered instead of dropped, which is what
// makes the initial pageview reliable.
//
// A visitor who accepted the banner earlier starts out granted, so their first
// hit is measured in full rather than arriving cookieless. Everyone else starts
// denied — Google still counts the visit without identifying storage, and Meta
// holds its events in the queue until the banner is accepted.
export function analyticsBootstrapScript() {
	if (!GA_MEASUREMENT_ID && !GTM_CONTAINER_ID && !META_PIXEL_ID && !OPENAI_PIXEL_ID && !CLARITY_PROJECT_ID) return "";

	const parts = [
		`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};var c="denied";try{if(localStorage.getItem("${ATTRIBUTION_CONSENT_KEY}")==="granted")c="granted"}catch(e){}`,
	];
	if (GA_MEASUREMENT_ID || GTM_CONTAINER_ID) {
		parts.push(`gtag("consent","default",{ad_storage:c,ad_user_data:c,ad_personalization:c,analytics_storage:c,functionality_storage:"granted",security_storage:"granted"});`);
	}
	if (META_PIXEL_ID) {
		// Meta's own base code, minus its `fbq('track','PageView')`: pageviews are
		// owned by RouteChangeTracker so that client-side navigations are counted
		// too, and firing here as well would double the initial one.
		parts.push(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");if(c!=="granted")fbq("consent","revoke");fbq("init","${META_PIXEL_ID}");`);
	}
	if (OPENAI_PIXEL_ID) {
		// OpenAI's own setup code, verbatim apart from the pixel id and the debug
		// flag it ships switched on. Like the Telegram pixel in app/layout.tsx it
		// is not gated on the cookie banner: oaiq exposes no consent API to revoke
		// and re-grant through, and a conversion the ad account never receives is
		// worse than useless to the campaign it is supposed to optimise. Reuses
		// the vendor loader rather than a hand-rolled stub so the queue drains the
		// way the SDK expects.
		parts.push(`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"${OPENAI_PIXEL_ID}"});`);
	}
	if (CLARITY_PROJECT_ID) {
		// Clarity's own snippet, verbatim apart from the project id. Consent is
		// passed through its v2 API: denied keeps recording but without cookies,
		// so a visitor who never answers the banner is still seen, just not linked
		// across sessions. updateTrackingConsent() flips it when the banner is used.
		parts.push(`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");clarity("consentv2",{ad_Storage:c,analytics_Storage:c});`);
	}
	// Emitted from two places and written to be safe when both fire. The <head>
	// copy in app/layout.tsx is the one that normally runs, before the first
	// paint; components/Analytics.tsx emits it a second time because React does
	// not execute a <script> it renders on the client, which is exactly what
	// happens to the <head> copy on a notFound() route — leaving those pages
	// with no Consent Mode defaults and no pixel queues at all.
	return `if(!window.__raAnalyticsBootstrapped){window.__raAnalyticsBootstrapped=1;${parts.join("")}}`;
}
