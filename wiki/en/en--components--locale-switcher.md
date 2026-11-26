<!-- Mirrored from apps/docs/content/en/components/locale-switcher.md. Edit the source, not this file. -->

---
title: Locale switcher
description: Language dropdown that preserves the current route.
order: 10
example: locale-switcher
updated: 2026-02-01
---

# Locale switcher

Language dropdown that preserves the current route.

## Usage

```tsx
<LocaleSwitcher store={store} locales={config.i18n.locales} t={t} onLocaleChange={navigate} />
```

## Notes

- Rendered from the real `@tanstack-blog/ui` package.
- Overridable through the typed `ThemeSlots` registry.
