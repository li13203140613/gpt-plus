import type { Locale } from '../config'
import type { Translations } from '../types'
import { zh } from './zh'
import { en } from './en'
import { ja } from './ja'
import { ko } from './ko'
import { fr } from './fr'
import { de } from './de'
import { es } from './es'

export const translations: Record<Locale, Translations> = {
  zh,
  en,
  ja,
  ko,
  fr,
  de,
  es,
}
