'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { DEFAULT_LOCALE, detectLocale, LOCALE_CONFIGS, SUPPORTED_LOCALES, type Locale, type LocaleConfig } from './config'
import { translations } from './locales'
import type { Translations } from './types'

const LOCALE_STORAGE_KEY = 'gptplus-locale'

interface LocaleContextValue {
  locale: Locale
  config: LocaleConfig
  t: Translations
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  config: LOCALE_CONFIGS[DEFAULT_LOCALE],
  t: translations[DEFAULT_LOCALE],
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    // Priority: localStorage saved choice > browser detection
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (saved && (SUPPORTED_LOCALES as readonly string[]).includes(saved)) {
      setLocaleState(saved as Locale)
    } else {
      const detected = detectLocale()
      if (detected !== locale) {
        setLocaleState(detected)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  }, [])

  const value: LocaleContextValue = {
    locale,
    config: LOCALE_CONFIGS[locale],
    t: translations[locale],
    setLocale,
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  return { locale: ctx.locale, config: ctx.config, setLocale: ctx.setLocale }
}

export function useT() {
  return useContext(LocaleContext).t
}
