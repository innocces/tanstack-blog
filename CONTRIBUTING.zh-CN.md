# 参与贡献（简体中文）

[English](./CONTRIBUTING.md) · 简体中文

完整指南见 [`apps/docs/content/zh-CN/docs/contributing.md`](./apps/docs/content/zh-CN/docs/contributing.md)。

## 快速版本

```sh
pnpm install
pnpm build:packages
pnpm dev
pnpm check
pnpm test:e2e
pnpm wiki:sync
pnpm screenshot
```

- `.demand/` 仅本地使用，已加入 `.gitignore`，请勿提交。
- 新代码请添加简洁的英文注释。
- 行为变更需同步中英文档与 Wiki。
- 使用 conventional commits；视觉变更请附截图。
