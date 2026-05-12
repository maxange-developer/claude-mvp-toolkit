# @massiangelone/claude-mvp-toolkit

[![npm](https://img.shields.io/npm/v/@massiangelone/claude-mvp-toolkit?tag=alpha)](https://www.npmjs.com/package/@massiangelone/claude-mvp-toolkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Scaffold production-ready Next.js + Supabase AI apps with Claude or OpenAI — in seconds.

## Quickstart

```bash
npx @massiangelone/claude-mvp-toolkit init my-app
cd my-app && pnpm dev
```

### Choose your AI provider

```bash
# Anthropic (Claude) — default
npx @massiangelone/claude-mvp-toolkit init my-app --ai anthropic

# OpenAI
npx @massiangelone/claude-mvp-toolkit init my-app --ai openai
```

### Skip prompts

```bash
npx @massiangelone/claude-mvp-toolkit init my-app --yes
# Equivalent: --ai anthropic, Supabase Auth, no Stripe/Resend/RAG
```

## CLI flags

| Flag | Description |
|------|-------------|
| `--ai <provider>` | AI provider: `anthropic` (default) or `openai` |
| `--yes` / `-y` | Accept all defaults, skip interactive prompts |

## What's included

- Next.js 16 App Router · TypeScript strict · Tailwind CSS 4
- Supabase (auth + DB) or NextAuth.js
- **Provider abstraction layer** — swap between Claude and OpenAI via env var, zero code changes
- Optional: Stripe payments · Resend email · pgvector RAG
- Vitest (unit) · Playwright (e2e) · Vercel deploy config
- Pre-configured CLAUDE.md for Claude Code

## Environment variables

After `init`, copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=      # only if Anthropic (Claude) selected
OPENAI_API_KEY=         # only if OpenAI selected
STRIPE_SECRET_KEY=      # only if Stripe selected
RESEND_API_KEY=         # only if Resend selected
```

Override provider or model at runtime:

```
AI_PROVIDER=openai          # anthropic | openai
AI_MODEL=gpt-4o             # overrides per-provider default
EMBEDDING_MODEL=text-embedding-3-large
```

## Default models

| Provider | Chat model | Embedding model |
|----------|-----------|----------------|
| Anthropic | `claude-sonnet-4-6` | `voyage-3` |
| OpenAI | `gpt-4o-mini` | `text-embedding-3-small` |

## Stack defaults (--yes)

| Option | Default |
|--------|---------|
| AI provider | Anthropic (Claude) |
| Auth | Supabase Auth |
| Stripe | No |
| Resend | No |
| RAG / pgvector | No |

## Status

Alpha (v0.2.x). CLI command surface is stable. Template shape may change before v1.0.
