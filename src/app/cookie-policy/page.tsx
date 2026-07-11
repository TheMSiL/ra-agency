import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Talk from "@/components/Talk";

export default function CookiePolicyPage() {
	return (
		<div className="wrapper privacy_policy-page">
			<section className="privacy_policy">
				<Header />
				<main className="content_container privacy_policy-content">
					<h1 className="font-display numbers_gradient-text">Cookie Policy</h1>

					<div className="privacy_policy-body">
						<div className="privacy_policy-intro">
							<p><strong>Effective Date: April 27, 2026</strong></p>
							<p><strong>This Cookie Policy explains how RA Agency uses cookies and similar technologies when you visit our website.</strong></p>
						</div>

						<section>
							<h2>1. What Are Cookies?</h2>
							<p>Cookies are small text files stored on your device when you visit a website. They help websites operate correctly, remember preferences, understand how visitors use pages, and improve the relevance of content and advertising.</p>
						</section>

						<section>
							<h2>2. How We Use Cookies</h2>
							<p>RA Agency may use cookies and similar technologies to:</p>
							<ul>
								<li>provide essential website functionality</li>
								<li>remember language and interface preferences</li>
								<li>measure website traffic and performance</li>
								<li>understand how visitors interact with our content</li>
								<li>improve our website and services</li>
								<li>measure and optimize marketing campaigns</li>
							</ul>
						</section>

						<section>
							<h2>3. Types of Cookies</h2>
							<p><strong>Essential cookies</strong> are required for basic website operation and cannot normally be disabled through our website.</p>
							<p><strong>Preference cookies</strong> remember choices such as language or display settings.</p>
							<p><strong>Analytics cookies</strong> help us understand visits, traffic sources, and website usage through aggregated statistics.</p>
							<p><strong>Marketing cookies</strong> may be used to measure advertising performance and provide more relevant communications.</p>
						</section>

						<section>
							<h2>4. Third-Party Technologies</h2>
							<p>We may use third-party analytics, advertising, and embedded-content providers, including services associated with Google, Meta, and other marketing platforms. These providers may set their own cookies and process data according to their privacy policies.</p>
						</section>

						<section>
							<h2>5. Cookie Duration</h2>
							<p>Session cookies are removed when you close your browser. Persistent cookies remain for a defined period or until you delete them. The duration depends on the purpose of the cookie and the provider that sets it.</p>
						</section>

						<section>
							<h2>6. Managing Cookies</h2>
							<p>You can manage or delete cookies through your browser settings. Most browsers allow you to block all or selected cookies and notify you when a cookie is being set. Disabling certain cookies may affect website functionality and your experience.</p>
						</section>

						<section>
							<h2>7. Your Privacy</h2>
							<p>Information collected through cookies may be treated as personal data when it can identify or be linked to an individual. For more information about how we handle personal data, please review our Privacy Policy.</p>
						</section>

						<section>
							<h2>8. Updates to This Policy</h2>
							<p>RA Agency may update this Cookie Policy to reflect changes in technology, law, or our practices. The latest version will always be available on this page.</p>
						</section>

						<section>
							<h2>9. Contact Information</h2>
							<p>If you have questions about our use of cookies, contact us through the feedback form or the contact details provided on the RA Agency website.</p>
						</section>
					</div>
				</main>
			</section>
			<Talk />
			<Footer />
		</div>
	);
}
