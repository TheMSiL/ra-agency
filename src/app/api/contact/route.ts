import { sanityWriteClient } from "@/sanity/lib/writeClient";

const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

type CrmLead = {
	event_id: string;
	name: string;
	contact_method: "telegram" | "email";
	contact: string;
	details: string;
	source: string;
	submitted_at: string;
	attribution: unknown;
};

// Mirrors the lead into the client's CRM, which is what feeds their Telegram
// bot. Their endpoint dedupes on event_id, so a retry can only ever be a no-op
// on their side rather than a second lead. Never throws: a CRM outage must not
// cost us a submission that Sanity already stored.
async function forwardToCrm(lead: CrmLead) {
	const url = process.env.CRM_INTAKE_URL;
	const token = process.env.CRM_INTAKE_TOKEN;
	if (!url || !token) {
		console.warn("CRM forward skipped: CRM_INTAKE_URL or CRM_INTAKE_TOKEN is missing");
		return false;
	}
	for (let attempt = 1; attempt <= 2; attempt += 1) {
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json", "x-intake-token": token },
				body: JSON.stringify(lead),
				signal: AbortSignal.timeout(8000),
			});
			if (response.ok) return true;
			// A 4xx is about the payload itself, so a second identical attempt would
			// be rejected identically — only server-side failures are worth retrying.
			if (response.status < 500) {
				console.error(`CRM forward rejected (${response.status})`, await response.text());
				return false;
			}
			console.error(`CRM forward failed (${response.status}), attempt ${attempt}`);
		} catch (error) {
			console.error(`CRM forward errored, attempt ${attempt}`, error);
		}
	}
	return false;
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const name = String(body.name ?? "").trim().slice(0, 120);
		const contactMethod = body.contactMethod === "email" ? "email" : "telegram";
		const contact = String(body.contact ?? "").trim().slice(0, 250);
		const details = String(body.details ?? "").trim().slice(0, 4000);
		const isValidContact = contactMethod === "email"
			? contact.includes("@")
			: contact.startsWith("@");
		if (name.length < 2 || details.length < 10 || !isValidContact) {
			return Response.json({ error: "Please fill in all fields with valid information." }, { status: 400 });
		}
		const rawEventId = String(body.attribution?.event_id ?? "");
		const eventId = /^[a-zA-Z0-9_-]{8,80}$/.test(rawEventId) ? rawEventId : crypto.randomUUID();
		const source = String(body.source ?? "website").slice(0, 100);
		const submittedAt = new Date().toISOString();
		const attribution = body.attribution ?? {};

		await sanityWriteClient.createIfNotExists({
			_id: `lead-${eventId}`, _type: "lead", name, contactMethod, contact, details, source,
			attribution: JSON.stringify(attribution), submittedAt,
		});

		// Started here and awaited after the Telegram call so the two external
		// requests overlap instead of stacking their latency onto the visitor.
		const crmForward = forwardToCrm({
			event_id: eventId, name, contact_method: contactMethod, contact, details,
			source, submitted_at: submittedAt, attribution,
		});

		const token = process.env.TELEGRAM_BOT_TOKEN;
		const chatId = process.env.TELEGRAM_CHAT_ID;
		let telegramDelivered = false;
		if (token && chatId) {
			const message = `<b>New website lead</b>\n\n<b>Name:</b> ${escapeHtml(name)}\n<b>${contactMethod === "email" ? "Email" : "Telegram"}:</b> ${escapeHtml(contact)}\n<b>Details:</b> ${escapeHtml(details || "—")}`;
			const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
				method: "POST", headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
			});
			telegramDelivered = telegramResponse.ok;
			if (!telegramResponse.ok) console.error("Telegram notification failed", await telegramResponse.text());
		} else {
			console.warn("Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing");
		}
		const crmDelivered = await crmForward;
		return Response.json({ ok: true, telegramDelivered, crmDelivered });
	} catch (error) {
		console.error("Contact submission failed", error);
		return Response.json({ error: "Could not send the request. Please try again." }, { status: 500 });
	}
}
