import Image from "next/image";

import Header from "./Header";
import Button from "./Button";

export default function HeroHome() {
	return (
		<section id="home" className="home_hero">
			<Header />
			<div className="content_container home_hero-container">
				<h1 className="home_hero-title" data-title="RA AGENCY">
					RA AGENCY
				</h1>
				<Image src='/hero_img.png' alt="hero_img" width={1218} height={812} loading="eager" className="home_hero-image" />
				<div className="home_hero-content">
					<div className="home_hero-copy">
						<h2 className="home_hero-heading">Performance marketing</h2>
						<p className="home_hero-text">We don’t buy clicks. We take minds.</p>
					</div>
					<Button title='Message us on Telegram' extra="home_hero-btn" />
				</div>
				<h2 className="home_hero-next">What we do</h2>
			</div>
		</section>
	);
}
