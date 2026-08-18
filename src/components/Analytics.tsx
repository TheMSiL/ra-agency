import { Suspense } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID, GTM_CONTAINER_ID, META_PIXEL_ID } from "@/analytics/ids";
import RouteChangeTracker from "./RouteChangeTracker";

// Kept a server component on purpose: next/script only emits its tag into the
// server-rendered HTML from here. Inside a client component the same tags are
// injected after hydration instead, which delays every tag on the page.
//
// The libraries below all rely on the queue stubs and Consent Mode defaults that
// analyticsBootstrapScript() writes into <head>, so none may load earlier than
// afterInteractive.
export default function Analytics() {
	if (!GA_MEASUREMENT_ID && !GTM_CONTAINER_ID && !META_PIXEL_ID) return null;
	return (
		<>
			{GTM_CONTAINER_ID && (
				<Script id="gtm" strategy="afterInteractive">
					{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
				</Script>
			)}
			{GA_MEASUREMENT_ID && (
				<>
					<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
					<Script id="ga4-init" strategy="afterInteractive">
						{`gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{send_page_view:false});`}
					</Script>
				</>
			)}
			{/* useSearchParams opts its subtree into client rendering, so the tracker
			    sits behind Suspense to keep the rest of the page static. */}
			<Suspense fallback={null}>
				<RouteChangeTracker />
			</Suspense>
		</>
	);
}
