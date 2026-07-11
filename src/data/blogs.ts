export type BlogType = "Telegram Ads" | "Meta Ads" | "Google Ads";

export type BlogContentBlock =
	| { type: "heading"; text: string }
	| { type: "paragraph"; text: string }
	| { type: "list"; items: string[] };

export interface BlogPost {
	id: string;
	type: BlogType;
	date: string;
	title: string;
	description: string;
	image: string;
	content: BlogContentBlock[];
	recommendedIds: string[];
}

export const blogPosts: BlogPost[] = [
	{
		id: 'telegram-ads',
		type: 'Telegram Ads',
		date: '09.07.2026',
		title: 'How to start your channel and gain first subscribers?',
		description:
			'Three practical ways to attract your first subscribers and build a strong foundation for Telegram channel growth.',
		image: '/blog_hero.png',
		content: [
			{
				type: 'paragraph',
				text: 'Telegram has evolved from a simple messaging app into a powerful platform for content creation, community building, and digital marketing. With millions of active users, the platform offers an unparalleled opportunity to reach a global audience.',
			},
			{
				type: 'heading',
				text: 'Part 1. Foundations of channel administration',
			},
			{
				type: 'paragraph',
				text: 'Before inviting a single person to your channel, you must build a solid foundation. An organized channel looks trustworthy and gives potential subscribers a reason to stay.',
			},
			{
				type: 'heading',
				text: 'Your channel’s avatar and name are your first impression',
			},
			{
				type: 'list',
				items: [
					'Choose a clear, memorable name related to your niche.',
					'Use a recognizable avatar that remains legible at a small size.',
					'Write a concise description explaining what subscribers will receive.',
					'Prepare several useful posts before starting promotion.',
				],
			},
		],
		recommendedIds: ['meta-ads-launch', 'google-ads-launch'],
	},
	{
		id: 'meta-ads-launch',
		type: 'Meta Ads',
		date: '10.07.2026',
		title: 'Quick launch of advertising campaigns',
		description:
			'A practical framework for launching Meta campaigns quickly without sacrificing clean tracking and useful tests.',
		image: '/blog_meta.png',
		content: [
			{
				type: 'paragraph',
				text: 'A quick launch is effective only when the campaign starts with a clear goal, reliable tracking, and a focused set of creative hypotheses.',
			},
			{ type: 'heading', text: 'Prepare the campaign foundation' },
			{
				type: 'list',
				items: [
					'Define the primary conversion event.',
					'Verify Pixel and Conversion API tracking.',
					'Group audiences by intent.',
					'Prepare multiple creative angles before launch.',
				],
			},
			{ type: 'heading', text: 'Scale what the data confirms' },
			{
				type: 'paragraph',
				text: 'Give each test enough time to collect meaningful signals, then move budget toward combinations that deliver qualified conversions rather than vanity metrics.',
			},
		],
		recommendedIds: ['telegram-ads', 'google-ads-launch'],
	},
	{
		id: 'google-ads-launch',
		type: 'Google Ads',
		date: '10.07.2026',
		title: 'Quick launch of advertising campaigns',
		description:
			'How to capture high-intent search demand and launch Google Ads with a structure that is ready to optimize.',
		image: '/blog_google.png',
		content: [
			{
				type: 'paragraph',
				text: 'Google Ads can deliver demand immediately, but only when keywords, ads, landing pages, and conversion tracking are aligned around the same intent.',
			},
			{ type: 'heading', text: 'Build around search intent' },
			{
				type: 'list',
				items: [
					'Separate branded and non-branded demand.',
					'Cluster keywords by intent rather than volume alone.',
					'Match every ad group with a relevant landing page.',
					'Add negative keywords from the first day.',
				],
			},
			{ type: 'heading', text: 'Optimize for business outcomes' },
			{
				type: 'paragraph',
				text: 'Measure qualified leads and purchases, not clicks. Clean conversion data gives automated bidding the signals it needs to improve efficiently.',
			},
		],
		recommendedIds: ['telegram-ads', 'meta-ads-launch'],
	},
	{
		id: 'telegram-ads-optimization',
		type: 'Telegram Ads',
		date: '11.07.2026',
		title: 'How to optimize Telegram Ads after launch',
		description:
			'A practical guide to reading early campaign signals, improving targeting, and scaling Telegram Ads without wasting budget.',
		image: '/blog_tg.png',
		content: [
			{
				type: 'paragraph',
				text: 'Launching a Telegram Ads campaign is only the beginning. Sustainable results come from reviewing early signals, separating strong placements from weak ones, and improving the campaign step by step.',
			},
			{
				type: 'heading',
				text: 'Start with the metrics that matter',
			},
			{
				type: 'list',
				items: [
					'Track qualified subscribers rather than clicks alone.',
					'Compare channels by acquisition cost and downstream activity.',
					'Pause placements that spend without producing useful actions.',
					'Give promising audiences enough data before increasing budget.',
				],
			},
			{
				type: 'heading',
				text: 'Scale successful combinations carefully',
			},
			{
				type: 'paragraph',
				text: 'Increase budgets gradually and keep testing new messages alongside proven creatives. This preserves efficiency while giving the campaign room to grow.',
			},
		],
		recommendedIds: ['telegram-ads', 'meta-ads-launch'],
	},
	{
		id: 'meta-ads-launch1',
		type: 'Meta Ads',
		date: '10.07.2026',
		title: 'Quick launch of advertising campaigns',
		description:
			'A practical framework for launching Meta campaigns quickly without sacrificing clean tracking and useful tests.',
		image: '/blog_meta.png',
		content: [
			{
				type: 'paragraph',
				text: 'A quick launch is effective only when the campaign starts with a clear goal, reliable tracking, and a focused set of creative hypotheses.',
			},
			{ type: 'heading', text: 'Prepare the campaign foundation' },
			{
				type: 'list',
				items: [
					'Define the primary conversion event.',
					'Verify Pixel and Conversion API tracking.',
					'Group audiences by intent.',
					'Prepare multiple creative angles before launch.',
				],
			},
			{ type: 'heading', text: 'Scale what the data confirms' },
			{
				type: 'paragraph',
				text: 'Give each test enough time to collect meaningful signals, then move budget toward combinations that deliver qualified conversions rather than vanity metrics.',
			},
		],
		recommendedIds: ['telegram-ads', 'google-ads-launch'],
	},
	{
		id: 'google-ads-launch1',
		type: 'Google Ads',
		date: '10.07.2026',
		title: 'Quick launch of advertising campaigns',
		description:
			'How to capture high-intent search demand and launch Google Ads with a structure that is ready to optimize.',
		image: '/blog_google.png',
		content: [
			{
				type: 'paragraph',
				text: 'Google Ads can deliver demand immediately, but only when keywords, ads, landing pages, and conversion tracking are aligned around the same intent.',
			},
			{ type: 'heading', text: 'Build around search intent' },
			{
				type: 'list',
				items: [
					'Separate branded and non-branded demand.',
					'Cluster keywords by intent rather than volume alone.',
					'Match every ad group with a relevant landing page.',
					'Add negative keywords from the first day.',
				],
			},
			{ type: 'heading', text: 'Optimize for business outcomes' },
			{
				type: 'paragraph',
				text: 'Measure qualified leads and purchases, not clicks. Clean conversion data gives automated bidding the signals it needs to improve efficiently.',
			},
		],
		recommendedIds: ['telegram-ads', 'meta-ads-launch'],
	},
	{
		id: 'telegram-ads-optimization1',
		type: 'Telegram Ads',
		date: '11.07.2026',
		title: 'How to optimize Telegram Ads after launch',
		description:
			'A practical guide to reading early campaign signals, improving targeting, and scaling Telegram Ads without wasting budget.',
		image: '/blog_tg.png',
		content: [
			{
				type: 'paragraph',
				text: 'Launching a Telegram Ads campaign is only the beginning. Sustainable results come from reviewing early signals, separating strong placements from weak ones, and improving the campaign step by step.',
			},
			{
				type: 'heading',
				text: 'Start with the metrics that matter',
			},
			{
				type: 'list',
				items: [
					'Track qualified subscribers rather than clicks alone.',
					'Compare channels by acquisition cost and downstream activity.',
					'Pause placements that spend without producing useful actions.',
					'Give promising audiences enough data before increasing budget.',
				],
			},
			{
				type: 'heading',
				text: 'Scale successful combinations carefully',
			},
			{
				type: 'paragraph',
				text: 'Increase budgets gradually and keep testing new messages alongside proven creatives. This preserves efficiency while giving the campaign room to grow.',
			},
		],
		recommendedIds: ['telegram-ads', 'meta-ads-launch'],
	},
];

export function getBlogPost(id: string) {
	return blogPosts.find((post) => post.id === id);
}

export function getRecommendedPosts(post: BlogPost) {
	return post.recommendedIds.flatMap((id) => {
		const recommendedPost = getBlogPost(id);
		return recommendedPost ? [recommendedPost] : [];
	});
}
