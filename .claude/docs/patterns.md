# Architectural Decisions — claude-mvp-toolkit

## Build system
tsup over tsc — handles shebang banner, dual ESM/CJS, no manual postbuild scripts

## Template path resolution
`import.meta.url` + `fileURLToPath` + `path.resolve` — works in both ESM and after tsup bundle

## Package manager
pnpm — workspace support, lockfile for reproducibility, fast installs in generated projects

## Template modification strategy
Copy entire template dir with fs-extra, then patch package.json in place — simpler than templating engines
