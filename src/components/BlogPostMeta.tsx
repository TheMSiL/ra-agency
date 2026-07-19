import type { BlogPost } from '@/data/blogs'

type BlogPostMetaProps = Pick<BlogPost, 'date' | 'readTime' | 'views'> & {
	className?: string
}

export default function BlogPostMeta({
	date,
	readTime,
	views,
	className = '',
}: BlogPostMetaProps) {
	return (
		<div className={`blog_post-meta ${className}`.trim()}>
			<span>{readTime} min read</span>
			<span>{views.toLocaleString('en-US')} views</span>
			<time>{date}</time>
		</div>
	)
}
