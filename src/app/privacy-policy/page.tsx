import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Talk from "@/components/Talk";

export default function PrivacyPolicyPage() {
	return (
		<div className="wrapper privacy_policy-page">
			<section className="privacy_policy">
				<Header />
				<main className="content_container privacy_policy-content">
					<h1 className="font-display numbers_gradient-text">Privacy Policy</h1>

					<div className="privacy_policy-body">
						<div className="privacy_policy-intro">
							<p><strong>Effective Date: April 27, 2026</strong></p>
							<p><strong>RA Agency respects every user&apos;s right to privacy and is committed to protecting the personal data you provide when using our website and services.</strong></p>
						</div>

						<section>
							<h2>1. General Provisions</h2>
							<p>This Privacy Policy defines the procedure for collecting, using, storing, and protecting personal information of users of the RA Agency website. By using the website, you agree to the terms of this Privacy Policy.</p>
						</section>

						<section>
							<h2>2. What Data We Collect</h2>
							<p>We may collect the following information:</p>
							<ul>
								<li>first and last name</li>
								<li>phone number</li>
								<li>email address</li>
								<li>company name</li>
								<li>job title</li>
								<li>information about advertising requests and cooperation goals</li>
								<li>IP address</li>
								<li>browser and device data</li>
								<li>cookies and website behavior analytics data</li>
							</ul>
						</section>

						<section>
							<h2>3. Purpose of Data Collection</h2>
							<p>Collected data is used for:</p>
							<ul>
								<li>processing requests and feedback</li>
								<li>providing consultations and services</li>
								<li>preparing commercial proposals</li>
								<li>improving website performance</li>
								<li>analyzing user behavior</li>
								<li>marketing communications</li>
								<li>sending news, offers, and promotional materials (with user consent)</li>
							</ul>
						</section>

						<section>
							<h2>4. Sharing Data with Third Parties</h2>
							<p>We do not sell or transfer personal data to third parties, except in cases where:</p>
							<ul>
								<li>it is necessary for providing services</li>
								<li>it is required by law</li>
								<li>third-party analytics, advertising, and CRM services are used (for example Google Analytics, Meta Ads, CRM platforms)</li>
								<li>all partners are required to comply with data protection standards.</li>
							</ul>
						</section>

						<section>
							<h2>5. Cookies</h2>
							<p>Our website uses cookies to ensure proper website functionality, analytics, and personalization of the user experience. Users may disable cookies in their browser settings, however, this may affect the proper functioning of some website features.</p>
						</section>

						<section>
							<h2>6. Data Protection</h2>
							<p>We take the necessary organizational and technical measures to protect personal data from loss, unauthorized access, modification, or disclosure.</p>
						</section>

						<section>
							<h2>7. User Rights</h2>
							<p>Users have the right to:</p>
							<ul>
								<li>request information about their personal data</li>
								<li>request correction or deletion of data</li>
								<li>withdraw consent for data processing</li>
								<li>unsubscribe from marketing communications</li>
							</ul>
							<p>To do so, users should contact us using the contact details provided on the RA Agency website.</p>
						</section>

						<section>
							<h2>8. Policy Updates</h2>
							<p>RA Agency reserves the right to update this Privacy Policy. The current version is always published on the website.</p>
						</section>

						<section>
							<h2>9. Contact Information</h2>
							<p>If you have any questions regarding the processing of personal data, you may contact us through the feedback form on the website or using the contact details provided on the RA Agency website.</p>
						</section>
					</div>
				</main>
			</section>
				<Talk />
			<Footer />
		</div>
	);
}
