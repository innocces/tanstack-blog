# Contributing

[English](./CONTRIBUTING.md) · [简体中文](./CONTRIBUTING.zh-CN.md)

See the full [Contributing guide](./apps/docs/content/en/docs/contributing.md) in the documentation for prerequisites, workspace layout, commands and the PR checklist.

Quick version:

```sh
pnpm install
pnpm build:packages
pnpm dev
pnpm check
```

- Keep `.demand/` out of git — it is local-only planning material and already ignored.
- Write concise English comments in new code.
- Update the Markdown docs and run `pnpm wiki:sync` when behavior changes.
- Use conventional commits and attach screenshots for visual changes.
