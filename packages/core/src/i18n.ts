/**
 * Small i18n layer. Dictionaries are plain objects so third-party themes can
 * override copy without pulling in a translation runtime.
 */
import { type LocaleDefinition, localePrefix, type PressConfig } from './config.js'

export type Dictionary = Record<string, string>

const builtinDictionaries: Record<string, Dictionary> = {
  en: {
    'nav.docs': 'Docs',
    'nav.blog': 'Blog',
    'nav.components': 'Components',
    'nav.themes': 'Themes',
    'nav.wiki': 'Wiki',
    'site.title': 'TanStack Blog',
    'nav.tutorials': 'Tutorials',
    'version.selector': 'Version',
    'version.current': 'Current',
    'tutorials.title': 'Step-by-step tutorials',
    'tutorials.intro': 'Five guided lessons covering content, themes, search, i18n and deployment.',
    'language.selector': 'Language',
    'group.getting-started': 'Getting Started',
    'group.fundamentals': 'Fundamentals',
    'group.guides': 'Guides',
    'group.reference': 'Reference',
    'group.community': 'Community',
    'section.docs': 'Documentation',
    'section.blog': 'Blog',
    'section.components': 'Components',
    'section.pages': 'Pages',
    'section.wiki': 'Knowledge base',
    'label.component': 'Component',
    'label.journal': 'Journal',
    'label.gallery': 'Gallery',

    'search.placeholder': 'Search documentation…',
    'search.noResults': 'No results found',
    'search.recent': 'Recently viewed',
    'theme.toggle': 'Change theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'toc.title': 'On this page',
    'page.edit': 'Edit this page',
    'page.prev': 'Previous',
    'page.next': 'Next',
    'blog.all': 'All posts',
    'blog.tags': 'Tags',
    'blog.readingTime': 'min read',
    'footer.builtWith': 'Built with TanStack Blog',
    'hero.kicker': 'Built on TanStack Start + TanStack Markdown',
    'hero.description': 'Docs, blogs and component libraries. One framework.',
    'hero.docs': 'Read the docs',
    'hero.themes': 'Browse themes',
    'hero.search': 'Try search',
    'hero.cardDocs': 'A documentation tree generated from your Markdown files.',
    'hero.cardBlog': 'Reverse-chronological articles with tags and reading time.',
    'hero.cardThemes': 'Swappable design-token packages, no remount required.',
    'hero.cardSearch': 'Orama full-text or zero-dependency local search, offline.',
    'hero.powered': 'Powered by the TanStack ecosystem',
    'components.description':
      'Reusable UI blocks from @tanstack-blog/ui, shown exactly as they render.',
    'feedback.question': 'Was this page helpful?',
    'feedback.yes': 'Yes',
    'feedback.no': 'No',
    'api.props': 'Props',
    'api.prop': 'Prop',
    'api.type': 'Type',
    'api.default': 'Default',
    'api.description': 'Description',
    'api.generated': 'Generated from TSDoc comments',
    'api.liveExample': 'Live example',
    'theme.apply': 'Apply theme',
    'theme.other': 'Other themes',
    'theme.marketplace': 'Marketplace',
    'theme.search': 'Search themes…',
    'theme.allSchools': 'All schools',
    'theme.compare': 'Compare',
    'theme.compareReady': 'Compare selected',
    'theme.compareClear': 'Clear selection',
    'theme.install': 'Install',
    'theme.exportCss': 'Export CSS',
    'theme.tokens': 'Design tokens',
    'theme.copyCommand': 'Copy install command',
    'theme.copied': 'Copied',
    'theme.sample': 'Sample',
    'theme.viewScreenshot': 'Screenshot',

    'theme.galleryIntro':
      'Every theme is a standalone package. Open a preview to see it on a real docs layout, then apply it with one click.',
    'blog.intro': 'Notes on building docs, themes and developer tools with TanStack.',
    'nav.videos': 'Tutorials',
    'videos.title': 'Video guides',
    'wiki.kicker': 'Auto-generated from source',
    'wiki.intro': 'A deterministic, LLM-free map of this repository.',
    'videos.zhLink': '中文视频教程',
    'videos.intro':
      'Real terminal sessions: the scaffolder is driven through a pseudo-terminal, captured frame by frame and encoded to MP4.',

    'feedback.thanks': 'Thanks for the feedback!',
  },
  fr: {
    'nav.docs': 'Documentation',
    'nav.blog': 'Blog',
    'nav.components': 'Composants',
    'nav.themes': 'Thèmes',
    'search.placeholder': 'Rechercher dans la documentation…',
    'search.noResults': 'Aucun résultat',
    'search.recent': 'Récemment consultés',
    'theme.toggle': 'Changer de thème',
    'theme.light': 'Clair',
    'theme.dark': 'Sombre',
    'theme.system': 'Système',
    'toc.title': 'Sur cette page',
    'page.edit': 'Modifier cette page',
    'page.prev': 'Précédent',
    'page.next': 'Suivant',
    'blog.all': 'Tous les articles',
    'blog.tags': 'Étiquettes',
    'blog.readingTime': 'min de lecture',
    'footer.builtWith': 'Construit avec TanStack Blog',
    'feedback.thanks': 'Merci pour votre retour !',
  },
  ja: {
    'nav.docs': 'ドキュメント',
    'nav.blog': 'ブログ',
    'nav.components': 'コンポーネント',
    'nav.themes': 'テーマ',
    'search.placeholder': 'ドキュメントを検索…',
    'search.noResults': '結果が見つかりません',
    'search.recent': '最近見たページ',
    'theme.toggle': 'テーマを切り替える',
    'theme.light': 'ライト',
    'theme.dark': 'ダーク',
    'theme.system': 'システム',
    'toc.title': 'このページの内容',
    'page.edit': 'このページを編集',
    'page.prev': '前へ',
    'page.next': '次へ',
    'blog.all': 'すべての投稿',
    'blog.tags': 'タグ',
    'blog.readingTime': '分で読めます',
    'footer.builtWith': 'TanStack Blog で構築',
    'feedback.thanks': 'フィードバックありがとうございます！',
  },
  de: {
    'nav.docs': 'Dokumentation',
    'nav.blog': 'Blog',
    'nav.components': 'Komponenten',
    'nav.themes': 'Themes',
    'nav.wiki': 'Wiki',
    'site.title': 'TanStack Blog',
    'nav.tutorials': 'Tutorials',
    'version.selector': 'Version',
    'version.current': 'Current',
    'tutorials.title': 'Step-by-step tutorials',
    'tutorials.intro': 'Five guided lessons covering content, themes, search, i18n and deployment.',
    'language.selector': 'Language',
    'group.getting-started': 'Getting Started',
    'group.fundamentals': 'Fundamentals',
    'group.guides': 'Guides',
    'group.reference': 'Reference',
    'group.community': 'Community',
    'section.docs': 'Documentation',
    'section.blog': 'Blog',
    'section.components': 'Components',
    'section.pages': 'Pages',
    'section.wiki': 'Knowledge base',
    'label.component': 'Component',
    'label.journal': 'Journal',
    'label.gallery': 'Gallery',

    'search.placeholder': 'Dokumentation durchsuchen…',
    'search.noResults': 'Keine Ergebnisse',
    'search.recent': 'Kürzlich angesehen',
    'theme.toggle': 'Design wechseln',
    'theme.light': 'Hell',
    'theme.dark': 'Dunkel',
    'theme.system': 'System',
    'toc.title': 'Auf dieser Seite',
    'page.edit': 'Diese Seite bearbeiten',
    'page.prev': 'Zurück',
    'page.next': 'Weiter',
    'blog.all': 'Alle Beiträge',
    'blog.tags': 'Tags',
    'blog.readingTime': 'Min. Lesezeit',
    'footer.builtWith': 'Erstellt mit TanStack Blog',
    'feedback.thanks': 'Danke für dein Feedback!',
  },
  ar: {
    'nav.docs': 'الوثائق',
    'nav.blog': 'المدونة',
    'nav.components': 'المكوّنات',
    'nav.themes': 'السمات',
    'search.placeholder': 'ابحث في الوثائق…',
    'search.noResults': 'لا توجد نتائج',
    'search.recent': 'تمت زيارتها مؤخرًا',
    'theme.toggle': 'تغيير السمة',
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.system': 'النظام',
    'toc.title': 'في هذه الصفحة',
    'page.edit': 'تعديل هذه الصفحة',
    'page.prev': 'السابق',
    'page.next': 'التالي',
    'blog.all': 'كل المقالات',
    'blog.tags': 'الوسوم',
    'blog.readingTime': 'دقيقة قراءة',
    'footer.builtWith': 'بُني باستخدام TanStack Blog',
    'feedback.thanks': 'شكرًا لملاحظاتك!',
  },
  'zh-CN': {
    'nav.docs': '文档',
    'nav.blog': '博客',
    'nav.components': '组件',
    'nav.themes': '主题',
    'nav.wiki': '知识库',
    'site.title': 'TanStack 博客',
    'nav.tutorials': '教程',
    'version.selector': '版本',
    'version.current': '当前版本',
    'tutorials.title': '分步教程',
    'tutorials.intro': '五节引导式课程，覆盖内容、主题、搜索、多语言与部署。',
    'language.selector': '语言',
    'group.getting-started': '入门指南',
    'group.fundamentals': '核心概念',
    'group.guides': '使用指南',
    'group.reference': '参考',
    'group.community': '社区',
    'section.docs': '文档',
    'section.blog': '博客',
    'section.components': '组件',
    'section.pages': '页面',
    'section.wiki': '知识库',
    'label.component': '组件',
    'label.journal': '日志',
    'label.gallery': '画廊',

    'search.placeholder': '搜索文档…',
    'search.noResults': '没有找到结果',
    'search.recent': '最近浏览',
    'theme.toggle': '切换主题',
    'theme.light': '浅色',
    'theme.dark': '深色',
    'theme.system': '跟随系统',
    'toc.title': '本页内容',
    'page.edit': '编辑此页',
    'page.prev': '上一篇',
    'page.next': '下一篇',
    'blog.all': '全部文章',
    'blog.tags': '标签',
    'blog.readingTime': '分钟阅读',
    'footer.builtWith': '使用 TanStack Blog 构建',
    'hero.kicker': '基于 TanStack Start + TanStack Markdown 构建',
    'hero.description': '文档、博客与组件库，一套框架搞定。',
    'hero.docs': '阅读文档',
    'hero.themes': '浏览主题',
    'hero.search': '体验搜索',
    'hero.cardDocs': '由 Markdown 文件自动生成的文档树。',
    'hero.cardBlog': '按时间倒序的文章，支持标签与阅读时间。',
    'hero.cardThemes': '可插拔的主题令牌包，切换无需重挂载。',
    'hero.cardSearch': 'Orama 全文搜索或零依赖本地搜索，完全离线。',
    'hero.powered': '由 TanStack 生态驱动',
    'components.description': '来自 @tanstack-blog/ui 的可复用 UI 组件，所见即所得。',
    'feedback.question': '这个页面对你有帮助吗？',
    'feedback.yes': '有帮助',
    'feedback.no': '没帮助',
    'api.props': '属性',
    'api.prop': '属性',
    'api.type': '类型',
    'api.default': '默认值',
    'api.description': '说明',
    'api.generated': '由 TSDoc 注释自动生成',
    'api.liveExample': '实时示例',
    'theme.apply': '应用主题',
    'theme.other': '其他主题',
    'theme.marketplace': '主题市场',
    'theme.search': '搜索主题…',
    'theme.allSchools': '全部流派',
    'theme.compare': '对比',
    'theme.compareReady': '对比所选',
    'theme.compareClear': '清空选择',
    'theme.install': '安装',
    'theme.exportCss': '导出 CSS',
    'theme.tokens': '设计令牌',
    'theme.copyCommand': '复制安装命令',
    'theme.copied': '已复制',
    'theme.sample': '预览',
    'theme.viewScreenshot': '截图',

    'theme.galleryIntro': '每套主题都是独立包。打开预览查看真实文档布局，再一键应用。',
    'blog.intro': '关于用 TanStack 构建文档、主题与开发者工具的笔记。',
    'nav.videos': '视频教程',
    'videos.title': '视频教程',
    'wiki.kicker': '由源码自动生成',
    'wiki.intro': '基于仓库静态分析的确定性知识库，无需 LLM。',
    'videos.zhLink': 'English guide',
    'videos.intro': '真实终端会话：通过伪终端驱动脚手架，逐帧捕获后编码为 MP4。',

    'feedback.thanks': '感谢反馈！',
  },
}

