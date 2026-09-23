"use client";

import { useEffect } from "react";

// Last resort: error.tsx sits inside the root layout, so it cannot catch a
// failure in the root layout itself. This file replaces the whole document when
// that happens, which is why it brings its own <html>/<body> and cannot reach
// for I18nContext, the fonts or globals.css — none of them are mounted.
export default function GlobalError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<html lang="en">
			<body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#090400", color: "#fff5ec", fontFamily: "Arial, Helvetica, sans-serif", textAlign: "center" }}>
				<main style={{ padding: "32px" }}>
					<h1 style={{ margin: "0 0 12px", fontSize: "28px", fontWeight: 400, textTransform: "uppercase", color: "#fa8a16" }}>Something went wrong</h1>
					<p style={{ margin: "0 0 28px", opacity: 0.8 }}>RA Agency is temporarily unavailable. Please try again in a moment.</p>
					{/* A plain <a>, not next/link: this screen is up because the tree
					    that owns the router failed to render, so a client-side
					    navigation is exactly what must not be attempted here. */}
					{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
					<a href="/" style={{ display: "inline-block", padding: "16px 32px", border: "1px solid #fa8a16", borderRadius: "6px 20px", color: "#fff5ec", textDecoration: "none", textTransform: "uppercase" }}>
						Reload the site
					</a>
				</main>
			</body>
		</html>
	);
}
