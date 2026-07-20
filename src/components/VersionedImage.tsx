import Image, { type ImageProps } from "next/image";

const assetVersion = process.env.NEXT_PUBLIC_ASSET_VERSION;

export default function VersionedImage({ src, ...props }: ImageProps) {
	const versionedSrc =
		typeof src === "string" && src.startsWith("/") && assetVersion
			? `${src}${src.includes("?") ? "&" : "?"}v=${encodeURIComponent(assetVersion)}`
			: src;

	return <Image {...props} src={versionedSrc} />;
}
