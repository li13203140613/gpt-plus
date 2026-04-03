export const SUPPORTED_LOCALES = ['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'zh'

export interface LocaleConfig {
  currency: string
  currencySymbol: string
  price: number
  originalPrice: number
  priceOverride: number
  paymentMethods: string[]
  stripeLocale: string
}

export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  zh: {
    currency: 'cny',
    currencySymbol: '¥',
    price: 128,
    originalPrice: 145,
    priceOverride: 99,
    paymentMethods: ['card'],
    stripeLocale: 'zh',
  },
  en: {
    currency: 'usd',
    currencySymbol: '$',
    price: 17.99,
    originalPrice: 20.99,
    priceOverride: 13.99,
    paymentMethods: ['card'],
    stripeLocale: 'en',
  },
  ja: {
    currency: 'jpy',
    currencySymbol: '¥',
    price: 2680,
    originalPrice: 3100,
    priceOverride: 2080,
    paymentMethods: ['card'],
    stripeLocale: 'ja',
  },
  ko: {
    currency: 'krw',
    currencySymbol: '₩',
    price: 24800,
    originalPrice: 28800,
    priceOverride: 19200,
    paymentMethods: ['card'],
    stripeLocale: 'ko',
  },
  fr: {
    currency: 'eur',
    currencySymbol: '€',
    price: 16.99,
    originalPrice: 19.99,
    priceOverride: 12.99,
    paymentMethods: ['card'],
    stripeLocale: 'fr',
  },
  de: {
    currency: 'eur',
    currencySymbol: '€',
    price: 16.99,
    originalPrice: 19.99,
    priceOverride: 12.99,
    paymentMethods: ['card'],
    stripeLocale: 'de',
  },
  es: {
    currency: 'eur',
    currencySymbol: '€',
    price: 16.99,
    originalPrice: 19.99,
    priceOverride: 12.99,
    paymentMethods: ['card'],
    stripeLocale: 'es',
  },
}

export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE

  const lang = navigator.language?.toLowerCase() || ''

  if (lang.startsWith('zh')) return 'zh'
  if (lang.startsWith('ja')) return 'ja'
  if (lang.startsWith('ko')) return 'ko'
  if (lang.startsWith('fr')) return 'fr'
  if (lang.startsWith('de')) return 'de'
  if (lang.startsWith('es')) return 'es'
  if (lang.startsWith('en')) return 'en'

  return 'en' // fallback to English for unknown languages
}

export function formatPrice(locale: Locale, price: number): string {
  const config = LOCALE_CONFIGS[locale]
  if (config.currency === 'jpy' || config.currency === 'krw') {
    return `${config.currencySymbol}${price.toLocaleString()}`
  }
  if (locale === 'zh') {
    return `¥${price.toFixed(2)}`
  }
  if (config.currency === 'eur') {
    return `€${price.toFixed(2)}`
  }
  return `${config.currencySymbol}${price.toFixed(2)}`
}
