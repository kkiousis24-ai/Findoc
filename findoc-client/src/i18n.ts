import i18n from "i18next";

import {
  initReactI18next,
} from "react-i18next";

import {
  uiOptionTranslations,
} from "./locales/uiOptions";


export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}


/* =====================================================
   SUPPORTED LANGUAGES
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


  if (
    browserSupported
  ) {
    return browserLanguage;
  }


  return "el";
}


/* =====================================================
   GREEK TRANSLATIONS
===================================================== */

const greekTranslations = {
  translation: {

    ...uiOptionTranslations.el,


    common: {
      appName:
        "Findoc",

      search:
        "Αναζήτηση",

      close:
        "Κλείσιμο",

      cancel:
        "Ακύρωση",

      save:
        "Αποθήκευση",

      loading:
        "Φόρτωση...",

      back:
        "Πίσω",

      next:
        "Επόμενο",

      yes:
        "Ναι",

      no:
        "Όχι",
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
      ...uiOptionTranslations.el.booking,

      book:
        "Κλείσε ραντεβού",

      confirm:
        "Επιβεβαίωση ραντεβού",

      successDescription:
        "Η κράτηση καταχωρήθηκε επιτυχώς στο Findoc.",
    },
  },
};


/* =====================================================
   ENGLISH TRANSLATIONS
===================================================== */

const englishTranslations = {
  translation: {

    ...uiOptionTranslations.en,


    common: {
      appName:
        "Findoc",

      search:
        "Search",

      close:
        "Close",

      cancel:
        "Cancel",

      save:
        "Save",

      loading:
        "Loading...",

      back:
        "Back",

      next:
        "Next",

      yes:
        "Yes",

      no:
        "No",
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
      ...uiOptionTranslations.en.booking,

      book:
        "Book appointment",

      confirm:
        "Confirm appointment",

      successDescription:
        "Your appointment has been successfully booked on Findoc.",
    },
  },
};


/* =====================================================
   TRANSLATION RESOURCES
===================================================== */

const resources = {
  el:
    greekTranslations,

  en:
    englishTranslations,
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