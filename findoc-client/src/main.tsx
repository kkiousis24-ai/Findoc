import {
  StrictMode,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import "./i18n";

import "./index.css";
import "./FilterBubbles.css";
import "./DoctorCards.css";
import "./ProfileModal.css";
import "./BookingModal.css";
import "./MyAppointments.css";
import "./AuthModal.css";
import "./Header.css";
import "./Hero.css";
import "./HeroDoctorImage.css";
import "./HeroFeedback.css";
import "./Theme.css";
import "./LanguageSelector.css";

/* DROPDOWN FIX */
import "./CustomSelectMenuFix.css";

/* MUST STAY LAST */
import "./LightThemePolish.css";

import App from "./App.tsx";
import SmartSearchChat from "./SmartSearchChat.tsx";
import BookingSuccessToast from "./BookingSuccessToast.tsx";
import ThemeToggleMount from "./ThemeToggleMount.tsx";
import LanguageSelectorMount from "./LanguageSelectorMount.tsx";
import AppTranslationBridge from "./AppTranslationBridge.tsx";
import FilterTranslationBridge from "./FilterTranslationBridge.tsx";


createRoot(
  document.getElementById(
    "root"
  )!
).render(
  <StrictMode>
    <App />

    <SmartSearchChat />

    <BookingSuccessToast />

    <ThemeToggleMount />

    <LanguageSelectorMount />

    <AppTranslationBridge />

    <FilterTranslationBridge />
  </StrictMode>
);