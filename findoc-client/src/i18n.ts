import i18n from "i18next";

import {
  initReactI18next,
} from "react-i18next";

import {
  westernEuropeTranslations,
} from "./locales/westernEurope";

import {
  centralEuropeTranslations,
} from "./locales/centralEurope";

import {
  easternEuropeTranslations,
} from "./locales/easternEurope";

import {
  northernEuropeTranslations,
} from "./locales/northernEurope";

import {
  remainingEuropeTranslations,
} from "./locales/remainingEurope";

import {
  extendedEuropeTranslations,
} from "./locales/extendedEurope";

import {
  uiOptionTranslations,
} from "./locales/uiOptions";


export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}


/* =====================================================
   SUPPORTED EUROPEAN LANGUAGES
===================================================== */

export const supportedLanguages:
  SupportedLanguage[] = [
  {
    code: "el",
    name: "Greek",
    nativeName: "Ελληνικά",
  },

  {
    code: "en",
    name: "English",
    nativeName: "English",
  },

  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
  },

  {
    code: "fr",
    name: "French",
    nativeName: "Français",
  },

  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
  },

  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
  },

  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
  },

  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
  },

  {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
  },

  {
    code: "ro",
    name: "Romanian",
    nativeName: "Română",
  },

  {
    code: "bg",
    name: "Bulgarian",
    nativeName: "Български",
  },

  {
    code: "cs",
    name: "Czech",
    nativeName: "Čeština",
  },

  {
    code: "sk",
    name: "Slovak",
    nativeName: "Slovenčina",
  },

  {
    code: "hu",
    name: "Hungarian",
    nativeName: "Magyar",
  },

  {
    code: "hr",
    name: "Croatian",
    nativeName: "Hrvatski",
  },

  {
    code: "sl",
    name: "Slovenian",
    nativeName: "Slovenščina",
  },

  {
    code: "sr",
    name: "Serbian",
    nativeName: "Српски",
  },

  {
    code: "bs",
    name: "Bosnian",
    nativeName: "Bosanski",
  },

  {
    code: "sq",
    name: "Albanian",
    nativeName: "Shqip",
  },

  {
    code: "mk",
    name: "Macedonian",
    nativeName: "Македонски",
  },

  {
    code: "uk",
    name: "Ukrainian",
    nativeName: "Українська",
  },

  {
    code: "be",
    name: "Belarusian",
    nativeName: "Беларуская",
  },

  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
  },

  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
  },

  {
    code: "da",
    name: "Danish",
    nativeName: "Dansk",
  },

  {
    code: "fi",
    name: "Finnish",
    nativeName: "Suomi",
  },

  {
    code: "no",
    name: "Norwegian",
    nativeName: "Norsk",
  },

  {
    code: "is",
    name: "Icelandic",
    nativeName: "Íslenska",
  },

  {
    code: "et",
    name: "Estonian",
    nativeName: "Eesti",
  },

  {
    code: "lv",
    name: "Latvian",
    nativeName: "Latviešu",
  },

  {
    code: "lt",
    name: "Lithuanian",
    nativeName: "Lietuvių",
  },

  {
    code: "ga",
    name: "Irish",
    nativeName: "Gaeilge",
  },

  {
    code: "mt",
    name: "Maltese",
    nativeName: "Malti",
  },

  {
    code: "ca",
    name: "Catalan",
    nativeName: "Català",
  },

  {
    code: "eu",
    name: "Basque",
    nativeName: "Euskara",
  },

  {
    code: "gl",
    name: "Galician",
    nativeName: "Galego",
  },

  {
    code: "cy",
    name: "Welsh",
    nativeName: "Cymraeg",
  },

  {
    code: "lb",
    name: "Luxembourgish",
    nativeName: "Lëtzebuergesch",
  },

  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
  },

  {
    code: "rm",
    name: "Romansh",
    nativeName: "Rumantsch",
  },

  {
    code: "fo",
    name: "Faroese",
    nativeName: "Føroyskt",
  },

  {
    code: "hy",
    name: "Armenian",
    nativeName: "Հայերեն",
  },

  {
    code: "ka",
    name: "Georgian",
    nativeName: "ქართული",
  },

  {
    code: "az",
    name: "Azerbaijani",
    nativeName: "Azərbaycanca",
  },

  {
    code: "cnr",
    name: "Montenegrin",
    nativeName: "Crnogorski",
  },
];


/* =====================================================
   INITIAL LANGUAGE
===================================================== */

function getInitialLanguage(): string {
  const savedLanguage =
    localStorage.getItem(
      "findoc_language"
    );

  if (
    savedLanguage &&
    supportedLanguages.some(
      language =>
        language.code ===
        savedLanguage
    )
  ) {
    return savedLanguage;
  }

  const browserLanguage =
    navigator.language
      .split("-")[0]
      .toLowerCase();

  const browserSupported =
    supportedLanguages.some(
      language =>
        language.code ===
        browserLanguage
    );

  if (browserSupported) {
    return browserLanguage;
  }

  return "el";
}


/* =====================================================
   GREEK TRANSLATIONS
===================================================== */

