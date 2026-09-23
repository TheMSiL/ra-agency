import { Suspense } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID, GTM_CONTAINER_ID, META_PIXEL_ID } from "@/analytics/ids";
import { analyticsBootstrapScript } from "@/analytics/bootstrap";
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
	const bootstrap = analyticsBootstrapScript();
	return (
		<>
			{/* The <head> copy of this runs before the first paint and makes the one
			    below a no-op. It is repeated here for the one case where the first
			    never runs — a notFound() route, whose document React renders on the
			    client, where a <script> React rendered is dead markup. Placed ahead
			    of the libraries below so the consent defaults still land first. */}
			{bootstrap && (
				<Script id="analytics-bootstrap-fallback" strategy="afterInteractive">
					{bootstrap}
				</Script>
			)}
			{GTM_CONTAINER_ID && (
				<Script id="gtm" strategy="afterInteractive">
					{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
				</Script>
			)}
			{GA_MEASUREMENT_ID && (
				<>
					<Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
					{/* Re-declares the queue stub instead of trusting the one in <head>.
					    Next renders the document on the client for a notFound() route,
					    and React never executes a <script> it renders that way — so on
					    every 404 the head bootstrap was inert and this line threw
					    "gtag is not defined". Re-running the two lines is a no-op when
					    the bootstrap did execute: same queue, same function body. */}
					<Script id="ga4-init" strategy="afterInteractive">
						{`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{send_page_view:false});`}
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
