/** Public, runtime-agnostic surface of TanStack Blog. */
export {
  defineConfig,
  type LocaleDefinition,
  localePrefix,
  type PressConfig,
  type PressConfigInput,
  pressConfigSchema,
  resolveConfig,
} from './config.js'
export {
  createTranslator,
  type Dictionary,
  registerDictionary,
  resolveLocale,
  switchLocaleRoute,
} from './i18n.js'
export {
  type ColorMode,
  type DesignSchool,
  defineTheme,
  type PressTheme,
  type ThemeTokens,
  tokensToCssVariables,
} from './theme/index.js'
