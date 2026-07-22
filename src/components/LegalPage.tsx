import Background from "./Background";
import Footer from "./Footer";
import Header from "./Header";

export type LegalContent = {
	title: string;
	intro: string;
	sections: Array<{ title: string; paragraphs: string[]; items?: string[] }>;
};

export default function LegalPage({ content }: { content: LegalContent }) {
	return (
		<div className="wrapper">
			<Background>
				<div className="blog_page-content">
					<Header />
					<main className="content_container privacy_policy-content blog_page-main">
						<h1 className="font-display numbers_gradient-text">{content.title}</h1>
						<div className="privacy_policy-body">
							<p><strong>{content.intro}</strong></p>
							{content.sections.map((section) => (
								<section key={section.title}>
									<h2>{section.title}</h2>
									{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
									{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
								</section>
							))}
						</div>
					</main>
				</div>
			</Background>
			<Footer />
		</div>
	);
}
