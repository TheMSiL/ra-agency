import Image from "next/image";

import Button from "./Button";
import Header from "./Header";

export default function SubHero() {
	return (
		<section id="tg_home" className="home_hero tg_hero">
			<Header />
			<div className="content_container home_hero-container">
				<h1 className="home_hero-title sub_hero-title" data-title="Telegram ads">
					Telegram ads
				</h1>
				<Image src='/tg_hero.png' alt="hero_img" width={1018} height={679} loading="eager" className="tg_hero-image" />
				<div className="home_hero-content">
					<p className="home_hero-text max-w-[650px] opacity-80">We launch, optimize, and scale official Telegram Ads with a laser focus on hard metrics. No vanity metrics — only verified signups, active deposits, and player purchases.</p>
					<Button title='Message us on Telegram' extra="home_hero-btn" />
				</div>
			</div>
		</section>
	);
}
