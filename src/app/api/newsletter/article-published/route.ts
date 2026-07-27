import { resendRequest } from "@/lib/resend";
import { sanityWriteClient } from "@/sanity/lib/writeClient";
import { parseBody } from "next-sanity/webhook";
import { NextRequest, NextResponse } from "next/server";

type ArticlePayload = {
	_id: string;
	title: string;
	excerpt?: string;
	language?: "en" | "ru" | "ua";
	status?: "published" | "scheduled";
	publishedAt?: string;
	slug?: string;
};

const copy = {
	en: { subject: (title: string) => `New article: ${title}`, heading: "A new article is live", button: "Read the article", footer: "You received this email because you subscribed to RA Agency updates." },
	ru: { subject: (title: string) => `Новая статья: ${title}`, heading: "Вышла новая статья", button: "Читать статью", footer: "Вы получили это письмо, потому что подписались на обновления RA Agency." },
	ua: { subject: (title: string) => `Нова стаття: ${title}`, heading: "Вийшла нова стаття", button: "Читати статтю", footer: "Ви отримали цей лист, оскільки підписалися на оновлення RA Agency." },
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);

export async function POST(request: NextRequest) {
	const secret = process.env.SANITY_WEBHOOK_SECRET;
	if (!secret || !process.env.SANITY_API_WRITE_TOKEN) {
		return NextResponse.json({ error: "Newsletter webhook is not configured" }, { status: 503 });
	}

	const { body, isValidSignature } = await parseBody<ArticlePayload>(request, secret);
	if (!isValidSignature || !body?._id || !body.title || !body.slug) {
		return NextResponse.json({ error: "Invalid webhook" }, { status: 401 });
	}
	if (!["published", "scheduled"].includes(body.status ?? "")) return NextResponse.json({ skipped: true });

	const locale = body.language && body.language in copy ? body.language : "en";
	const deliveryId = `newsletterDelivery.${body._id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
	const existing = await sanityWriteClient.fetch<{ status?: string } | null>("*[_id == $id][0]{status}", { id: deliveryId });
	if (existing?.status === "sent" || existing?.status === "scheduled") return NextResponse.json({ duplicate: true });

	await sanityWriteClient.createIfNotExists({
		_id: deliveryId, _type: "newsletterDelivery", articleId: body._id,
		articleTitle: body.title, locale, status: "processing",
	});

	try {
		const segmentId = process.env[`RESEND_NEWSLETTER_SEGMENT_ID_${locale.toUpperCase()}`];
		const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://raagency.tech").replace(/\/$/, "");
		if (!segmentId) throw new Error(`Newsletter segment for ${locale} is not configured`);
		const articleUrl = `${siteUrl}/${locale}/blog/${body.slug}`;
		const text = copy[locale];
		const html = `<div style="background:#080301;color:#fff;padding:40px;font-family:Arial,sans-serif"><div style="max-width:640px;margin:auto"><p style="color:#fa8a16;text-transform:uppercase">${escapeHtml(text.heading)}</p><h1>${escapeHtml(body.title)}</h1>${body.excerpt ? `<p style="color:#ddd;line-height:1.6">${escapeHtml(body.excerpt)}</p>` : ""}<p><a href="${articleUrl}" style="display:inline-block;background:#fa8a16;color:#080301;padding:14px 22px;text-decoration:none;font-weight:bold">${escapeHtml(text.button)}</a></p><p style="margin-top:36px;color:#999;font-size:12px">${escapeHtml(text.footer)} <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#fa8a16">Unsubscribe</a></p></div></div>`;
		const broadcast = await resendRequest<{ id: string }>("/broadcasts", {
			method: "POST",
			body: JSON.stringify({
				segment_id: segmentId,
				from: process.env.RESEND_FROM_EMAIL ?? "RA Agency <newsletter@raagency.tech>",
				subject: text.subject(body.title),
				preview_text: body.excerpt ?? body.title,
				html,
			}),
		});
		const scheduledAt = body.publishedAt && new Date(body.publishedAt).getTime() > Date.now() ? body.publishedAt : undefined;
		await resendRequest(`/broadcasts/${broadcast.id}/send`, {
			method: "POST",
			body: JSON.stringify(scheduledAt ? { scheduled_at: scheduledAt } : {}),
		});
		await sanityWriteClient.patch(deliveryId).set({
			status: scheduledAt ? "scheduled" : "sent", broadcastId: broadcast.id,
			sentAt: scheduledAt ?? new Date().toISOString(),
		}).unset(["error"]).commit();
		return NextResponse.json({ ok: true, broadcastId: broadcast.id });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown newsletter error";
		await sanityWriteClient.patch(deliveryId).set({ status: "failed", error: message }).commit();
		return NextResponse.json({ error: message }, { status: 502 });
	}
}
