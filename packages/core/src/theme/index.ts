/**
 * Theme contract. A theme is data, not a component library: it exports design
 * tokens plus optional CSS and font hints. The UI reads tokens from CSS custom
 * properties, so switching themes never remounts the React tree.
 */

export type ColorMode = 'light' | 'dark'
export type DesignSchool =
  | 'editorial-minimalist'
  | 'information-architecture'
  | 'modern-tool'
  | 'motion-experimental'
  | 'brutalist-raw'
  | 'warm-humanist'

export interface ThemeTokens {
  /** Page background. */
  background: string
  /** Raised surface (cards, sidebar, header). */
  surface: string
  /** Secondary surface (code blocks, hover states). */
  surfaceMuted: string
  /** Primary text. */
  text: string
  /** Secondary text. */
  textMuted: string
  /** Hairline border. */
  border: string
  /** Single accent color; use sparingly. */
  accent: string
  /** Text color on top of the accent. */
  accentText: string
  /** Syntax-highlight / inline-code text. */
  codeText: string
}

export interface PressTheme {
  /** Unique id referenced by `config.theme.default`. */
  id: string
  /** Display name in the theme switcher. */
  name: string
  /** One-line description shown as a tooltip. */
  description: string
  /** Design-school classification from the web-design-engineer recipe catalog. */
  school: DesignSchool
  /** Which color modes have hand-tuned tokens. */
  modes: ColorMode[]
  /** Light-mode token values. */
  light: ThemeTokens
  /** Dark-mode token values. */
  dark: ThemeTokens
  /** Optional font stacks; fall back to the UI defaults when omitted. */
  fonts?: {
    display?: string
    body?: string
    mono?: string
  }
  /** Border radius scale in pixels: [small, medium, large]. */
  radii?: [number, number, number]
  /** Extra CSS appended after the token layer (scoped by the theme id). */
  css?: string
}

/** Identity helper for authoring theme packages with full type-safety. */
export function defineTheme(theme: PressTheme): PressTheme {
  return theme
}

/** Convert a token object into CSS custom properties. */
export function tokensToCssVariables(tokens: ThemeTokens): Record<string, string> {
  return {
    '--tb-bg': tokens.background,
    '--tb-surface': tokens.surface,
    '--tb-surface-muted': tokens.surfaceMuted,
    '--tb-text': tokens.text,
    '--tb-text-muted': tokens.textMuted,
    '--tb-border': tokens.border,
    '--tb-accent': tokens.accent,
    '--tb-accent-text': tokens.accentText,
    '--tb-code-text': tokens.codeText,
  }
}
