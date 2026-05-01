# claude-mvp-toolkit

CLI that scaffolds production-ready Next.js + Supabase + Claude AI apps in seconds. Answer 5 questions and get a fully configured project with Anthropic or OpenAI, Supabase Auth, optional Stripe payments, Resend email, and RAG/pgvector support — all with TypeScript strict, Tailwind 4, and a pre-wired `.claude/` workspace for AI-assisted development.

## Quickstart

```bash
npx claude-mvp-toolkit init my-app
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
- **Claude SDK** pre-wired in `src/lib/ai/chat.ts`
- **`.claude/`** workspace — agents, commands, docs optimized for AI-assisted dev
- **Tailwind 4** + postcss
- **Vitest** + Playwright scaffold

## Roadmap

| Version | Feature |
|---------|---------|
| v0.1 | `init` command — base template |
| v0.2 | AI chat UI template (streaming) |
| v0.3 | RAG pipeline template (pgvector + embeddings) |
| v1.0 | Stable · npm publish |

## Development

```bash
git clone https://github.com/maxange-developer/claude-mvp-toolkit
cd claude-mvp-toolkit
pnpm install
pnpm -r build

# Test the CLI
node packages/cli/dist/index.js init /tmp/test-app
```
