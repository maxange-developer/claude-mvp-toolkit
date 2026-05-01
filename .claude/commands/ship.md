---
description: "Ship: build → test → commit → push"
---
1. `pnpm -r build` — must pass
2. `node packages/cli/dist/index.js --version` — must print version
3. Show diff · wait approval · commit conventional · `git push`
Stop on any failure.
