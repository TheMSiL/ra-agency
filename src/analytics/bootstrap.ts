import { ATTRIBUTION_CONSENT_KEY } from "./attribution";
import { GA_MEASUREMENT_ID, GTM_CONTAINER_ID, META_PIXEL_ID } from "./ids";

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
	if (!GA_MEASUREMENT_ID && !GTM_CONTAINER_ID && !META_PIXEL_ID) return "";

	const parts = [
		`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}var c="denied";try{if(localStorage.getItem("${ATTRIBUTION_CONSENT_KEY}")==="granted")c="granted"}catch(e){}`,
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
	return parts.join("");
}
