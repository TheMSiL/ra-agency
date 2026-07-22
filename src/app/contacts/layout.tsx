import type { ReactNode } from "react";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata = buildPageMetadata("en", "contacts", "/contacts");

export default function ContactsLayout({ children }: { children: ReactNode }) {
	return children;
}
