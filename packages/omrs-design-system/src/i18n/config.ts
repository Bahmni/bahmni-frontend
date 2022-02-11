import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './translations/en.json'
import hi from './translations/hi.json'

export const resources = {
  en: {
    en,
  },
  hi: {
    hi,
  },
} as const

i18n.use(initReactI18next).use(LanguageDetector).init({
  fallbackLng: 'en',
  // debug: true,
  resources,
})

export default i18n
