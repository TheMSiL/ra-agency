"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, META_PIXEL_ID } from "@/analytics/ids";

// GA4 and the Meta pixel both count a pageview only on the initial document
// load, but App Router navigations swap the page without one, so every route
// after the first would go unrecorded. GTM is deliberately absent here — its
// container handles navigation through its own History Change trigger.
export default function RouteChangeTracker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Deferred by a tick so the App Router has finished swapping <title>;
		// reading it synchronously files the hit under the previous page's name.
		const timer = setTimeout(() => {
			if (GA_MEASUREMENT_ID) {
				window.gtag?.("event", "page_view", {
					page_location: window.location.href,
					page_title: document.title,
					page_referrer: document.referrer,
				});
			}
			if (META_PIXEL_ID) window.fbq?.("track", "PageView");
		}, 0);
		return () => clearTimeout(timer);
	}, [pathname, searchParams]);

	return null;
}
