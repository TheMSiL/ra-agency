import { createClient } from "next-sanity";
import { NextResponse, type NextRequest } from "next/server";
import { viewsProjection } from "@/sanity/lib/blog";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const writeClient = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
	apiVersion: "2026-07-22",
	useCdn: false,
	token: process.env.SANITY_API_WRITE_TOKEN,
});

const viewCookieName = (articleId: string) =>
	`blog_view_${articleId.replace(/^drafts\./, "").replace(/[^a-zA-Z0-9_-]/g, "_")}`;

export async function POST(request: NextRequest) {
	if (!process.env.SANITY_API_WRITE_TOKEN) {
		return NextResponse.json({ error: "View counter is not configured" }, { status: 503 });
	}

	const body = await request.json().catch(() => null) as { articleId?: unknown } | null;
	const articleId = typeof body?.articleId === "string" ? body.articleId.replace(/^drafts\./, "") : "";
	if (!articleId || articleId.length > 200) {
		return NextResponse.json({ error: "Invalid article" }, { status: 400 });
	}

	// `views` here is the translation-group total, matching what the article page
	// renders — the increment below still lands on this one document.
	const article = await writeClient.fetch<{ id: string; views: number } | null>(
		`*[_type == "article" && _id == $articleId && (
			(status == "published" && (!defined(publishedAt) || publishedAt <= now())) ||
			(status == "scheduled" && defined(publishedAt) && publishedAt <= now())
		)][0]{"id": _id, ${viewsProjection}}`,
		{ articleId },
	);
	if (!article) {
		return NextResponse.json({ error: "Article not found" }, { status: 404 });
	}

	const cookieName = viewCookieName(articleId);
	if (request.cookies.has(cookieName)) {
		return NextResponse.json({ views: article.views, counted: false });
	}

	await writeClient
		.patch(articleId)
		.setIfMissing({ views: 0 })
		.inc({ views: 1 })
		.commit({ visibility: "sync" });

	const response = NextResponse.json({ views: article.views + 1, counted: true });
	response.cookies.set(cookieName, "1", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: COOKIE_MAX_AGE,
	});
	return response;
}
