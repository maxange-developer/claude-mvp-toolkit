# Project: __PROJECT_NAME__

## Stack
- next@16 · App Router · typescript strict · tailwindcss@4
- supabase: auth + db · @supabase/ssr
- anthropic SDK · claude-sonnet-4-6
- vitest (unit) · playwright (e2e) · deploy: vercel

## Context
[Cosa fa · chi è il target · vincoli specifici]

## Structure
- src/app/ — App Router routes · src/components/ — UI
- src/lib/ai/ — Claude prompts · src/lib/db/ — Supabase queries
- src/lib/validations/ — Zod schemas · tests/unit/ · tests/e2e/

## Commands
```bash
pnpm dev · pnpm build · pnpm test · pnpm test:e2e
```

## Rules
1. Zod schema in lib/validations/ — validate before any logic
2. Server Actions over Route Handlers for mutations
3. Never expose stack traces to client · return `{ success, data, error }`
4. Supabase RLS by default — service role: inline comment required
5. SDK first (Anthropic) — raw fetch only as fallback
6. DB access from Server Components/Actions only — never Client Components
7. New env var → .env.example updated immediately
8. Mobile-first (375px) · loading + error + empty states required

## Forbidden
- `any` type · `as Type` without runtime check · `console.log` in prod
- Hardcoded API keys

## Pre-commit
- [ ] pnpm build passes · [ ] pnpm test passes · [ ] .env.example updated
