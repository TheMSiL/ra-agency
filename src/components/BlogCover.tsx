import Image from "next/image";
import type { SanityBlogImage } from "@/sanity/lib/blog";
import { croppedImageUrl } from "@/sanity/lib/image";

// The grid is 3 / 2 / 1 columns; without `sizes` Next would pin the srcset to
// 640px and upscale the card on wide screens.
const COVER_SIZES = "(max-width: 640px) 92vw, (max-width: 1280px) 48vw, 32vw";

// Cropped to the frame's own 16 / 9 by the CDN, so the card is filled by real
// artwork rather than by letterbox bands or a stretched copy. See
// croppedImageUrl for why the crop happens there and not in CSS.
const COVER_WIDTH = 1280;
const COVER_HEIGHT = 720;

export default function BlogCover({ image, className = "" }: { image: SanityBlogImage; className?: string }) {
	return (
		<div className={`blog_media ${className}`.trim()}>
			<Image
				className="blog_media-cover"
				src={croppedImageUrl(image, COVER_WIDTH, COVER_HEIGHT)}
				alt={image.alt}
				width={COVER_WIDTH}
				height={COVER_HEIGHT}
				sizes={COVER_SIZES}
				quality={90}
			/>
		</div>
	);
}
