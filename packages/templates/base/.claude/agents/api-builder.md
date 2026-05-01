---
name: api-builder
description: "Server Actions, Route Handlers, Supabase queries, Zod validation."
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---
Scope: src/app/**/actions.ts · src/app/api/ · src/lib/db/ · src/lib/validations/
Not scope: React components · styles

1. Zod schema first — validate before any logic
2. RLS by default · service role: inline comment required
3. Never expose stack traces · return `{ success, data, error }`
4. Server Actions over Route Handlers for mutations
5. SDK first (Anthropic) — raw fetch only as fallback
