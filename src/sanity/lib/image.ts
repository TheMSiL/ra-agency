import type { SanityBlogImage } from "./blog";

// Covers are uploaded anywhere between 1.4:1 and 2.3:1, so a card frame filled
// by CSS alone had to either letterbox them or zoom them blindly. Sanity's image
// CDN crops on request instead, so the card receives a file that already is the
// frame's ratio and can fill it edge to edge.
//
// `crop=focalpoint` follows the hotspot the editor sets in Studio — coverImage
// has always had `hotspot: true`, the site simply read the raw asset URL and
// ignored it. So when a crop cuts the wrong half of a banner, the fix is moving
// the hotspot in Studio rather than re-exporting the image. With no hotspot set
// the CDN falls back to the centre, which is what the old CSS did anyway.
export function croppedImageUrl(image: SanityBlogImage, width: number, height: number) {
	// Local/imported covers (/blog_hero.png) are not served by the CDN and have
	// no crop API; they render at their own ratio as before.
	if (!image.url.startsWith("https://cdn.sanity.io/")) return image.url;

	const params = new URLSearchParams({
		w: String(width),
		h: String(height),
		fit: "crop",
		crop: "focalpoint",
		"fp-x": String(image.hotspot?.x ?? 0.5),
		"fp-y": String(image.hotspot?.y ?? 0.5),
	});
	return `${image.url}?${params}`;
}
