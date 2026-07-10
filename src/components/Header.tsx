import Image from "next/image";

import Burger from "./Burger";
import LangSwitcher from "./LangSwitcher";
import Link from "next/link";

export default function Header() {
	return (
		<header className="pt-10 header relative z-10">
			<div className="content_container flex items-center justify-between">
				<Link href='/'>
					<Image src='/logo.svg' alt="logo" width={50} height={35} loading="eager" />
				</Link>
				<div className="flex items-center gap-10">
					<LangSwitcher />
					<Burger />
				</div>
			</div>
		</header>
	);
}