import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources
const resources = {
  en: {
    translation: {
      welcome: "Welcome to SkillHub",
      description: "Your gateway to shared learning resources.",
      login: "Login",
      logout: "Logout",
      save: "Save",
      saved_success: "Saved successfully!",
    },
  },
  hi: {
    translation: {
      welcome: "SkillHub में आपका स्वागत है",
      description: "आपके साझा शिक्षण संसाधनों का प्रवेशद्वार।",
      login: "लॉग इन करें",
      logout: "लॉग आउट",
      save: "सहेजें",
      saved_success: "सफलतापूर्वक सहेजा गया!",
    },
  },
};

i18n
  .use(LanguageDetector) // Detects language from browser
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
