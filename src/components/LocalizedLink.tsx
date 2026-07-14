"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { useI18n } from "@/context/I18nContext";

type Props = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export default function LocalizedLink({ href, ...props }: Props) {
	const { localizedPath } = useI18n();
	const localizedHref = typeof href === "string" && href.startsWith("/") ? localizedPath(href) : href;

	return <Link href={localizedHref} {...props} />;
}
