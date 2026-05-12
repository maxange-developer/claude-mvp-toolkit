# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-05-12

### Changed (Breaking)

- **Package renamed** from `@massiangelone/claude-mvp-toolkit` to `@massiangelone/angel1-mvp-toolkit`.
  The old package is deprecated with a redirect message.
- **Binary renamed** from `claude-mvp-toolkit` to `angel1-mvp-toolkit`. Global installs
  using the old name no longer have a working binary; reinstall the new package.

### Added

- End-to-end smoke test in CI that scaffolds, installs, and typechecks the
  default project on every push to `master`.
- First stable release. The CLI surface, `--ai` flag values, and template
  structure are now considered stable for v1.x.

### Migration

See README.md "Migration from claude-mvp-toolkit" section.

---

## [0.2.1-alpha.0] — 2026-05-12

### Changed

- README rewritten to reflect multi-provider reality
- Env vars: `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` now annotated as conditional
  based on `--ai` selection
- Added documentation for `--ai` flag with non-interactive examples
- Added default models table per provider

## [0.2.0-alpha.0] — 2026-05-12

### Added

- Multi-provider AI support: Anthropic, OpenAI, or both
- Provider abstraction layer in template (`src/lib/ai/`)
- `--ai <provider>` CLI flag for non-interactive scaffolding
- Voyage AI integration for embeddings when using Anthropic

### Changed

- Template `src/lib/ai/` refactored to use provider-agnostic interface
- Default models tuned for cost-efficiency: `claude-sonnet-4-6` + `gpt-4o-mini`

## [0.1.0-alpha.0] — 2026-04-29

### Added

- Initial release as `@massiangelone/claude-mvp-toolkit`
- `init` command with interactive prompts for AI provider, auth, Stripe, Resend, RAG
- Next.js 16 + Supabase + Anthropic SDK template
- CI workflow for typecheck + lint + build
- Publish workflow on `v*` tag push
