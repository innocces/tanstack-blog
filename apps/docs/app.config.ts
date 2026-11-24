import { defineConfig } from '@tanstack-blog/core'

/** The demo site config doubles as the configuration reference in /docs/configuration. */
export default defineConfig({
  title: 'TanStack Blog',
  description: 'A pluggable docs, blog and component-library framework built on TanStack Start.',
  siteUrl: 'https://tanstack-blog.pages.dev',
  contentDir: 'content',
  repoUrl: 'https://github.com/innocces/tanstack-blog',
  editUrlBase: 'https://github.com/innocces/tanstack-blog/edit/main/apps/docs/content',
  nav: [
    { label: 'Docs', to: '/docs' },
    { label: 'Blog', to: '/blog' },
    { label: 'Components', to: '/components' },
    { label: 'Themes', to: '/themes' },
  ],
  social: [
    { label: 'TanStack', href: 'https://tanstack.com' },
    { label: 'GitHub', href: 'https://github.com/innocces/tanstack-blog' },
  ],
  modes: { blog: true, docs: true, components: true },
  theme: { default: 'linear', allowSwitch: true },
  search: {
    provider: 'orama',
    placeholder: 'Search docs, posts and components…',
    includeContent: true,
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', label: 'English', dir: 'ltr' },
      { code: 'zh-CN', label: '简体中文', dir: 'ltr' },
    ],
  },
})
