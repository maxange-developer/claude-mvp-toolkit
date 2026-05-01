# Demo recording script (Loom)

Target length: ~2 minutes. No audio required — captions work.

---

## Setup (before recording)

```bash
# Clean slate
rm -rf /tmp/my-saas
npm install -g @maxange/claude-mvp-toolkit   # or use npx
clear
```

---

## Step 1 — Run init (0:00–0:45)

```bash
npx claude-mvp-toolkit init my-saas
```

Show each prompt being answered:
- AI provider → Anthropic (Claude)
- Auth → Supabase Auth
- Stripe → No
- Resend → No
- RAG → No

Watch the spinner: "Copying template... Configuring project... Installing dependencies... Initializing git..."

Final output: `✓ Project ready!  cd my-saas && pnpm dev`

---

## Step 2 — Show generated files (0:45–1:15)

```bash
cd my-saas
ls -la
cat src/lib/ai/chat.ts
cat .env.example
```

Highlight:
- `.claude/` folder (agents, commands, docs)
- `src/lib/ai/chat.ts` — Claude client ready to use
- `.env.example` — all keys pre-documented

---

## Step 3 — Dev server (1:15–2:00)

```bash
cp .env.example .env.local
# (fill in ANTHROPIC_API_KEY in .env.local)
pnpm dev
```

Switch to browser → `http://localhost:3000` — Next.js app running.

Optional: open VS Code, show `CLAUDE.md` and `.claude/agents/api-builder.md`.

---

## Editing notes

- Trim dead air during `pnpm install`
- Speed up 2× during file listing
- Caption the final screen: "One command. Production-ready scaffold."
