import Image from "next/image";
import Link from "next/link";

const navigation = [
	{
		href: '/cases',
		title: 'Cases'
	},
	{
		href: '/about-us',
		title: 'About Us'
	},
	{
		href: '/blog',
		title: 'Blog'
	},
	{
		href: '#contact',
		title: 'Contact'
	},
]

const services = [
	{
		href: '/telegram-ads',
		title: 'Telegram Ads'
	},
	{
		href: '/google-ads',
		title: 'Google Ads'
	},
	{
		href: '/meta-ads',
		title: 'Meta Ads'
	},
]

const legal = [
	{
		href: '/privacy-policy',
		title: 'Privacy Policy'
	},
	{
		href: '/terms-of-service',
		title: 'Terms of Service'
	},
	{
		href: '/cookie-policy',
		title: 'Cookie Policy'
	},
]

export default function Footer() {
	return (
		<footer className="footer pt-10">
			<div className="content_container footer_container">
				<h1 className="home_hero-title footer_title" data-title="RA AGENCY">
					RA AGENCY
				</h1>
				<div className="footer_layout">
					<div className="footer_intro">
						<p className="footer_text">Performance marketing partner for high-growth brands.We build and scale acquisition systems with predictable ROI across Telegram Ads, Meta, Google, and beyond.</p>
						<div className="burger_socials footer_socials" aria-label="Social links">
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
					<Image className="footer_logo-bg" src='/logo_footer.png' alt="footer_logo" width={450} height={396} />
					<div className="footer_nav">
						<div className="footer_nav-column">
							<h5 className="footer_nav-title">Navigation</h5>
							<ul className="footer_nav-list">
								{
									navigation.map((link) => {
										return <li className="footer_nav-item" key={link.title}>
											<Link href={link.href}>{link.title}</Link>
										</li>
									})
								}
							</ul>
						</div>
						<div className="footer_nav-column">
							<h5 className="footer_nav-title">Services</h5>
							<ul className="footer_nav-list">
								{
									services.map((link) => {
										return <li className="footer_nav-item" key={link.title}>
											<a href={link.href}>{link.title}</a>
										</li>
									})
								}
							</ul>
						</div>
						<div className="footer_nav-column">
							<h5 className="footer_nav-title">Legal</h5>
							<ul className="footer_nav-list">
								{
									legal.map((link) => {
										return <li className="footer_nav-item" key={link.title}>
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
