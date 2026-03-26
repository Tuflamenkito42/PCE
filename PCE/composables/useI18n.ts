import { localeOptions, translations, type SupportedLocale } from '~/utils/i18n'

const STORAGE_KEY = 'pce-locale'

const isSupportedLocale = (value: string): value is SupportedLocale => {
  return localeOptions.some(locale => locale.code === value)
}

export const useI18n = () => {
  // Inicializar con localStorage en client-side
  let initialLocale = 'es' as SupportedLocale
  if (process.client) {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && isSupportedLocale(saved)) {
      initialLocale = saved
    }
  }

  const locale = useState<SupportedLocale>('pce-locale', () => initialLocale)

  const setLocale = (value: SupportedLocale) => {
    locale.value = value

    if (process.client) {
      localStorage.setItem(STORAGE_KEY, value)
    }
  }

  const t = (key: string) => {
    return translations[locale.value][key] ?? translations.es[key] ?? key
  }

  watch(
    locale,
    (value) => {
      if (process.client) {
        document.documentElement.lang = value
      }
    },
    { immediate: true }
  )

  return {
    locale,
    setLocale,
    t,
    supportedLocales: localeOptions
  }
}
