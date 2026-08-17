import { createHash } from "node:crypto";
import { ResendApiError, resendRequest } from "@/lib/resend";
import { sanityWriteClient } from "@/sanity/lib/writeClient";
import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const locales = new Set(["en", "ru", "ua"]);

export async function POST(request: Request) {
	if (!process.env.SANITY_API_WRITE_TOKEN) {
		return NextResponse.json({ error: "Newsletter is not configured" }, { status: 503 });
	}

	const body = await request.json().catch(() => null) as { email?: unknown; locale?: unknown; website?: unknown } | null;
	if (body?.website) return NextResponse.json({ ok: true });

	const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
	const locale = typeof body?.locale === "string" && locales.has(body.locale) ? body.locale : "en";
	if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
		return NextResponse.json({ error: "Invalid email" }, { status: 400 });
	}

	const id = `newsletterSubscriber.${createHash("sha256").update(email).digest("hex")}`;
	const now = new Date().toISOString();
	await sanityWriteClient.transaction()
		.createIfNotExists({ _id: id, _type: "newsletterSubscriber", email, locale, isActive: true, subscribedAt: now, syncStatus: "pending" })
		.patch(id, (patch) => patch.set({ locale, isActive: true, unsubscribedAt: null, syncStatus: "pending" }))
		.commit({ visibility: "sync" });

	try {
		const segmentId = process.env[`RESEND_NEWSLETTER_SEGMENT_ID_${locale.toUpperCase()}`];
		if (!segmentId) throw new Error(`Newsletter segment for ${locale} is not configured`);

		let contactId: string;
		try {
			const contact = await resendRequest<{ id: string }>(`/contacts/${encodeURIComponent(email)}`);
			contactId = contact.id;
			await resendRequest(`/contacts/${encodeURIComponent(email)}`, {
				method: "PATCH",
				body: JSON.stringify({ unsubscribed: false }),
			});
			await resendRequest(`/contacts/${encodeURIComponent(email)}/segments/${segmentId}`, { method: "POST" });
		} catch (error) {
			if (!(error instanceof ResendApiError) || error.status !== 404) throw error;

			const contact = await resendRequest<{ id: string }>("/contacts", {
				method: "POST",
				body: JSON.stringify({ email, unsubscribed: false, segments: [{ id: segmentId }] }),
			});
			contactId = contact.id;
		}

		await sanityWriteClient.patch(id).set({ syncStatus: "synced", resendContactId: contactId }).commit();
	} catch (error) {
		// The subscriber is already stored in Sanity at this point, so a Resend
		// outage (a suspended API key, a missing segment) must not read as a
		// failed signup to the visitor — that loses the address twice over, once
		// in Resend and again because they walk away. The document keeps
		// syncStatus "failed" so the contact can be pushed once Resend is back.
		await sanityWriteClient.patch(id).set({ syncStatus: "failed" }).commit();
		console.error("Newsletter contact sync failed", error);
		return NextResponse.json({ ok: true, synced: false });
	}

	return NextResponse.json({ ok: true, synced: true });
}
