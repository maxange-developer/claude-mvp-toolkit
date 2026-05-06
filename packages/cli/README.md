# @massiangelone/claude-mvp-toolkit

[![npm](https://img.shields.io/npm/v/@massiangelone/claude-mvp-toolkit)](https://www.npmjs.com/package/@massiangelone/claude-mvp-toolkit)

Scaffold production-ready Next.js + Supabase + Claude AI apps in seconds.

## Quickstart

```bash
npx @massiangelone/claude-mvp-toolkit init my-app
cd my-app && pnpm dev
```

Skip prompts and use defaults (Anthropic + Supabase, no extras):

```bash
npx @massiangelone/claude-mvp-toolkit init my-app --yes
```

## What's included

- Next.js 16 App Router · TypeScript strict · Tailwind CSS 4
- Supabase (auth + DB) or NextAuth.js
- Anthropic SDK (Claude) and/or OpenAI SDK
- Optional: Stripe payments · Resend email · pgvector RAG
- Vitest (unit) · Playwright (e2e) · Vercel deploy config
- Pre-configured CLAUDE.md for Claude Code

## Environment Variables

After `init`, copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=          # only if OpenAI selected
STRIPE_SECRET_KEY=       # only if Stripe selected
RESEND_API_KEY=          # only if Resend selected
```

## Stack defaults (--yes)

| Option | Default |
|--------|---------|
| AI provider | Anthropic (Claude) |
| Auth | Supabase Auth |
| Stripe | No |
| Resend | No |
| RAG / pgvector | No |
