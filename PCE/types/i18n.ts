export type SupportedLocale = 'es' | 'ca' | 'eu' | 'gl'

export interface TranslationRequest {
  text: string
  targetLocale: SupportedLocale
}

export interface TranslationResponse {
  success: boolean
  translatedText: string
}

export interface CachedTranslations {
  [locale: string]: {
    [key: string]: string
  }
}

export interface LocaleOption {
  code: SupportedLocale
  name: string
  flag: string
}
