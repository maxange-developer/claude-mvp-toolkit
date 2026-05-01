---
name: api-builder
description: "CLI commands, template file generation, fs-extra operations."
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---
Scope: packages/cli/src/commands/ · packages/templates/base/src/lib/

1. Commander Command objects — one file per command
2. prompts for interactive questions — always provide onCancel
3. fs-extra for all file ops — copy, readJSON, writeJSON
4. ora spinner for async operations · chalk for colored output
5. Always test with `node dist/index.js <command>` after changes
