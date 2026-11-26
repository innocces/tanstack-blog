/** Route + SSR coverage. */
import { BASE } from './helpers.mjs'

export default async function run(page, { check }) {
  for (const [route, marker] of [
    ['/', 'tb-hero'],
    ['/docs/getting-started', 'tb-markdown'],
    ['/docs/configuration', 'tb-markdown'],
    ['/blog', 'tb-post-card'],
    ['/blog/why-a-tanstack-docs-framework', 'tb-markdown'],
    ['/components', 'tb-entry'],
    ['/components/callout', 'tb-component-page'],
    ['/themes', 'tb-theme-gallery'],
    ['/themes/linear', 'tb-theme-preview'],
    ['/videos', 'tb-video-card'],
    ['/wiki', 'tb-wiki-page'],
    ['/wiki/architecture', 'tb-wiki-page'],
    ['/wiki/api', 'tb-wiki-page'],
    ['/tutorials', 'tb-tutorial-list'],
    ['/tutorials/01-quickstart', 'tb-entry'],
    ['/zh-CN/tutorials', 'tb-tutorial-list'],
    ['/zh-CN/tutorials/01-quickstart', '快速开始'],
    ['/zh-CN/blog/why-a-tanstack-docs-framework', '为什么要在 TanStack'],
    ['/themes/compare?a=linear&b=muji', 'tb-compare-grid'],
    ['/zh-CN/docs/getting-started', '快速开始'],
    ['/this-route-does-not-exist', 'Page not found'],
  ]) {
    const response = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle0' })
    const html = await page.content()
    check(`route ${route}`, response?.status() === 200 && html.includes(marker))
  }
}
