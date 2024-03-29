import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import translation files
import translationEN from './English.json'
import translationFR from './French.json'
const languageKey = 'selectedLanguage'

let storedLanguage
if (typeof window !== 'undefined') {
  storedLanguage = localStorage.getItem(languageKey)
}
const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
}
const detectionOptions = {
  // order and from where user language should be detected
  order: ['localStorage', 'navigator'],

  // keys or params to lookup language from
  lookupLocalStorage: 'i18nextLng',

  // cache user language on
  caches: ['localStorage'],
}
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: storedLanguage ?? 'en-US',
    // debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en-US', // use English if user language is not available
    detection: detectionOptions,
  })

// Set up an event listener to update the stored language when it changes
if (typeof window !== 'undefined') {
  i18n.on('languageChanged', (lang) => {
    localStorage.setItem(languageKey, lang)
  })
}

export default i18n