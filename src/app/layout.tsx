import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Mulish } from "next/font/google";
import localFont from "next/font/local";
import { I18nProvider } from "@/context/I18nContext";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";
import "./animations.css";
import "./responsive.css";
import { CANONICAL_ORIGIN } from "@/seo/metadata";
import AnalyticsBootstrap from "@/components/AnalyticsBootstrap";
import Analytics from "@/components/Analytics";
import { GTM_CONTAINER_ID, META_PIXEL_ID } from "@/analytics/ids";
import { analyticsBootstrapScript } from "@/analytics/bootstrap";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import PromoPopup from "@/components/PromoPopup";
import Preloader from "@/components/Preloader";

const mulish = Mulish({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-body",
});

// Angry.otf has no glyphs for $ + % × → € @ and friends, so those characters are
// always drawn by the next font in the stack. next/font's own synthetic fallback
// ("angry Fallback" = Arial at size-adjust: 153%) rendered them half again too
// large, which clipped the "$" in "$11M+" and the promo title. Falling back to
// Mulish keeps them at their natural size, the way they looked before the fonts
// moved into next/font.
const angry = localFont({
  src: "../../public/Angry.otf",
  display: "swap",
  variable: "--font-display",
  adjustFontFallback: false,
  fallback: ["Mulish", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
	metadataBase: new URL(CANONICAL_ORIGIN),
	title: { default: "RA Agency", template: "%s | RA Agency" },
	description: "Performance marketing agency for measurable and scalable growth.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsBootstrap = analyticsBootstrapScript();
  return (
    // The inline script below stamps `data-js` and `data-loading` on <html>
    // before hydration, so the client tree legitimately carries attributes the
    // server markup does not — hence suppressHydrationWarning.
    <html lang="en" className={`${mulish.variable} ${angry.variable}`} suppressHydrationWarning>
      <head>
        {/* Runs before the first paint. `data-js` lets the intro animations hide
            their elements only when scripting can actually reveal them again —
            without it a stalled bundle left the hero and its CTA blank.
            `data-loading` shows the preloader; the timeout is the failsafe that
            releases the page even if the React bundle never executes. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(e){e.dataset.js="1";e.dataset.loading="1";setTimeout(function(){if(e.hasAttribute("data-loading")){e.removeAttribute("data-loading");e.setAttribute("data-app-ready","1")}},6000)})(document.documentElement);history.scrollRestoration="manual";window.scrollTo(0,0);`,
          }}
        />
        {/* Consent Mode defaults plus the gtag()/fbq() queue stubs. Must stay
            ahead of every analytics library on the page — see the comment on
            analyticsBootstrapScript() for why. Renders nothing when no platform
            is configured. */}
        {analyticsBootstrap && <script dangerouslySetInnerHTML={{ __html: analyticsBootstrap }} />}
      </head>
      <body>
        {/* No-JS fallbacks, which the vendors require directly after <body>.
            Both fire without waiting for the cookie banner, since a visitor
            without scripting cannot answer it. */}
        {GTM_CONTAINER_ID && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
          </noscript>
        )}
        {META_PIXEL_ID && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} />
          </noscript>
        )}
        {/* Telegram Ads pixel. Unlike the attribution helpers in
            src/analytics/attribution.ts this one is deliberately not gated on
            the cookie banner — it loads for every visitor. */}
        <Script id="telegram-pixel" strategy="afterInteractive">
          {`(function(t,l,g,r,m){t[g]||(g=t[g]=function(){g.run?g.run.apply(g,arguments):g.queue.push(arguments)},g.queue=[],t=l.createElement(r),t.async=!0,t.src=m,l=l.getElementsByTagName(r)[0],l.parentNode.insertBefore(t,l))})(window,document,'tgp','script','https://telegram.org/js/pixel.js');tgp('init','TRVIyluI');`}
        </Script>
        <Analytics />
        <I18nProvider>
          <SiteSettingsProvider>
          <Preloader />
          <ScrollToTop />
          <AnalyticsBootstrap />
          {children}
          <PromoPopup />
          </SiteSettingsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
