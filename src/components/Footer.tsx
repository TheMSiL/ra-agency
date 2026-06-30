import Image from "next/image";

const navigation = [
	{
		href: '#',
		title: 'Cases'
	},
	{
		href: '#',
		title: 'About Us'
	},
	{
		href: '#',
		title: 'Blog'
	},
	{
		href: '#',
		title: 'Contact'
	},
]

const services = [
	{
		href: '#',
		title: 'Telegram Ads'
	},
	{
		href: '#',
		title: 'Google Ads'
	},
	{
		href: '#',
		title: 'Meta Ads'
	},
]

const legal = [
	{
		href: '#',
		title: 'Privacy Policy'
	},
	{
		href: '#',
		title: 'Terms of Service'
	},
	{
		href: '#',
		title: 'Cookie Policy'
	},
]

export default function Footer() {
	return (
		<footer className="footer pb-20 overflow-hidden">
			<div className="content_container relative">
				<h1 className="home_hero-title" data-title="RA AGENCY">
					RA AGENCY
				</h1>
				<div className="flex items-start justify-between">
					<div>
						<p className="text-xl opacity-70 max-w-[620px] mb-8">Performance marketing partner for high-growth brands.We build and scale acquisition systems with predictable ROI across Telegram Ads, Meta, Google, and beyond.</p>
						<div className="burger_socials" aria-label="Social links">
							<a href="#" aria-label="Telegram">
								<Image src="/tg.svg" alt="" width={30} height={30} />
							</a>
							<a href="#" aria-label="LinkedIn">
								<Image src="/linkedin.svg" alt="" width={24} height={24} />
							</a>
							<a href="#" aria-label="X">
								<Image src="/x.svg" alt="" width={24} height={24} />
							</a>
						</div>
					</div>
					<Image className="absolute top-[200px] left-1/2 -translate-x-1/2" src='/logo_footer.png' alt="footer_logo" width={450} height={450} />
					<div className="flex items-start gap-20">
						<div>
							<h5 className="text-lg uppercase text-[#FA8A16] font-display">Navigation</h5>
							<ul className="grid gap-3 mt-3">
								{
									navigation.map((link) => {
										return <li className="text-lg font-light opacity-70 duration-300 hover:opacity-100" key={link.title}>
											<a href={link.href}>{link.title}</a>
										</li>
									})
								}
							</ul>
						</div>
						<div>
							<h5 className="text-lg uppercase text-[#FA8A16] font-display">Navigation</h5>
							<ul className="grid gap-3 mt-3">
								{
									services.map((link) => {
										return <li className="text-lg font-light opacity-70 duration-300 hover:opacity-100" key={link.title}>
											<a href={link.href}>{link.title}</a>
										</li>
									})
								}
							</ul>
						</div>
						<div>
							<h5 className="text-lg uppercase text-[#FA8A16] font-display">Navigation</h5>
							<ul className="grid gap-3 mt-3">
								{
									legal.map((link) => {
										return <li className="text-lg font-light opacity-70 duration-300 hover:opacity-100" key={link.title}>
											<a href={link.href}>{link.title}</a>
										</li>
									})
								}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}