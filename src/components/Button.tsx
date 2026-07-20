import type { ReactNode } from "react";
import LocalizedLink from "./LocalizedLink";

export default function Button({
	title,
	extra,
	onClick,
	href,
}: {
	title: ReactNode;
	extra?: string;
	onClick?: () => void;
	href?: string;
}) {
	if (href) {
		return <LocalizedLink href={href} className={`btn ${extra ?? ""}`}>{title}</LocalizedLink>;
	}

	return (
		<button className={`btn ${extra ?? ""}`} onClick={onClick}>{title}</button>
	);
}
