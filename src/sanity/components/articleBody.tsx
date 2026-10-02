import { Box, Button, Card, Flex, Stack, Text, TextInput, useToast } from "@sanity/ui";
import { useCallback, type ClipboardEvent } from "react";
import {
	getPublishedId,
	set,
	useDocumentOperation,
	useFormValue,
	type ArrayOfObjectsInputProps,
	type BlockDecoratorProps,
	type OnPasteFn,
	type PortableTextInputProps,
} from "sanity";
import { htmlToArticleBody, pastedArticleHtml } from "../lib/articleHtml";

// Same oranges as the article page, so the editor previews what readers see.
const ACCENT = "#c96a00";
const HIGHLIGHT = "#f5a000";

export const AccentIcon = () => <span style={{ color: ACCENT, fontWeight: 800 }}>A</span>;

export const HighlightIcon = () => (
	<span style={{ padding: "0 3px", background: HIGHLIGHT, color: "#111", fontWeight: 700 }}>H</span>
);

export const AccentDecorator = (props: BlockDecoratorProps) => (
	<span style={{ color: ACCENT, fontWeight: 800 }}>{props.children}</span>
);

export const HighlightDecorator = (props: BlockDecoratorProps) => (
	<span style={{ background: HIGHLIGHT, color: "#111" }}>{props.children}</span>
);

/**
 * The article body with a paste handler for article HTML (see
 * `pastedArticleHtml`). The template's intro paragraph is the article's lead,
 * so it goes to "Lead / excerpt" when that is still empty rather than into the
 * body, where the page would show it twice.
 */
// Typed as the generic array input because that is what an array field's
// `components.input` accepts; for a block array Studio actually passes the
// Portable Text props, which is what `onPaste` belongs to.
export function ArticleBodyInput(props: ArrayOfObjectsInputProps) {
	const toast = useToast();
	const documentId = useFormValue(["_id"]) as string | undefined;
	const excerpt = useFormValue(["excerpt"]) as string | undefined;
	const { patch } = useDocumentOperation(getPublishedId(documentId ?? ""), "article");

	const onPaste = useCallback<OnPasteFn>(
		({ event, path }) => {
			const html = pastedArticleHtml(event.clipboardData);
			if (!html) return undefined;

			const { blocks, intro } = htmlToArticleBody(html);
			if (intro && !excerpt?.trim()) {
				patch.execute([{ set: { excerpt: intro } }]);
				toast.push({ status: "info", title: "The intro went to “Lead / excerpt”", description: intro });
			} else if (intro) {
				toast.push({ status: "warning", title: "The intro was not pasted", description: "“Lead / excerpt” is already filled in, and the page shows it as the intro." });
			}
			return { insert: blocks, path };
		},
		[excerpt, patch, toast],
	);

	const portableTextProps = props as unknown as PortableTextInputProps;
	return portableTextProps.renderDefault({ ...portableTextProps, onPaste });
}

type TableRow = { _key: string; _type: "tableRow"; cells?: string[] };

const randomKey = () => Math.random().toString(36).slice(2, 14);

/**
 * A spreadsheet-like grid for the table block. Typing edits a cell; pasting a
 * range copied from Google Sheets or Excel (tab-separated) fills the grid from
 * that cell, growing it as needed.
 */
export function TableRowsInput(props: ArrayOfObjectsInputProps) {
	const { onChange, readOnly, path } = props;
	const rows = (props.value ?? []) as TableRow[];
	const headerRow = useFormValue([...path.slice(0, -1), "headerRow"]) !== false;
	const columns = Math.max(1, ...rows.map((row) => row.cells?.length ?? 0));
	const grid = rows.map((row) => Array.from({ length: columns }, (_, column) => row.cells?.[column] ?? ""));

	const commit = (next: string[][]) =>
		onChange(set(next.map((cells, index) => ({ _type: "tableRow", _key: rows[index]?._key ?? randomKey(), cells }))));

	const updateCell = (rowIndex: number, columnIndex: number, text: string) =>
		commit(grid.map((cells, r) => (r === rowIndex ? cells.map((cell, c) => (c === columnIndex ? text : cell)) : cells)));

	const pasteRange = (event: ClipboardEvent<HTMLInputElement>, rowIndex: number, columnIndex: number) => {
		const text = event.clipboardData.getData("text/plain").replace(/\r/g, "").replace(/\n$/, "");
		if (!text.includes("\t") && !text.includes("\n")) return;
		event.preventDefault();

		const pasted = text.split("\n").map((line) => line.split("\t").map((cell) => cell.trim()));
		const width = Math.max(columns, columnIndex + Math.max(...pasted.map((cells) => cells.length)));
		const height = Math.max(grid.length, rowIndex + pasted.length);
		const next = Array.from({ length: height }, (_, r) =>
			Array.from({ length: width }, (_, c) => pasted[r - rowIndex]?.[c - columnIndex] ?? grid[r]?.[c] ?? ""),
		);
		commit(next);
	};

	if (rows.length === 0) {
		return (
			<Card padding={4} radius={2} border tone="transparent">
				<Stack space={3}>
					<Text size={1} muted>
						Start with an empty grid, or copy cells in Google Sheets / Excel and paste them into the first cell.
					</Text>
					<Box>
						<Button text="Create a 3 × 3 table" mode="ghost" disabled={readOnly} onClick={() => commit([["", "", ""], ["", "", ""], ["", "", ""]])} />
					</Box>
				</Stack>
			</Card>
		);
	}

	return (
		<Stack space={3}>
			<Box style={{ overflowX: "auto" }}>
				<table style={{ borderCollapse: "collapse", width: "100%" }}>
					<tbody>
						{grid.map((cells, rowIndex) => (
							<tr key={rows[rowIndex]._key}>
								{cells.map((cell, columnIndex) => (
									<td key={columnIndex} style={{ padding: 2, minWidth: 140 }}>
										<TextInput
											value={cell}
											readOnly={readOnly}
											fontSize={1}
											weight={headerRow && rowIndex === 0 ? "semibold" : "regular"}
											onChange={(event) => updateCell(rowIndex, columnIndex, event.currentTarget.value)}
											onPaste={(event) => pasteRange(event, rowIndex, columnIndex)}
										/>
									</td>
								))}
								<td style={{ width: 1 }}>
									<Button
										mode="bleed"
										tone="critical"
										text="×"
										title="Delete row"
										disabled={readOnly}
										onClick={() => commit(grid.filter((_, r) => r !== rowIndex))}
									/>
								</td>
							</tr>
						))}
						<tr>
							{Array.from({ length: columns }, (_, columnIndex) => (
								<td key={columnIndex} style={{ textAlign: "center" }}>
									<Button
										mode="bleed"
										tone="critical"
										fontSize={1}
										text="Delete column"
										disabled={readOnly || columns === 1}
										onClick={() => commit(grid.map((cells) => cells.filter((_, c) => c !== columnIndex)))}
									/>
								</td>
							))}
						</tr>
					</tbody>
				</table>
			</Box>
			<Flex gap={2}>
				<Button text="Add row" mode="ghost" disabled={readOnly} onClick={() => commit([...grid, Array<string>(columns).fill("")])} />
				<Button text="Add column" mode="ghost" disabled={readOnly} onClick={() => commit(grid.map((cells) => [...cells, ""]))} />
			</Flex>
		</Stack>
	);
}
