# @massiangelone/angel1-mvp-toolkit

[![npm](https://img.shields.io/npm/v/@massiangelone/angel1-mvp-toolkit.svg)](https://www.npmjs.com/package/@massiangelone/angel1-mvp-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Scaffold production-ready Next.js + Supabase apps with multi-provider AI (Claude, OpenAI, or both) in seconds.

Part of the `angel1-*` toolkit series.

## Quickstart

```bash
npx @massiangelone/angel1-mvp-toolkit init my-app
cd my-app && pnpm dev
```

Skip prompts and use defaults (Anthropic + Supabase):

```bash
npx @massiangelone/angel1-mvp-toolkit init my-app --yes
```

Pick your AI provider non-interactively:

```bash
npx @massiangelone/angel1-mvp-toolkit init my-app --ai openai
npx @massiangelone/angel1-mvp-toolkit init my-app --ai anthropic
npx @massiangelone/angel1-mvp-toolkit init my-app --ai both
```

## What's included

- Next.js 16 App Router · TypeScript strict · Tailwind CSS 4
- Supabase (auth + DB) or NextAuth.js
- Anthropic SDK (Claude) and/or OpenAI SDK
- Provider abstraction layer — swap AI providers without rewriting your app code
- Optional: Stripe payments · Resend email · pgvector RAG
- Vitest (unit) · Playwright (e2e) · Vercel deploy config
- Pre-configured CLAUDE.md for Claude Code

## Environment Variables

After init, copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=       # only if Anthropic (Claude) selected
OPENAI_API_KEY=          # only if OpenAI (GPT) selected
STRIPE_SECRET_KEY=       # only if Stripe selected
RESEND_API_KEY=          # only if Resend selected
```

## Stack defaults (`--yes`)

| Option          | Default            |
|-----------------|--------------------|
| AI provider     | Anthropic (Claude) |
| Auth            | Supabase Auth      |
| Stripe          | No                 |
| Resend          | No                 |
| RAG / pgvector  | No                 |

## CLI flags

| Flag             | Description                                          |
|------------------|------------------------------------------------------|
| `--yes` / `-y`   | Skip prompts, use all defaults                       |
| `--ai <prov>`    | AI provider: `anthropic`, `openai`, or `both`        |

## Default models

| Provider   | Generation        | Embeddings              |
|------------|-------------------|-------------------------|
| Anthropic  | claude-sonnet-4-6 | voyage-3 (via Voyage AI)|
| OpenAI     | gpt-4o-mini       | text-embedding-3-small  |

Override via `.env`:

```env
AI_PROVIDER=anthropic     # or openai
AI_MODEL=claude-opus-4-7
EMBEDDING_MODEL=voyage-3-large
```

## Status

Stable (v1.0.0). API stable for `init` command and `--ai` flag.

## License

MIT © Massimiliano Angelone
