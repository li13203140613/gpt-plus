'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_LOCALE, detectLocale, LOCALE_CONFIGS, type Locale, type LocaleConfig } from './config'
import { translations } from './locales'
import type { Translations } from './types'

interface LocaleContextValue {
  locale: Locale
  config: LocaleConfig
  t: Translations
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  config: LOCALE_CONFIGS[DEFAULT_LOCALE],
  t: translations[DEFAULT_LOCALE],
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const detected = detectLocale()
    if (detected !== locale) {
      setLocale(detected)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale
  }, [locale])

  const value: LocaleContextValue = {
    locale,
    config: LOCALE_CONFIGS[locale],
    t: translations[locale],
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  return { locale: ctx.locale, config: ctx.config }
}

export function useT() {
  return useContext(LocaleContext).t
}
