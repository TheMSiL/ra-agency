import { htmlToPortableText, type DeserializerRule } from "@portabletext/html";
import { compileSchema, defineSchema } from "@portabletext/schema";

// Mirrors the article body in schemaTypes/article.ts. The converter drops any
// style, mark or block type the schema doesn't list, so the two must stay in
// step: a decorator added there and not here is silently lost on paste.
const articleBodySchema = compileSchema(
	defineSchema({
		styles: [{ name: "normal" }, { name: "h2" }, { name: "h3" }, { name: "blockquote" }],
		lists: [{ name: "bullet" }, { name: "number" }],
		decorators: [
			{ name: "strong" },
			{ name: "em" },
			{ name: "underline" },
			{ name: "strike-through" },
			{ name: "accent" },
			{ name: "highlight" },
		],
		annotations: [{ name: "link", fields: [{ name: "href", type: "string" }] }],
		blockObjects: [
			{ name: "image" },
			{ name: "table" },
			{ name: "callout" },
			{ name: "ctaButton" },
			{ name: "divider" },
			{ name: "embed" },
		],
	}),
);

const IGNORED_TAGS = new Set(["style", "script", "noscript", "template", "head", "meta", "link", "title"]);

const randomKey = () => Math.random().toString(36).slice(2, 14);

const isElement = (node: Node): node is HTMLElement => node.nodeType === 1;

const tag = (node: Node) => (isElement(node) ? node.tagName.toLowerCase() : "");

const cleanText = (value: string | null | undefined) => (value ?? "").replace(/\s+/g, " ").trim();

const textOf = (el: Element | null) => cleanText(el?.textContent);

/**
 * Turns article HTML into body blocks. Built for the agency's article template
 * (`.ra-banner-article`: `.orange`, `.highlight`, `.cta`, `.button` …), but
 * plain HTML — Google Docs, Word, a web page — goes through the same rules, so
 * tables and headings survive whatever the copy was written in.
 *
 * The template opens with an `.intro` paragraph and a `.top-line` rule. On the
 * site that pair is the article's lead, drawn from the "Lead / excerpt" field,
 * so it is returned separately instead of being repeated in the body.
 */
export function htmlToArticleBody(html: string) {
	let intro = "";

	const rules: DeserializerRule[] = [
		{
			deserialize(el, _next, createBlock) {
				if (!isElement(el)) return undefined;
				if (IGNORED_TAGS.has(tag(el))) return [];
				if (el.classList.contains("intro")) {
					intro = textOf(el);
					return [];
				}
				// The rule under the intro is part of the lead; anywhere else it
				// separates sections.
				if (el.classList.contains("top-line")) {
					return el.previousElementSibling?.classList.contains("intro") ? [] : createBlock({ _type: "divider", style: "line" });
				}
				return undefined;
			},
		},
		{
			deserialize(el, next) {
				const name = tag(el);
				// The body has no H1 (the article title is the page's H1) and stops at
				// H3, so other levels fold into the nearest one instead of turning into
				// plain paragraphs.
				const style = name === "h1" ? "h2" : /^h[4-6]$/.test(name) ? "h3" : null;
				if (!style) return undefined;
				const heading = { _type: "block", style, markDefs: [], children: next(el.childNodes) };
				return heading;
			},
		},
		{
			deserialize(el, next) {
				if (!isElement(el)) return undefined;
				const isAccent = el.classList.contains("orange") || el.classList.contains("accent");
				const isHighlight = el.classList.contains("highlight") || tag(el) === "mark";
				if (!isAccent && !isHighlight) return undefined;
				// `__decorator` is the converter's placeholder for "apply this mark to
				// everything inside", the same shape its <strong> rule returns.
				const decorator = { _type: "__decorator", name: isHighlight ? "highlight" : "accent", children: next(el.childNodes) };
				return decorator;
			},
		},
		{
			deserialize(el, _next, createBlock) {
				if (!isElement(el) || !el.classList.contains("cta")) return undefined;
				const title = textOf(el.querySelector(".cta-title"));
				const text = textOf(el.querySelector(".cta-text"));
				const signature = textOf(el.querySelector(".cta-brand"));
				return createBlock({
					_type: "callout",
					tone: "accent",
					...(title && { title }),
					text: text || textOf(el),
					...(signature && { signature }),
				});
			},
		},
		{
			deserialize(el, _next, createBlock) {
				if (!isElement(el) || tag(el) !== "a" || !el.classList.contains("button")) return undefined;
				const label = el.cloneNode(true) as HTMLElement;
				const noteElement = label.querySelector(".button-strong");
				const note = textOf(noteElement);
				noteElement?.remove();
				return createBlock({
					_type: "ctaButton",
					label: textOf(label),
					url: el.getAttribute("href") ?? "",
					...(note && { note }),
				});
			},
		},
		{
			deserialize(el, _next, createBlock) {
				if (tag(el) === "hr") return createBlock({ _type: "divider", style: "line" });
				if (tag(el) !== "table" || !isElement(el)) return undefined;
				const rows = Array.from(el.querySelectorAll("tr"))
					.map((row) => Array.from(row.querySelectorAll("th, td")).map((cell) => textOf(cell)))
					.filter((cells) => cells.some(Boolean));
				if (rows.length === 0) return [];
				const columns = Math.max(...rows.map((cells) => cells.length));
				const caption = textOf(el.querySelector("caption"));
				return createBlock({
					_type: "table",
					headerRow: true,
					...(caption && { caption }),
					rows: rows.map((cells) => ({
						_type: "tableRow",
						_key: randomKey(),
						cells: [...cells, ...Array<string>(columns - cells.length).fill("")],
					})),
				});
			},
		},
	];

	const blocks = htmlToPortableText(html, {
		schema: articleBodySchema,
		rules,
		whitespaceMode: "normalize",
		// Pasted <img> tags point at someone else's server; Sanity images have to
		// be uploaded, so they are skipped and added through the Image block.
		types: { image: () => undefined },
	});

	// The indentation between tags in hand-written HTML comes through as
	// paragraphs holding nothing but whitespace; spacing is the stylesheet's job.
	return { blocks: blocks.filter((block) => !isBlankParagraph(block)), intro };
}

function isBlankParagraph(block: { _type: string; children?: unknown }) {
	return (
		block._type === "block" &&
		Array.isArray(block.children) &&
		block.children.every((child: { _type?: string; text?: string }) => child._type === "span" && !child.text?.trim())
	);
}

/**
 * Whether pasted content should go through `htmlToArticleBody` rather than the
 * Studio's own paste. Its own handles Google Docs and Word prose well, so it
 * keeps that; the converter takes the HTML source of an article (copied from
 * a code editor, so it arrives as plain text), the rendered template, and
 * anything with a table, which the default paste flattens into paragraphs.
 */
export function pastedArticleHtml(clipboard: DataTransfer) {
	const text = clipboard.getData("text/plain").trim();
	if (/^<(?:!doctype|html|section|article|div|p|h[1-6]|ul|ol|table|style)\b/i.test(text) && /<\/[a-z0-9]+>/i.test(text)) return text;

	const html = clipboard.getData("text/html");
	if (!html) return null;
	if (/class="[^"]*\b(?:ra-banner-article|orange|highlight|arrow-list|numbered-list|cta|button)\b/.test(html)) return html;
	if (/<table\b/i.test(html)) return html;
	return null;
}
