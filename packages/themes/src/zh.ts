/** Chinese display names and descriptions for the 25 catalog presets. */
export const themeZh: Record<string, { name: string; description: string }> = {
  linear: { name: 'Linear', description: '暖色近黑、发丝边框与紫色强调色，默认文档主题。' },
  vercel: { name: 'Vercel Mesh', description: '黑白高对比，克制的青色到橙色光晕。' },
  raycast: { name: 'Raycast', description: '玻璃质感命令面板风格，珊瑚红强调。' },
  notion: { name: 'Notion 经典', description: '柔和米色、温暖墨色与轻柔阴影。' },
  muji: { name: 'MUJI / 原研哉', description: '以空为满，暖色纸张、硬朗边缘、几乎无强调色。' },
  apple: { name: 'Apple HIG', description: '纯白纸张、充足留白与单一系统蓝。' },
  aesop: { name: 'Aesop', description: '药剂师式的精致：鼠尾草绿与琥珀色封印。' },
  braun: { name: 'Dieter Rams / Braun', description: '少即是多，工业灰与信号橙。' },
  monocle: { name: 'Monocle 杂志', description: '奶油纸张、杂志式层级与编辑红。' },
  'mid-century': {
    name: '中世纪现代',
    description: 'Paul Rand / Saul Bass 式几何：芥末黄、砖红与奶油。',
  },
  pentagram: { name: 'Pentagram', description: '高对比双色，字体即图像。' },
  swiss: { name: 'Vignelli / 瑞士国际', description: '严格网格、全站 Helvetica、单一信号红。' },
  'bloomberg-terminal': { name: 'Bloomberg 终端', description: '极致信息密度，深蓝底上的琥珀色。' },
  tufte: { name: 'Edward Tufte', description: '最大数据墨水比，暖色纸张，无装饰。' },
  nyt: { name: '纽约时报', description: '权威大报风格，衬线正文与细线规则。' },
  'field-io': { name: 'Field.io', description: '生成式动效品牌：深黑底与青紫流动色。' },
  'active-theory': { name: 'Active Theory', description: '电影感 WebGL，黑底加单一戏剧性色彩。' },
  resn: { name: 'Resn 叙事', description: '暖冷对比的滚动叙事布局。' },
  'are-na': { name: 'Are.na', description: '诚实的网页：系统字体、经典蓝链接、无圆角。' },
  businessweek: { name: 'Bloomberg Businessweek', description: '排版张力，高警橙与大白底。' },
  balenciaga: {
    name: 'Balenciaga',
    description: '默认浏览器样式被武器化，只有 Helvetica 与黑白。',
  },
  'stripe-press': { name: 'Stripe Press', description: '奶油纸张、温暖墨色与单一烫印青。' },
  mailchimp: { name: 'Mailchimp', description: '温暖黄色与手写感的友好微文案。' },
  headspace: { name: 'Headspace', description: '柔和蜜桃色、温暖墨绿与大圆角。' },
  y2k: { name: 'Y2K 复古未来', description: '铬金属、玻璃气泡与虹彩渐变的千禧年互联网。' },
}

export function localizedThemeName(
  theme: { id: string; name: string; nameZh?: string },
  locale: string,
): string {
  return locale.startsWith('zh') ? (theme.nameZh ?? theme.name) : theme.name
}

export function localizedThemeDescription(
  theme: { id: string; description: string; descriptionZh?: string },
  locale: string,
): string {
  return locale.startsWith('zh') ? (theme.descriptionZh ?? theme.description) : theme.description
}
