<!-- Mirrored from apps/docs/content/en/docs/cli.md. Edit the source, not this file. -->

---
title: CLI
description: The interactive TUI scaffolder and every prompt it asks.
group: Getting Started
order: 3
---

# CLI

`@tanstack-blog/cli` generates a complete project. It uses [Clack](https://github.com/natemoo-re/clack) for a clean terminal UI with validation, hints and cancellation support.

## Run it

```sh
pnpm dlx @tanstack-blog/cli
# or with a project name (skips the first prompt)
pnpm dlx @tanstack-blog/cli my-docs
```

## Prompts

| Prompt | Choices | Default |
| --- | --- | --- |
| Project name | free text, required | `my-docs` placeholder |
| Package manager | pnpm · npm · yarn · bun | pnpm |
| Content modes | docs · blog · components (multi-select) | docs + blog |
| Default theme | linear · muji · stripe-press · vercel · bloomberg-terminal · are-na | linear |
| Languages | en · zh-CN · ja · de (multi-select) | en |
| Search backend | orama · local · none | orama |
| Deploy target | Cloudflare · Vercel · Netlify · Node | Cloudflare |
| Initialize git | yes / no | yes |

Press `Ctrl+C` at any point to cancel — the CLI exits cleanly without writing partial files.

## Generated files

```text
my-docs/
├── app.config.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
├── README.md
├── wrangler.toml          # when Cloudflare is selected
├── src/
│   ├── router.tsx
│   ├── routes/__root.tsx
│   ├── routes/index.tsx
│   └── vite-env.d.ts
└── content/en/
    ├── index.md
    ├── docs/getting-started.md
    ├── blog/hello-world.md        # when blog is enabled
    └── components/callout.md      # when components is enabled
```

The generated root document wires up `ThemeProvider`, `SiteHeader`, `SiteFooter`, `SearchDialog` and the theme boot script. The config contains exactly the choices you made.

## After scaffolding

```sh
cd my-docs
pnpm install
pnpm dev
```

The CLI prints these commands on completion. No hidden setup step, no post-install script that modifies your files.
