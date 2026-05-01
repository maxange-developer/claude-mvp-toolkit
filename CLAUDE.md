# Project: claude-mvp-toolkit

## Stack
- Node.js · TypeScript strict · tsup (ESM + CJS build)
- commander@12 · prompts@2 · fs-extra@11 · chalk@5 · ora@8
- pnpm workspaces monorepo

## Structure
- packages/cli/ — publishable CLI (`@maxange/claude-mvp-toolkit`)
- packages/templates/base/ — Next.js scaffold copied on `init`

## Commands
```bash
pnpm -r build        # build all packages
pnpm build           # alias for -r build
pnpm dev             # watch mode (cli package)
```

## Rules
1. `packages/cli/` is Node-only — no browser APIs, no React
2. Template files in `packages/templates/base/` are plain text — no deps installed there
3. CLI reads template with `fs-extra.copy()` → modifies `package.json` → `pnpm install`
4. TypeScript strict — `unknown` over `any`, no `as` without runtime check
5. New template file → update `packages/templates/base/.env.example` immediately
6. Test CLI with `node packages/cli/dist/index.js init /tmp/test` after every build

## Forbidden
- `any` type · `console.log` in CLI output (use `chalk` + `ora`)
- Hardcoded paths — always use `path.resolve` + `fileURLToPath`

## Pre-commit
- [ ] `pnpm -r build` passes · [ ] `node dist/index.js --version` prints version
- [ ] `init test-proj` → generated project `pnpm build` passes
