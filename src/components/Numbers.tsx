const items = [
	{
		title: '$3.54',
		subtitle: 'Average cost per user',
		description: 'Competitive cost per user with the right funnel and strategy',
	},
	{
		title: '120M+',
		subtitle: 'Users from Telegram Ads',
		description: 'A steady stream of new users from Telegram Ads for active projects every month',
	},
	{
		title: '30+',
		subtitle: 'Active clients',
		description: 'Long-term partnerships with clients, not one- time campaigns',
	},
	{
		title: '8M+',
		subtitle: 'Managed advertising budget',
		description: 'We manage advertising budgets at scale while maintaining performance control',
	},
]

export default function Numbers() {
	const [featuredItem, ...statItems] = items;

	return (
		<section className="numbers">
			<div className="numbers_top">
				<div className="numbers_intro">
					<h2 className="numbers_title">
						Numbers We Stand
						<span className="numbers_gradient-text block w-fit">Behind</span>
					</h2>
					<p className="numbers_intro-text">
						Every number reflects campaigns that deliver real results.
					</p>
				</div>

				<article className="numbers_card numbers_card-featured">
					<h3 className="numbers_card-title numbers_gradient-text">{featuredItem.subtitle}</h3>
					<p className="numbers_card-text">{featuredItem.description}</p>
					<strong className="numbers_value numbers_gradient-text">
						{featuredItem.title}
					</strong>
				</article>
			</div>

			<div className="numbers_grid">
				{statItems.map((item) => (
					<article className="numbers_card" key={item.subtitle}>
						<h3 className="numbers_card-title">{item.subtitle}</h3>
						<p className="numbers_card-text">{item.description}</p>
						<strong className="numbers_value numbers_gradient-text">
							{item.title}
						</strong>
					</article>
				))}
			</div>
		</section>
	)
}
