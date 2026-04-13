import type { SupportedLocale } from '~/types/i18n'
import { translations } from '~/utils/i18n'

/**
 * Composable helper para traducción automática de textos
 * 
 * Ejemplo de uso:
 * 
 * const { t } = useAutoTranslate()
 * const title = await t('home.welcome', 'Protección Civil Española...')
 * 
 * Ventajas:
 * - Usa caché automáticamente
 * - Sin necesidad de watchers manuales
 * - Mejor para traducciones bulk
 */
export const useAutoTranslate = () => {
  const { locale, translateString } = useI18n()
  const cache = useTranslationCache()

  /**
   * Traduce un texto manteniendo referencia al idioma base
   */
  const t = async (key: string, spanishText: string): Promise<string> => {
    // Si estamos en español, devuelve el texto original
    if (locale.value === 'es') {
      return spanishText
    }

    // Intenta obtener del caché primero
    const cached = cache.getCachedTranslation(locale.value, key)
    if (cached) return cached

    // Si no está en caché, pide traducción al backend
    return await translateString(key, spanishText)
  }

  /**
   * Traduce múltiples strings a la vez
   * 
   * Ejemplo:
   * const { title, desc } = await tMultiple({
   *   title: ['key1', 'Título en español'],
   *   desc: ['key2', 'Descripción en español']
   * })
   */
  const tMultiple = async (
    strings: Record<string, [string, string]>
  ): Promise<Record<string, string>> => {
    const result: Record<string, string> = {}

    await Promise.all(
      Object.entries(strings).map(async ([field, [key, text]]) => {
        result[field] = await t(key, text)
      })
    )

    return result
  }

  /**
   * Reactivo: devuelve la traducción actualizada cuando cambia de idioma
   */
  const tRef = (key: string, spanishText: string) => {
    const translated = ref(spanishText)

    const update = async () => {
      translated.value = await t(key, spanishText)
    }

    watch(locale, update, { immediate: true })

    return translated
  }

  /**
   * Computed que traduce automáticamente un texto
   */
  const tComputed = (key: string, spanishText: string) => {
    return computed(async () => {
      return await t(key, spanishText)
    })
  }

  return {
    t,
    tMultiple,
    tRef,
    tComputed,
    locale,
    isSpanish: computed(() => locale.value === 'es')
  }
}
