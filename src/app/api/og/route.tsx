import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// 1200x630 is the 1.91:1 box Facebook, LinkedIn and X all crop social cards to.
const SIZE = { width: 1200, height: 630 };
const BACKGROUND = "#090400";
const ACCENT = "#fa8a16";

// next/og ships Geist Regular as its default font and that face covers full
// Cyrillic including the Ukrainian і/ї/є/ґ and the ’ used in "Зв’язатися", so
// the ru/ua titles render without bundling a font of our own.
export function GET(request: NextRequest) {
	const raw = request.nextUrl.searchParams.get("title")?.trim();
	const title = (raw && raw.slice(0, 90)) || "RA Agency";
	// The longest localized titles ("Налаштування та ведення Google Ads") spill
	// onto a fourth line and collide with the footer unless they shrink first.
	const titleSize = title.length > 46 ? 58 : title.length > 28 ? 70 : 84;

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "72px 80px",
					backgroundColor: BACKGROUND,
					backgroundImage: `radial-gradient(900px 520px at 88% -12%, rgba(250, 138, 22, 0.28) 0%, rgba(250, 138, 22, 0) 62%)`,
					fontFamily: "Geist",
				}}
			>
				<div style={{ display: "flex", alignItems: "center" }}>
					<svg width="76" height="54" viewBox="0 0 48 34" fill="none">
						<path
							d="M19.7396 26.9052L13.7255 19.7129H17.8609C23.1581 19.7129 27.4523 15.3024 27.4523 9.86169C27.4523 4.41527 23.1535 0 17.8508 0H0C0 3.63196 2.86686 6.57648 6.40302 6.57648H17.9688C19.7347 6.57648 21.166 8.04655 21.166 9.86034C21.166 11.6741 19.7347 13.1442 17.9688 13.1442H0L15.9665 32.2456C17.9241 34.5875 21.4507 34.5956 23.4185 32.2625L41.2344 11.0694V27.5184C41.2344 31.0845 44.049 33.9754 47.521 33.9754L47.6141 3.96858C47.6252 0.395709 43.3008 -1.26074 41.0316 1.44711L19.7396 26.9052Z"
							fill={ACCENT}
						/>
					</svg>
					<span style={{ marginLeft: 24, fontSize: 30, letterSpacing: 6, color: "rgba(255, 255, 255, 0.72)" }}>RA AGENCY</span>
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<div style={{ width: 96, height: 6, backgroundColor: ACCENT, marginBottom: 36 }} />
					<div style={{ display: "flex", fontSize: titleSize, lineHeight: 1.12, color: "#ffffff" }}>{title}</div>
				</div>

				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26 }}>
					<span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Performance marketing</span>
					<span style={{ color: ACCENT }}>raagency.tech</span>
				</div>
			</div>
		),
		{
			...SIZE,
			headers: {
				// The image is a pure function of ?title, so scrapers and the CDN can
				// hold onto it indefinitely.
				"cache-control": "public, max-age=31536000, immutable, no-transform",
			},
		},
	);
}
