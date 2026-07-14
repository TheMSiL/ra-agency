import Image from "next/image";

import Burger from "./Burger";
import LangSwitcher from "./LangSwitcher";
import LocalizedLink from "./LocalizedLink";

export default function Header() {
	return (
		<header className="pt-5 header relative z-10">
			<div className="content_container flex items-center justify-between">
				<LocalizedLink href='/'>
					<Image src='/logo.svg' alt="logo" width={50} height={35} loading="eager" />
				</LocalizedLink>
				<div className="flex items-center gap-10">
					<div className="header_lang_switcher">
						<LangSwitcher />
					</div>
					<Burger />
				</div>
			</div>
		</header>
	);
}
