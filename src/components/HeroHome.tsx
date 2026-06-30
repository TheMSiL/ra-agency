import Image from "next/image";

import Header from "./Header";
import Button from "./Button";

export default function HeroHome() {
	return (
		<section id="home" className='relative pb-[90px]'>
			<Header />
			<div className="content_container">
				<h1 className="home_hero-title" data-title="RA AGENCY">
					RA AGENCY
				</h1>
				<Image src='/hero_img.png' alt="hero_img" width={1218} height={812} loading="eager" className="absolute top-[18%] left-1/2 -translate-x-1/2" />
				<div className='mt-[500px] mb-28 flex items-center justify-between gap-20 relative z-50'>
					<div>
						<h2 className="font-display text-5xl mb-4">Performance marketing</h2>
						<p className="text-2xl">We don’t buy clicks. We take minds.</p>
					</div>
					<Button title='Message us on Telegram' extra="py-10 px-20" />
				</div>
				<h2 className="font-display relative z-50 text-6xx">What we do</h2>
			</div>
		</section>
	);
}
