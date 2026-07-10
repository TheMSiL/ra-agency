import Image from 'next/image'

const icons = [
	'/trust/1.svg',
	'/trust/2.svg',
	'/trust/3.svg',
	'/trust/4.svg',
	'/trust/5.svg',
	'/trust/6.svg',
	'/trust/7.png',
	'/trust/8.svg',
	'/trust/9.svg',
	'/trust/10.svg',
]

const marqueeIcons = [...icons, ...icons]

export default function Trust() {
	return (
		<section className='trust pt-20 sm:pt-32'>
			<div className="content_container">
				<h2 className="text-center numbers_gradient-text numbers_title uppercase">We’re trusted by</h2>
			</div>
				<div className="trust_marquee" aria-label="Trusted company logos">
					<div className="trust_track">
						{marqueeIcons.map((icon, index) => (
							<div className="trust_logo" key={`${icon}-${index}`} aria-hidden={index >= icons.length}>
								<Image src={icon} alt="" width={128} height={128} />
							</div>
						))}
					</div>
				</div>
		</section>
	);
}
