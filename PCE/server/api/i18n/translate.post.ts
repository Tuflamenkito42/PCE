import type { TranslationRequest, TranslationResponse } from '~/types/i18n'

// Map to convert between i18n locale codes and LibreTranslate language codes
const LOCALE_TO_LT: Record<string, string> = {
  es: 'es',
  ca: 'ca',
  eu: 'eu',
  gl: 'gl'
}

export default defineEventHandler(async (event): Promise<TranslationResponse> => {
  const body = await readBody<TranslationRequest>(event)
  const { text, targetLocale } = body

  // Validate input
  if (!text || !targetLocale) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing text or targetLocale'
    })
  }

  if (!LOCALE_TO_LT[targetLocale]) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unsupported locale'
    })
  }

  try {
    const candidates = [
      'http://libretranslate:5000/translate',
      'http://localhost:5000/translate'
    ]

    let lastError: unknown = null

    for (const url of candidates) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            q: text,
            source: 'es',
            target: LOCALE_TO_LT[targetLocale],
            format: 'text'
          })
        })

        if (!response.ok) {
          lastError = new Error(`LibreTranslate HTTP ${response.status}`)
          continue
        }

        const data = await response.json() as { translatedText?: string }
        if (!data.translatedText) {
          lastError = new Error('Empty translatedText in response')
          continue
        }

        return {
          success: true,
          translatedText: data.translatedText
        }
      } catch (error) {
        lastError = error
      }
    }

    console.error('Translation service unavailable:', lastError)
    throw createError({
      statusCode: 503,
      statusMessage: 'Translation service unavailable'
    })
  } catch (error) {
    console.error('Translation error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Translation failed'
    })
  }
})
