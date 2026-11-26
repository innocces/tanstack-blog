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
    { label: 'docs', to: '/docs' },
    { label: 'blog', to: '/blog' },
    { label: 'components', to: '/components' },
    { label: 'themes', to: '/themes' },
    { label: 'themeEditor', to: '/themes/editor' },
    { label: 'tutorials', to: '/tutorials' },
    { label: 'wiki', to: '/wiki' },
  ],
  social: [
    { label: 'TanStack', href: 'https://tanstack.com' },
    { label: 'GitHub', href: 'https://github.com/innocces/tanstack-blog' },
  ],
  modes: { blog: true, docs: true, components: true },
  currentVersion: 'current',
  versions: [{ code: 'v1.0', label: 'v1.0' }],
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
