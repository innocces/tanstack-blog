/**
 * The 25 anchored recipes from the web-design-engineer style catalog,
 * expressed as the framework's token contract.
 *
 * Flagship recipes have hand-authored light AND dark values. The remaining
 * recipes provide their native palette plus a generated complementary mode,
 * so every theme works with the dark/light toggle out of the box.
 *
 @see /Users/xijiang/.agents/skills/web-design-engineer/references/style-recipes/INDEX.md
 */
import {
  type DesignSchool,
  defineTheme,
  type PressTheme,
  type ThemeTokens,
} from '@tanstack-blog/core'

type Mode = 'light' | 'dark'

interface Palette {
  bg: string
  surface: string
  surfaceMuted: string
  text: string
  textMuted: string
  border: string
  accent: string
  accentText?: string
  codeText?: string
}

interface Recipe {
  id: string
  name: string
  school: DesignSchool
  description: string
  /** Which mode the source recipe specifies. The other mode is generated. */
  base: Mode
  palette: Palette
  /** Optional hand-authored complementary mode. */
  inverse?: Palette
  fonts?: PressTheme['fonts']
  radii?: [number, number, number]
  css?: string
}

const LIGHT_INVERSE: Palette = {
  bg: '#FFFFFF',
  surface: '#F5F5F7',
  surfaceMuted: '#E8E8EA',
  text: '#1A1A1A',
  textMuted: '#6B6B70',
  border: 'rgba(0,0,0,0.10)',
  accent: '#5E6AD2',
  accentText: '#FFFFFF',
  codeText: '#5E6AD2',
}

const DARK_INVERSE: Palette = {
  bg: '#08090A',
  surface: '#16171C',
  surfaceMuted: '#1E1F25',
  text: '#F7F8F8',
  textMuted: '#9CA3AF',
  border: 'rgba(255,255,255,0.08)',
  accent: '#5E6AD2',
  accentText: '#FFFFFF',
  codeText: '#A78BFA',
}

function toTokens(palette: Palette): ThemeTokens {
  return {
    background: palette.bg,
    surface: palette.surface,
    surfaceMuted: palette.surfaceMuted,
    text: palette.text,
    textMuted: palette.textMuted,
    border: palette.border,
    accent: palette.accent,
    accentText: palette.accentText ?? '#FFFFFF',
    codeText: palette.codeText ?? palette.accent,
  }
}

function build(recipe: Recipe): PressTheme {
  const isLight = recipe.base === 'light'
  const native = toTokens(recipe.palette)
  const generated = toTokens(recipe.inverse ?? (isLight ? DARK_INVERSE : LIGHT_INVERSE))
  return defineTheme({
    id: recipe.id,
    name: recipe.name,
    school: recipe.school,
    description: recipe.description,
    modes: ['light', 'dark'],
    light: isLight ? native : generated,
    dark: isLight ? generated : native,
    fonts: recipe.fonts,
    radii: recipe.radii ?? [6, 12, 16],
    css: recipe.css,
  })
}

