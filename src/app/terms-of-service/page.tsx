import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Talk from "@/components/Talk";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata = buildPageMetadata("en", "terms", "/terms-of-service");

export default function TermsOfServicePage() {
	return (
		<div className="wrapper privacy_policy-page">
			<section className="privacy_policy">
				<Header />
				<main className="content_container privacy_policy-content">
					<h1 className="font-display numbers_gradient-text">Terms of Service</h1>

					<div className="privacy_policy-body">
						<div className="privacy_policy-intro">
							<p><strong>Effective Date: April 27, 2026</strong></p>
							<p><strong>These Terms of Service govern access to the RA Agency website and the use of our marketing, advertising, consulting and related services.</strong></p>
						</div>

						<section>
							<h2>1. Acceptance of Terms</h2>
							<p>By accessing our website, submitting a request, or using our services, you confirm that you have read, understood and agreed to these Terms of Service. If you do not agree with these terms, please do not use the website or our services.</p>
						</section>

						<section>
							<h2>2. Our Services</h2>
							<p>RA Agency provides performance marketing services, including campaign strategy, media buying, campaign management, analytics, creative consulting and optimization across advertising platforms. The exact scope, schedule and price of services are agreed separately with each client.</p>
						</section>

						<section>
							<h2>3. Client Responsibilities</h2>
							<p>Clients agree to:</p>
							<ul>
								<li>provide complete and accurate information required to perform the services</li>
								<li>provide timely access to advertising accounts, analytics and other necessary systems</li>
								<li>ensure that supplied materials, products and offers comply with applicable laws and platform policies</li>
								<li>review and approve materials within the agreed timeframes</li>
								<li>pay agreed fees and advertising budgets on time</li>
							</ul>
						</section>

						<section>
							<h2>4. Advertising Platforms</h2>
							<p>Third-party advertising platforms operate under their own rules and may reject advertisements, restrict accounts, change functionality, or modify their policies. RA Agency is not responsible for decisions, outages, or restrictions imposed by third-party platforms.</p>
						</section>

						<section>
							<h2>5. Results and Performance</h2>
							<p>We apply professional expertise and commercially reasonable efforts to improve campaign performance. Advertising results depend on many external factors, including the offer, market conditions, competition, budget, platform algorithms and client-side sales processes. Unless expressly agreed in writing, specific results are not guaranteed.</p>
						</section>

						<section>
							<h2>6. Fees and Payments</h2>
							<p>Service fees, payment dates, advertising budgets and applicable taxes are specified in the relevant proposal, invoice, or agreement. Late payment may result in the suspension of services until outstanding amounts are paid.</p>
						</section>

						<section>
							<h2>7. Intellectual Property</h2>
							<p>The website, branding, copy, design and materials created by RA Agency remain protected by intellectual property laws. Rights to client deliverables are determined by the applicable agreement. Clients retain ownership of materials they provide and confirm that they have the right to use them.</p>
						</section>

						<section>
							<h2>8. Confidentiality</h2>
							<p>Each party agrees to protect non-public business, technical, financial and campaign information received during cooperation and to use it only for the purposes of providing or receiving the services.</p>
						</section>

						<section>
							<h2>9. Limitation of Liability</h2>
							<p>To the extent permitted by law, RA Agency is not liable for indirect, incidental, or consequential losses, loss of profits, third-party platform actions, or interruptions beyond our reasonable control. Any direct liability is limited to the fees paid for the affected services.</p>
						</section>

						<section>
							<h2>10. Termination</h2>
							<p>Either party may terminate services in accordance with the applicable agreement. Upon termination, the client must pay for completed work and committed third-party costs. Provisions concerning payment, confidentiality, intellectual property and liability survive termination.</p>
						</section>

						<section>
							<h2>11. Changes to These Terms</h2>
							<p>RA Agency may update these Terms of Service when necessary. The current version and its effective date will always be published on this page.</p>
						</section>

						<section>
							<h2>12. Contact Information</h2>
							<p>If you have questions about these Terms of Service, contact us through the feedback form or the contact details provided on the RA Agency website.</p>
						</section>
					</div>
				</main>
				<Talk />
			</section>
			<Footer />
		</div>
	);
}
