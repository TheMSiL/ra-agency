import type { Metadata } from "next";
import { I18nProvider } from "@/context/I18nContext";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";
import "./animations.css";
import "./responsive.css";
import { CANONICAL_ORIGIN } from "@/seo/metadata";
import AnalyticsBootstrap from "@/components/AnalyticsBootstrap";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"; window.scrollTo(0, 0);`,
          }}
        />
      </head>
      <body>
        <I18nProvider>
          <ScrollToTop />
          <AnalyticsBootstrap />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
