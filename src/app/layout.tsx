import type { Metadata, Viewport } from "next";
import { Mulish } from "next/font/google";
import localFont from "next/font/local";
import { I18nProvider } from "@/context/I18nContext";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";
import "./animations.css";
import "./responsive.css";
import { CANONICAL_ORIGIN } from "@/seo/metadata";
import AnalyticsBootstrap from "@/components/AnalyticsBootstrap";
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
      </head>
      <body>
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
