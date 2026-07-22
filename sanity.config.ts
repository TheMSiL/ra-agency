"use client";

import { documentInternationalization } from "@sanity/document-internationalization";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";

const languages = [
	{ id: "en", title: "English" },
	{ id: "ru", title: "Русский" },
	{ id: "ua", title: "Українська" },
];

export default defineConfig({
	name: "ra-agency",
	title: "RA Agency Content",
	basePath: "/studio",
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "missing",
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
	plugins: [
		structureTool(),
		documentInternationalization({ supportedLanguages: languages, schemaTypes: ["article", "caseStudy"] }),
	],
	schema: {
		types: schemaTypes,
		templates: (templates) => templates.filter((template) => !["article", "caseStudy"].includes(template.id)),
	},
});
