# claude-mvp-toolkit — Documentation

## Getting started

Three commands to a running app:

```bash
# 1. Scaffold
npx claude-mvp-toolkit init my-app

# 2. Configure
cd my-app && cp .env.example .env.local
# Fill in your API keys in .env.local

# 3. Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## CLI options

| Flag | Default | Description |
|------|---------|-------------|
| `--version` | — | Print CLI version |
| `--help` | — | Show usage |

Interactive prompts during `init`:

| Prompt | Choices | Effect |
|--------|---------|--------|
| AI provider | Anthropic / OpenAI / Both | Adds SDK dependency |
| Auth provider | Supabase Auth / NextAuth.js | Adds auth packages |
| Add Stripe? | yes / no | Adds `stripe` + `@stripe/stripe-js` |
| Add Resend? | yes / no | Adds `resend` |
| Add RAG? | yes / no | Adds pgvector support via Supabase |

---

## Template structure

Generated project layout:

```
my-app/
├── .claude/
│   ├── agents/          # AI sub-agents (api-builder, test-writer, ui-builder)
│   ├── commands/        # Slash commands (review, scaffold-feature, ship)
│   └── docs/            # Stack notes, patterns, lessons learned
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       ├── ai/
│       │   ├── chat.ts        # Anthropic client factory
│       │   └── embeddings.ts  # pgvector helpers
│       └── supabase/
│           ├── client.ts      # Browser client
│           └── server.ts      # Server client (cookies)
├── .env.example
├── CLAUDE.md
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Adding features

**New page/route:** add a folder under `src/app/` following Next.js App Router conventions.

**New API route:** create `src/app/api/<name>/route.ts` exporting `GET`/`POST` handlers.

**New lib utility:** add a file under `src/lib/` — keep it pure (no React imports).

**After any change:** `pnpm build` to verify TypeScript compiles cleanly.

---

## Roadmap

| Version | Feature | Status |
|---------|---------|--------|
| v0.1 | `init` command — base template | Released |
| v0.2 | AI chat UI template (streaming) | Planned |
| v0.3 | RAG pipeline template (pgvector + embeddings) | Planned |
| v0.4 | `add` command — add features post-init | Planned |
| v1.0 | Stable · full test coverage | Planned |
