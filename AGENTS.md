<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project verification

- Never run a production build (`bun run build`, `npm run build`, `next build`, or equivalents) unless the user explicitly asks for it in the current request.
- Use linting and targeted checks by default.
