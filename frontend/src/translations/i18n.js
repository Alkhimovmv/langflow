import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
 
import { TRANSLATIONS_RU } from "./ru/translations";
import { TRANSLATIONS_GB } from "./gb/translations";
import { TRANSLATIONS_FR } from "./fr/translations";
import { TRANSLATIONS_UA } from "./ua/translations";
import { TRANSLATIONS_RS } from "./rs/translations";
 
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: TRANSLATIONS_RU
      },
      gb: {
        translation: TRANSLATIONS_GB
      },
      fr: {
        translation: TRANSLATIONS_FR
      },
      ua: {
        translation: TRANSLATIONS_UA
      },
      rs: {
        translation: TRANSLATIONS_RS
      }
    }
});

export default i18n