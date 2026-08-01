import { sanityWriteClient } from "@/sanity/lib/writeClient";

const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const name = String(body.name ?? "").trim().slice(0, 120);
		const contactMethod = body.contactMethod === "email" ? "email" : "telegram";
		const contact = String(body.contact ?? "").trim().slice(0, 250);
		const details = String(body.details ?? "").trim().slice(0, 4000);
		if (!name || !contact) return Response.json({ error: "Please fill in your name and contact." }, { status: 400 });

		await sanityWriteClient.create({
			_type: "lead", name, contactMethod, contact, details,
			source: String(body.source ?? "website").slice(0, 100),
			attribution: JSON.stringify(body.attribution ?? {}), submittedAt: new Date().toISOString(),
		});

		const token = process.env.TELEGRAM_BOT_TOKEN;
		const chatId = process.env.TELEGRAM_CHAT_ID;
		if (token && chatId) {
			const message = `<b>New website lead</b>\n\n<b>Name:</b> ${escapeHtml(name)}\n<b>${contactMethod === "email" ? "Email" : "Telegram"}:</b> ${escapeHtml(contact)}\n<b>Details:</b> ${escapeHtml(details || "—")}`;
			const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
				method: "POST", headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
			});
			if (!telegramResponse.ok) console.error("Telegram notification failed", await telegramResponse.text());
		}
		return Response.json({ ok: true });
	} catch (error) {
		console.error("Contact submission failed", error);
		return Response.json({ error: "Could not send the request. Please try again." }, { status: 500 });
	}
}
