import { localeOptions, translations, type SupportedLocale } from '~/utils/i18n'
import type { CachedTranslations } from '~/types/i18n'

const STORAGE_KEY = 'pce-locale'
const TRANSLATED_STRINGS_KEY = 'pce-translated-strings'

const isSupportedLocale = (value: string): value is SupportedLocale => {
  return localeOptions.some(locale => locale.code === value)
}

export const useI18n = () => {
  let initialLocale: SupportedLocale = 'es'
  const localeCookie = useCookie<SupportedLocale>(STORAGE_KEY, {
    default: () => 'es',
    sameSite: 'lax',
    path: '/'
  })

  const cookieLocale = localeCookie.value
  if (cookieLocale && isSupportedLocale(cookieLocale)) {
    initialLocale = cookieLocale
  }

  if (process.client) {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && isSupportedLocale(saved)) {
      initialLocale = saved
    }
  }

  const locale = useState<SupportedLocale>('pce-locale', () => initialLocale)
  const translatedStrings = useState<CachedTranslations>('pce-translated-strings', () => {
    if (!process.client) return {}
    const stored = localStorage.getItem(TRANSLATED_STRINGS_KEY)
    return stored ? (JSON.parse(stored) as CachedTranslations) : {}
  })

  // Evita lanzar la misma traduccion varias veces en paralelo.
  const pendingTranslations = useState<Record<string, Promise<string>>>('pce-pending-translations', () => ({}))

  const setLocale = (value: SupportedLocale) => {
    locale.value = value
    localeCookie.value = value

    if (process.client) {
      localStorage.setItem(STORAGE_KEY, value)
    }
  }

  const persistCache = () => {
    if (!process.client) return
    localStorage.setItem(TRANSLATED_STRINGS_KEY, JSON.stringify(translatedStrings.value))
  }

  const translateString = async (key: string, spanishText: string): Promise<string> => {
    if (locale.value === 'es') return spanishText

    const cached = translatedStrings.value[locale.value]?.[key]
    if (cached) return cached

    const pendingKey = `${locale.value}:${key}`
    const existingPending = pendingTranslations.value[pendingKey]
    if (existingPending) {
      return existingPending
    }

    const promise = (async () => {
      try {
        const response = await $fetch<{ success: boolean; translatedText: string }>('/api/i18n/translate', {
          method: 'POST',
          body: {
            text: spanishText,
            targetLocale: locale.value
          }
        })

        if (response.success && response.translatedText) {
          if (!translatedStrings.value[locale.value]) {
            translatedStrings.value[locale.value] = {}
          }
          translatedStrings.value[locale.value][key] = response.translatedText
          persistCache()
          return response.translatedText
        }
      } catch (error) {
        console.error(`Translation failed for ${key}:`, error)
      } finally {
        delete pendingTranslations.value[pendingKey]
      }

      return spanishText
    })()

    pendingTranslations.value[pendingKey] = promise
    return promise
  }

  const t = (key: string): string => {
    const spanishText = translations.es?.[key] ?? key

    if (locale.value === 'es') {
      return spanishText
    }

    // Si existe traduccion estatica en el diccionario, usarla primero.
    const staticTranslated = translations[locale.value]?.[key]
    if (staticTranslated) {
      return staticTranslated
    }

    const cached = translatedStrings.value[locale.value]?.[key]
    if (cached) return cached

    // Traduccion lazy: solo se pide cuando una clave se renderiza.
    void translateString(key, spanishText)
    return spanishText
  }

  const tReactive = (key: string) => {
    return computed(() => t(key))
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
    tReactive,
    translateString,
    supportedLocales: localeOptions,
    translatedStrings
  }
}
