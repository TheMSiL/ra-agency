"use client";

import { useEffect, useState } from "react";
import { getAttributionPayload, type AttributionPayload } from "@/analytics/attribution";

export default function AttributionFields() {
	const [payload, setPayload] = useState<AttributionPayload | null>(null);

	useEffect(() => {
		queueMicrotask(() => setPayload(getAttributionPayload()));
	}, []);
	if (!payload) return null;

	return <>
		<input type="hidden" name="attribution" value={JSON.stringify(payload)} />
		<input type="hidden" name="event_id" value={payload.event_id} />
		<input type="hidden" name="client_id" value={payload.client_id ?? ""} />
		<input type="hidden" name="session_id" value={payload.session_id} />
		<input type="hidden" name="source_article" value={payload.source_article?.id ?? ""} />
	</>;
}
