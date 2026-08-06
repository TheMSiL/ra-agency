import { sanityWriteClient } from "@/sanity/lib/writeClient";

const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

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

		await sanityWriteClient.createIfNotExists({
			_id: `lead-${eventId}`, _type: "lead", name, contactMethod, contact, details,
			source: String(body.source ?? "website").slice(0, 100),
			attribution: JSON.stringify(body.attribution ?? {}), submittedAt: new Date().toISOString(),
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
		return Response.json({ ok: true, telegramDelivered });
	} catch (error) {
		console.error("Contact submission failed", error);
		return Response.json({ error: "Could not send the request. Please try again." }, { status: 500 });
	}
}
