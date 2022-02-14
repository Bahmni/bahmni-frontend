import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './translations/en.json'
import hi from './translations/hi.json'

export const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
} as const

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug:
      process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
    resources,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
