const RESEND_API = "https://api.resend.com";

export async function resendRequest<T>(path: string, init: RequestInit = {}) {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

	const response = await fetch(`${RESEND_API}${path}`, {
		...init,
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"User-Agent": "ra-agency-newsletter/1.0",
			...init.headers,
		},
	});
	const data = await response.json().catch(() => null);
	if (!response.ok) {
		const message = data && typeof data === "object" && "message" in data ? String(data.message) : `Resend request failed (${response.status})`;
		throw new Error(message);
	}
	return data as T;
}