/** Compact recipe table. Each entry mirrors one file in the style catalog. */
const recipes: Recipe[] = [
  // --- Modern Tool / Builder SaaS -----------------------------------------
  {
    id: 'linear',
    name: 'Linear',
    school: 'modern-tool',
    base: 'dark',
    description:
      'Warm near-black, hairline borders, a single violet accent. The default docs theme.',
    palette: {
      bg: '#08090A',
      surface: '#16171C',
      surfaceMuted: '#1E1F25',
      text: '#F7F8F8',
      textMuted: '#9CA3AF',
      border: 'rgba(255,255,255,0.06)',
      accent: '#5E6AD2',
      codeText: '#A78BFA',
    },
    inverse: {
      bg: '#FFFFFF',
      surface: '#F7F8F9',
      surfaceMuted: '#ECEEF1',
      text: '#16171C',
      textMuted: '#6B7280',
      border: 'rgba(0,0,0,0.08)',
      accent: '#5E6AD2',
      codeText: '#4C3FA8',
    },
    fonts: {
      display: "'Inter Tight', sans-serif",
      body: "'Inter Tight', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    radii: [6, 12, 16],
  },
  {
    id: 'vercel',
    name: 'Vercel Mesh',
    school: 'modern-tool',
    base: 'dark',
    description: 'True black and white precision with a restrained cyan-to-orange mesh.',
    palette: {
      bg: '#000000',
      surface: '#0A0A0A',
      surfaceMuted: '#111111',
      text: '#EDEDED',
      textMuted: '#888888',
      border: 'rgba(255,255,255,0.08)',
      accent: '#0070F3',
      codeText: '#79C0FF',
    },
    radii: [8, 12, 16],
  },
  {
    id: 'raycast',
    name: 'Raycast',
    school: 'modern-tool',
    base: 'dark',
    description: 'Glassy command-palette surfaces with a punchy coral-red accent.',
    palette: {
      bg: '#0F0F11',
      surface: 'rgba(255,255,255,0.06)',
      surfaceMuted: 'rgba(255,255,255,0.10)',
      text: '#FFFFFF',
      textMuted: '#B0B3B8',
      border: 'rgba(255,255,255,0.10)',
      accent: '#FF6363',
      codeText: '#FF9E9E',
    },
    radii: [8, 12, 16],
  },
  {
    id: 'notion',
    name: 'Notion (Classic)',
    school: 'modern-tool',
    base: 'light',
    description: 'Warm cream surfaces, soft shadows and quiet ink. Friendly documentation feel.',
    palette: {
      bg: '#FFFFFF',
      surface: '#F7F6F3',
      surfaceMuted: '#E9E9E7',
      text: '#37352F',
      textMuted: '#787774',
      border: '#E9E9E7',
      accent: '#2383E2',
      codeText: '#9B2C6E',
    },
    radii: [4, 8, 16],
  },

  // --- Editorial / Minimalist ---------------------------------------------
  {
    id: 'muji',
    name: 'MUJI / Kenya Hara',
    school: 'editorial-minimalist',
    base: 'light',
    description: 'Emptiness as fullness. Warm paper, hard edges, no shadow, almost no accent.',
    palette: {
      bg: '#F4F2EC',
      surface: '#FBF9F4',
      surfaceMuted: '#EAE7DE',
      text: '#2A2A28',
      textMuted: '#7C7B76',
      border: '#D9D6CD',
      accent: '#C8161D',
      codeText: '#C8161D',
    },
    inverse: {
      bg: '#121211',
      surface: '#1C1C1A',
      surfaceMuted: '#262623',
      text: '#EFEDE6',
      textMuted: '#9C9A92',
      border: 'rgba(255,255,255,0.10)',
      accent: '#E05256',
      codeText: '#E05256',
    },
    radii: [0, 0, 0],
    css: '.tb-markdown h2{border-bottom:1px solid var(--tb-border)}',
  },
  {
    id: 'apple',
    name: 'Apple HIG',
    school: 'editorial-minimalist',
    base: 'light',
    description: 'Paper-pure white, generous space and a single system-blue accent.',
    palette: {
      bg: '#FFFFFF',
      surface: '#F5F5F7',
      surfaceMuted: '#EBEBED',
      text: '#1D1D1F',
      textMuted: '#86868B',
      border: 'rgba(0,0,0,0.08)',
      accent: '#0071E3',
      codeText: '#0071E3',
    },
    radii: [12, 18, 22],
  },
  {
    id: 'aesop',
    name: 'Aesop',
    school: 'editorial-minimalist',
    base: 'light',
    description: 'Apothecary refinement: chamois ground, sage text and an amber seal.',
    palette: {
      bg: '#E8E4D9',
      surface: '#F0EDE4',
      surfaceMuted: '#DDD8CA',
      text: '#1B1B1B',
      textMuted: '#7A8470',
      border: '#CFC9B8',
      accent: '#7A4623',
      codeText: '#7A4623',
    },
    radii: [0, 0, 0],
  },
  {
    id: 'braun',
    name: 'Dieter Rams / Braun',
    school: 'editorial-minimalist',
    base: 'light',
    description: 'Less but better. Concrete gray, industrial orange, near-zero radius.',
    palette: {
      bg: '#F5F4F0',
      surface: '#E4E1DC',
      surfaceMuted: '#D6D2CA',
      text: '#191919',
      textMuted: '#5C5C5C',
      border: '#C4C1BA',
      accent: '#E96A26',
      codeText: '#B54A12',
    },
    radii: [2, 3, 4],
  },
  {
    id: 'monocle',
    name: 'Monocle Magazine',
    school: 'editorial-minimalist',
    base: 'light',
    description: 'Cream paper, magazine-grade hierarchy and a signature editorial red.',
    palette: {
      bg: '#F2EFE7',
      surface: '#FAF8F2',
      surfaceMuted: '#E7E3D6',
      text: '#1A1A1A',
      textMuted: '#5E6347',
      border: '#C8C2B0',
      accent: '#C7322E',
      codeText: '#C7322E',
    },
    radii: [0, 0, 0],
  },

  // --- Information Architecture -------------------------------------------
  {
    id: 'pentagram',
    name: 'Pentagram',
    school: 'information-architecture',
    base: 'light',
    description: 'Bold two-color typographic identity. Type does all the visual work.',
    palette: {
      bg: '#FFFFFF',
      surface: '#F4F1E7',
      surfaceMuted: '#E9E5D8',
      text: '#000000',
      textMuted: '#555555',
      border: '#000000',
      accent: '#1E3FFF',
      codeText: '#1E3FFF',
    },
    radii: [0, 0, 0],
  },
  {
    id: 'swiss',
    name: 'Vignelli / Swiss',
    school: 'information-architecture',
    base: 'light',
    description: 'Strict grid, Helvetica throughout, one signal red. Static by nature.',
    palette: {
      bg: '#FFFFFF',
      surface: '#F4F4F4',
      surfaceMuted: '#E8E8E8',
      text: '#000000',
      textMuted: '#8A8A8A',
      border: '#000000',
      accent: '#E2231A',
      codeText: '#E2231A',
    },
    radii: [0, 0, 0],
  },
  {
    id: 'bloomberg-terminal',
    name: 'Bloomberg Terminal',
    school: 'information-architecture',
    base: 'dark',
    description: 'Maximum data-ink. Chrome-amber on deep navy with dense monospaced type.',
    palette: {
      bg: '#0A0E1A',
      surface: '#11172A',
      surfaceMuted: '#1A2138',
      text: '#E8ECF4',
      textMuted: '#5E6680',
      border: 'rgba(255,255,255,0.10)',
      accent: '#FFA02F',
      codeText: '#FFA02F',
    },
    fonts: {
      display: "'JetBrains Mono', monospace",
      body: "'IBM Plex Mono', 'JetBrains Mono', monospace",
      mono: "'JetBrains Mono', monospace",
    },
    radii: [0, 2, 2],
  },
  {
    id: 'tufte',
    name: 'Edward Tufte',
    school: 'information-architecture',
    base: 'light',
    description: 'Maximum data-ink on warm paper. Two data colors, no ornament, no motion.',
    palette: {
      bg: '#FBFAF6',
      surface: '#F3F0E7',
      surfaceMuted: '#EAE5D8',
      text: '#1B1B1A',
      textMuted: '#5C5550',
      border: '#D8D2C2',
      accent: '#A6300E',
      codeText: '#3E4A5C',
    },
    radii: [0, 0, 0],
  },
  {
    id: 'nyt',
    name: 'New York Times',
    school: 'information-architecture',
    base: 'light',
    description:
      'Broadsheet authority. Serif body, hairline rules and a sparing breaking-news red.',
    palette: {
      bg: '#FFFFFF',
      surface: '#F7F7F7',
      surfaceMuted: '#EFEFEF',
      text: '#121212',
      textMuted: '#666666',
      border: '#E2E2E2',
      accent: '#D0021B',
      codeText: '#D0021B',
    },
    radii: [0, 0, 0],
  },

  // --- Motion / Experimental ----------------------------------------------
  {
    id: 'field-io',
    name: 'Field.io',
    school: 'motion-experimental',
    base: 'dark',
    description: 'Generative identity energy: deep black with cyan-to-violet motion hues.',
    palette: {
      bg: '#0B0B0F',
      surface: '#14141B',
      surfaceMuted: '#1D1D27',
      text: '#FFFFFF',
      textMuted: '#A0A4B0',
      border: 'rgba(255,255,255,0.10)',
      accent: '#0CE0E5',
      codeText: '#5B8BFF',
    },
    radii: [0, 0, 0],
  },
  {
    id: 'active-theory',
    name: 'Active Theory',
    school: 'motion-experimental',
    base: 'dark',
    description: 'Cinematic stage: deep black, one dramatic signature hue, tinted neutrals.',
    palette: {
      bg: '#05070B',
      surface: '#0E1420',
      surfaceMuted: '#16202F',
      text: '#F4F7FF',
      textMuted: '#93A3BC',
      border: 'rgba(255,255,255,0.10)',
      accent: '#4C7DFF',
      codeText: '#8FB0FF',
    },
    radii: [0, 0, 0],
  },
  {
    id: 'resn',
    name: 'Resn Storytelling',
    school: 'motion-experimental',
    base: 'light',
    description: 'Composition-driven storytelling with warm/cool contrast.',
    palette: {
      bg: '#F3EDE3',
      surface: '#FFF9F0',
      surfaceMuted: '#E6DCCB',
      text: '#211E1A',
      textMuted: '#6F6558',
      border: '#D4C6B2',
      accent: '#D6602E',
      codeText: '#2E6F86',
    },
  },

  // --- Brutalist / Raw -----------------------------------------------------
  {
    id: 'are-na',
    name: 'Are.na',
    school: 'brutalist-raw',
    base: 'light',
    description: 'Honest web styling. System fonts, classic browser blue, zero chrome.',
    palette: {
      bg: '#FFFFFF',
      surface: '#F4F1E8',
      surfaceMuted: '#EAE7DE',
      text: '#000000',
      textMuted: '#555555',
      border: '#CCCCCC',
      accent: '#0000EE',
      codeText: '#0000EE',
    },
    fonts: {
      display: 'Georgia, serif',
      body: 'system-ui, sans-serif',
      mono: 'ui-monospace, monospace',
    },
    radii: [0, 0, 0],
  },
  {
    id: 'businessweek',
    name: 'Bloomberg Businessweek',
    school: 'brutalist-raw',
    base: 'light',
    description: 'Typographic violence. High-alert orange on white, maximum three colors.',
    palette: {
      bg: '#FFFFFF',
      surface: '#F4F4F4',
      surfaceMuted: '#E8E8E8',
      text: '#000000',
      textMuted: '#444444',
      border: '#000000',
      accent: '#FF3D00',
      codeText: '#001AFF',
    },
    radii: [0, 0, 0],
  },
  {
    id: 'balenciaga',
    name: 'Balenciaga',
    school: 'brutalist-raw',
    base: 'light',
    description: 'Default browser styling weaponized. Helvetica only, no color, no rounding.',
    palette: {
      bg: '#FFFFFF',
      surface: '#F5F4F0',
      surfaceMuted: '#EAE9E4',
      text: '#000000',
      textMuted: '#555555',
      border: '#000000',
      accent: '#000000',
      accentText: '#FFFFFF',
      codeText: '#000000',
    },
    fonts: {
      display: 'Helvetica, Arial, sans-serif',
      body: 'Helvetica, Arial, sans-serif',
      mono: 'monospace',
    },
    radii: [0, 0, 0],
  },

  // --- Warm Humanist -------------------------------------------------------
  {
    id: 'stripe-press',
    name: 'Stripe Press',
    school: 'warm-humanist',
    base: 'light',
    description: 'Books as objects. Cream, warm ink and a single foil-stamp teal.',
    palette: {
      bg: '#F1ECDE',
      surface: '#E6DCC4',
      surfaceMuted: '#DCD1B6',
      text: '#1A1A18',
      textMuted: '#736D5A',
      border: '#C8BEA4',
      accent: '#1B4B5A',
      codeText: '#A04A2A',
    },
    inverse: {
      bg: '#171912',
      surface: '#22261A',
      surfaceMuted: '#2D3222',
      text: '#F3EEDF',
      textMuted: '#B9B39B',
      border: 'rgba(243,238,223,0.14)',
      accent: '#7FC1CF',
      codeText: '#D9916C',
    },
    radii: [0, 0, 0],
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp (Freddie)',
    school: 'warm-humanist',
    base: 'light',
    description: 'Warm yellow, personality in microcopy and soft, rounded cards.',
    palette: {
      bg: '#FFFFFF',
      surface: '#FBEFE3',
      surfaceMuted: '#F4E3D2',
      text: '#241C15',
      textMuted: '#88837C',
      border: '#E8D9C9',
      accent: '#FF4D74',
      codeText: '#B33B58',
    },
    radii: [8, 16, 24],
  },
  {
    id: 'headspace',
    name: 'Headspace',
    school: 'warm-humanist',
    base: 'light',
    description: 'Soft peach, warm teal ink and buoyant, pill-shaped controls.',
    palette: {
      bg: '#FFE2C5',
      surface: '#FFF1DF',
      surfaceMuted: '#F4D4B5',
      text: '#1B3A47',
      textMuted: '#5C6B7A',
      border: '#EFC7A3',
      accent: '#B0A5D1',
      codeText: '#3D6E70',
    },
    radii: [16, 24, 32],
  },

  // --- Specialty / Genre ---------------------------------------------------
  {
    id: 'y2k',
    name: 'Y2K Retrofuturism',
    school: 'motion-experimental',
    base: 'light',
    description: 'Chrome, glassy bubbles and iridescent cyan/magenta. Fully committed.',
    palette: {
      bg: '#A3D5FF',
      surface: '#E0E4EA',
      surfaceMuted: '#C4C9D2',
      text: '#000000',
      textMuted: '#33506B',
      border: 'rgba(255,255,255,0.6)',
      accent: '#FF66C4',
      codeText: '#5FC9F8',
    },
    radii: [16, 24, 999],
  },
  {
    id: 'mid-century',
    name: 'Mid-Century Modern',
    school: 'editorial-minimalist',
    base: 'light',
    description: 'Paul Rand / Saul Bass geometry: mustard, brick and cream. Flat shapes only.',
    palette: {
      bg: '#EBE3D2',
      surface: '#F5EFE1',
      surfaceMuted: '#DCD2BC',
      text: '#1A1A18',
      textMuted: '#6B6252',
      border: '#C7BCA5',
      accent: '#D9A441',
      codeText: '#A34B32',
    },
    radii: [0, 0, 0],
  },
]

/** All 25 presets, ordered to match the recipe catalog. */
export const allThemes: PressTheme[] = recipes.map(build)

/** The six themes with hand-authored light and dark palettes. */
export const flagshipThemes = allThemes.filter((theme) =>
  ['linear', 'muji', 'stripe-press', 'bloomberg-terminal', 'are-na', 'headspace'].includes(
    theme.id,
  ),
)

export function getTheme(id: string): PressTheme | undefined {
  return allThemes.find((theme) => theme.id === id)
}

export function themesBySchool(school: DesignSchool): PressTheme[] {
  return allThemes.filter((theme) => theme.school === school)
}

export const defaultTheme = getTheme('linear')!