const greekTranslations = {
  translation: {
    common: {
      appName: "Findoc",
      search: "Αναζήτηση",
      close: "Κλείσιμο",
      cancel: "Ακύρωση",
      save: "Αποθήκευση",
      loading: "Φόρτωση...",
      back: "Πίσω",
      next: "Επόμενο",
      yes: "Ναι",
      no: "Όχι",
    },

    nav: {
      findDoctor:
        "Βρες γιατρό",

      howItWorks:
        "Πώς λειτουργεί",

      forDoctors:
        "Για γιατρούς",

      login:
        "Σύνδεση",

      logout:
        "Έξοδος",

      myAppointments:
        "Τα ραντεβού μου",
    },

    hero: {
      badge:
        "Η υγεία σου, πιο απλά",

      title:
        "Ο σωστός γιατρός.",

      subtitle:
        "Τη στιγμή που τον χρειάζεσαι.",

      description:
        "Βρες διαθέσιμους γιατρούς κοντά σου, σύγκρινε αξιολογήσεις και κλείσε ραντεβού online.",
    },

    filters: {
      specialty:
        "Ειδικότητα",

      city:
        "Πόλη",

      area:
        "Περιοχή",

      insurance:
        "Ασφάλιση",

      maxPrice:
        "Μέγιστη τιμή",

      rating:
        "Αξιολόγηση",

      language:
        "Γλώσσα",

      sort:
        "Ταξινόμηση",

      onlineOnly:
        "Online συνεδρία",

      verifiedOnly:
        "Επαληθευμένοι",

      clear:
        "Καθαρισμός φίλτρων",

      all:
        "Όλα",
    },

    booking: {
      book:
        "Κλείσε ραντεβού",

      confirm:
        "Επιβεβαίωση ραντεβού",

      success:
        "Το ραντεβού έκλεισε επιτυχώς!",

      successDescription:
        "Η κράτηση καταχωρήθηκε επιτυχώς στο Findoc.",
    },

    auth: {
      login:
        "Σύνδεση",

      register:
        "Εγγραφή",

      email:
        "Email",

      password:
        "Κωδικός",

      fullName:
        "Ονοματεπώνυμο",
    },

    ...uiOptionTranslations.el,
  },
};


/* =====================================================
   ENGLISH TRANSLATIONS
===================================================== */

const englishTranslations = {
  translation: {
    common: {
      appName: "Findoc",
      search: "Search",
      close: "Close",
      cancel: "Cancel",
      save: "Save",
      loading: "Loading...",
      back: "Back",
      next: "Next",
      yes: "Yes",
      no: "No",
    },

    nav: {
      findDoctor:
        "Find a doctor",

      howItWorks:
        "How it works",

      forDoctors:
        "For doctors",

      login:
        "Sign in",

      logout:
        "Sign out",

      myAppointments:
        "My appointments",
    },

    hero: {
      badge:
        "Your health, made simpler",

      title:
        "The right doctor.",

      subtitle:
        "Right when you need them.",

      description:
        "Find available doctors near you, compare ratings and book appointments online.",
    },

    filters: {
      specialty:
        "Specialty",

      city:
        "City",

      area:
        "Area",

      insurance:
        "Insurance",

      maxPrice:
        "Maximum price",

      rating:
        "Rating",

      language:
        "Language",

      sort:
        "Sort",

      onlineOnly:
        "Online consultation",

      verifiedOnly:
        "Verified only",

      clear:
        "Clear filters",

      all:
        "All",
    },

    booking: {
      book:
        "Book appointment",

      confirm:
        "Confirm appointment",

      success:
        "Appointment booked successfully!",

      successDescription:
        "Your appointment has been successfully booked on Findoc.",
    },

    auth: {
      login:
        "Sign in",

      register:
        "Create account",

      email:
        "Email",

      password:
        "Password",

      fullName:
        "Full name",
    },

    ...uiOptionTranslations.en,
  },
};


/* =====================================================
   ALL TRANSLATION RESOURCES
===================================================== */

const resources = {
  el:
    greekTranslations,

  en:
    englishTranslations,

  ...westernEuropeTranslations,

  ...centralEuropeTranslations,

  ...easternEuropeTranslations,

  ...northernEuropeTranslations,

  ...remainingEuropeTranslations,

  ...extendedEuropeTranslations,
};


/* =====================================================
   INITIALIZE I18NEXT
===================================================== */

void i18n
  .use(
    initReactI18next
  )
  .init({
    resources,

    lng:
      getInitialLanguage(),

    fallbackLng:
      "en",

    supportedLngs:
      supportedLanguages.map(
        language =>
          language.code
      ),

    interpolation: {
      escapeValue:
        false,
    },

    react: {
      useSuspense:
        false,
    },
  });


/* =====================================================
   SAVE LANGUAGE
===================================================== */

i18n.on(
  "languageChanged",
  language => {
    const normalized =
      language
        .split("-")[0]
        .toLowerCase();

    localStorage.setItem(
      "findoc_language",
      normalized
    );

    document.documentElement.lang =
      normalized;
  }
);


document.documentElement.lang =
  i18n.language
    .split("-")[0]
    .toLowerCase();


export default i18n;