/** Register or override a dictionary for a locale. */
export function registerDictionary(locale: string, dictionary: Dictionary): Dictionary {
  builtinDictionaries[locale] = { ...builtinDictionaries[locale], ...dictionary }
  return builtinDictionaries[locale]!
}

/** Create a translator bound to a locale. Missing keys fall back to English, then the key. */
export function createTranslator(locale: string) {
  return (key: string): string =>
    builtinDictionaries[locale]?.[key] ?? builtinDictionaries.en?.[key] ?? key
}

/**
 * Map a pathname from one locale to another, preserving the remaining route.
 * Used by the language switcher so changing locale never drops the current page.
 */
export function switchLocaleRoute(config: PressConfig, pathname: string, toLocale: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]
  const from = config.i18n.locales.find((item) => item.code === first)
  const rest = from ? segments.slice(1) : segments
  const prefix = localePrefix(config, toLocale)
  return `${prefix}/${rest.join('/')}`.replace(/\/$/, '') || '/'
}

/** Switch a pathname to a different documentation version. */
export function switchVersionRoute(
  pathname: string,
  version: string,
  current: string,
  locales: string[] = [],
): string {
  const segments = pathname.split('/').filter(Boolean)
  const vIndex = segments.indexOf('v')
  const withoutVersion =
    vIndex >= 0 ? segments.slice(0, vIndex).concat(segments.slice(vIndex + 2)) : segments
  if (version === current) return `/${withoutVersion.join('/')}` || '/'
  const candidate = withoutVersion[0]
  const locale = locales.includes(candidate ?? '') ? candidate : undefined
  const rest = locale ? withoutVersion.slice(1) : withoutVersion
  return `/${locale ? `${locale}/` : ''}v/${version}/${rest.join('/')}`.replace(/\/$/, '')
}

function configLocale(segments: string[]): string | undefined {
  return segments[0]
}

/** Resolve the best matching locale from a URL segment or browser preference. */
export function resolveLocale(config: PressConfig, candidate?: string | null): LocaleDefinition {
  if (candidate) {
    const exact = config.i18n.locales.find((item) => item.code === candidate)
    if (exact) return exact
    const base = candidate.split('-')[0]
    const partial = config.i18n.locales.find((item) => item.code.split('-')[0] === base)
    if (partial) return partial
  }
  return (
    config.i18n.locales.find((item) => item.code === config.i18n.defaultLocale) ??
    config.i18n.locales[0]!
  )
}
