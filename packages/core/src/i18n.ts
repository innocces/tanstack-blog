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
