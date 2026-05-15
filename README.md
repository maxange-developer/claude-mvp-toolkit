# angel1-mvp-toolkit

[![npm](https://img.shields.io/npm/v/@massiangelone/angel1-mvp-toolkit?label=npm&color=orange)](https://www.npmjs.com/package/@massiangelone/angel1-mvp-toolkit)
[![CI](https://github.com/maxange-developer/angel1-mvp-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/maxange-developer/angel1-mvp-toolkit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

CLI that scaffolds production-ready Next.js + Supabase apps with multi-provider AI (Claude, OpenAI, or both) in seconds. Answer 5 questions and get a fully configured project with Anthropic or OpenAI, Supabase Auth, optional Stripe payments, Resend email, and RAG/pgvector support — all with TypeScript strict, Tailwind 4, and a pre-wired `.claude/` workspace for AI-assisted development.

Part of the `angel1-*` toolkit series.

## Quickstart

```bash
npx @massiangelone/angel1-mvp-toolkit init my-app
```

You'll be asked:
1. AI provider? (Anthropic / OpenAI / Both)
2. Auth? (Supabase / NextAuth)
3. Add Stripe?
4. Add Resend?
5. RAG support?

Then: `cd my-app && cp .env.example .env.local && pnpm dev`

## What you get

- **Next.js 16** App Router + TypeScript strict
- **Supabase** (auth + DB + optional pgvector)
- **Multi-provider AI** — Anthropic and/or OpenAI behind a thin abstraction in `src/lib/ai/`
- **`.claude/`** workspace — agents, commands, docs optimized for AI-assisted dev
- **Tailwind 4** + postcss
- **Vitest** + Playwright scaffold

## Multi-provider AI

Choose your AI provider at scaffold time:

- **Both (recommended)** — Anthropic + OpenAI installed, switchable via `AI_PROVIDER` in `.env`
- **Anthropic only** — Claude + Voyage embeddings
- **OpenAI only** — GPT + OpenAI embeddings

The generated template uses a thin abstraction in `src/lib/ai/` so application code stays provider-agnostic:

```ts
import { getProvider } from '@/lib/ai'

const ai = await getProvider()
const result = await ai.generate({
  messages: [{ role: 'user', content: 'Hello' }],
})
```

Same code works with Claude or GPT. Switch by changing one line in `.env`:

```env
AI_PROVIDER=anthropic
# AI_PROVIDER=openai
```

## Roadmap

| Version | Feature | Status |
|---------|---------|--------|
| v1.0 | `init` command, multi-provider AI (Claude / OpenAI / Both), Supabase or NextAuth, optional Stripe / Resend / RAG | Released |

## Docs

Full documentation: [docs/README.md](docs/README.md)

## Development

```bash
git clone https://github.com/maxange-developer/angel1-mvp-toolkit
cd angel1-mvp-toolkit
pnpm install
pnpm -r build

# Test the CLI
node packages/cli/dist/index.js init /tmp/test-app
```

## Related

Part of the `angel1-*` series of open-source tools for AI-enhanced product development:

- **[angel1-rag-eval](https://github.com/maxange-developer/angel1-rag-eval)** — Evaluate RAG pipelines: retrieval precision, faithfulness, correctness. Use it to measure the quality of the RAG endpoint you scaffold with this toolkit.
