import type { CachedTranslations, SupportedLocale } from '~/types/i18n'

const CACHE_KEY = 'pce-translations'
const CACHE_EXPIRY_KEY = 'pce-translations-expiry'
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export const useTranslationCache = () => {
  const getCache = (): CachedTranslations | null => {
    if (!process.client) return null

    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY)

      if (!cached || !expiry) return null

      // Check if cache is expired
      if (Date.now() > parseInt(expiry)) {
        localStorage.removeItem(CACHE_KEY)
        localStorage.removeItem(CACHE_EXPIRY_KEY)
        return null
      }

      return JSON.parse(cached) as CachedTranslations
    } catch (error) {
      console.error('Error reading translation cache:', error)
      return null
    }
  }

  const setCache = (translations: CachedTranslations) => {
    if (!process.client) return

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(translations))
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString())
    } catch (error) {
      console.error('Error setting translation cache:', error)
    }
  }

  const getCachedTranslation = (locale: SupportedLocale, key: string): string | null => {
    const cache = getCache()
    return cache?.[locale]?.[key] ?? null
  }

  const setCachedTranslation = (locale: SupportedLocale, key: string, value: string) => {
    const cache = getCache() || {}

    if (!cache[locale]) {
      cache[locale] = {}
    }

    cache[locale][key] = value
    setCache(cache)
  }

  const clearCache = () => {
    if (!process.client) return
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_EXPIRY_KEY)
  }

  return {
    getCache,
    setCache,
    getCachedTranslation,
    setCachedTranslation,
    clearCache
  }
}
