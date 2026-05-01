---
description: "Ship: build → test → commit → push → PR"
---
1. `pnpm build` — must pass
2. `pnpm test` — must pass
3. Show diff · wait approval · commit conventional · `git push && gh pr create`
Stop on any failure.
