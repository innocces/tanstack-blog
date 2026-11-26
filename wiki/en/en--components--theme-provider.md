<!-- Mirrored from apps/docs/content/en/components/theme-provider.md. Edit the source, not this file. -->

---
title: Theme provider
description: Applies tokens before hydration and persists choices.
order: 10
api: ThemeProviderProps
updated: 2026-02-01
---

# Theme provider

Applies tokens before hydration and persists choices.

## Usage

```tsx
<ThemeProvider store={store} themes={allThemes} storageKey={config.theme.storeKey}>{children}</ThemeProvider>
```

## Notes

- Rendered from the real `@tanstack-blog/ui` package.
- Overridable through the typed `ThemeSlots` registry.
