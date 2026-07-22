"use client";

import { useI18n } from "@/context/I18nContext";

type BlogPostMetaProps = {
	date: string | null;
	readTime: number;
	views: number;
	className?: string;
};

export default function BlogPostMeta({ date, readTime, views, className = "" }: BlogPostMetaProps) {
	const { locale, t } = useI18n();
	const dateLocale = locale === "ua" ? "uk-UA" : locale === "ru" ? "ru-RU" : "en-GB";

	return (
		<div className={`blog_post-meta ${className}`.trim()}>
			<span>{readTime} {t("blog.minRead")}</span>
			<span>{views.toLocaleString(dateLocale)} {t("blog.views")}</span>
			{date && <time dateTime={date}>{new Intl.DateTimeFormat(dateLocale, { dateStyle: "medium" }).format(new Date(date))}</time>}
		</div>
	);
}
