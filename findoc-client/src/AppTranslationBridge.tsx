import {
  useEffect,
} from "react";

import {
  useTranslation,
} from "react-i18next";


function AppTranslationBridge() {
  const {
    t,
    i18n,
  } =
    useTranslation();


  useEffect(() => {
    /* =================================================
       NAVIGATION
    ================================================= */

    const navLinks =
      document.querySelectorAll(
        ".main-nav a"
      );

    if (navLinks[0]) {
      navLinks[0].textContent =
        t(
          "nav.findDoctor"
        );
    }

    if (navLinks[1]) {
      navLinks[1].textContent =
        t(
          "nav.howItWorks"
        );
    }

    if (navLinks[2]) {
      navLinks[2].textContent =
        t(
          "nav.forDoctors"
        );
    }


    const loginButton =
      document.querySelector(
        ".login-button"
      );

    if (loginButton) {
      loginButton.textContent =
        t(
          "nav.login"
        );
    }


    const logoutButton =
      document.querySelector(
        ".logout-button"
      );

    if (logoutButton) {
      logoutButton.textContent =
        t(
          "nav.logout"
        );
    }


    const appointmentsButton =
      document.querySelector(
        ".my-appointments-nav"
      );

    if (
      appointmentsButton
    ) {
      appointmentsButton.textContent =
        t(
          "nav.myAppointments"
        );
    }


    /* =================================================
       HERO BADGE
    ================================================= */

    const heroBadge =
      document.querySelector(
        ".hero-badge"
      );

    if (heroBadge) {
      heroBadge.textContent =
        "";

      const icon =
        document.createElement(
          "span"
        );

      icon.textContent =
        "✦";

      heroBadge.appendChild(
        icon
      );

      heroBadge.append(
        ` ${t(
          "hero.badge"
        )}`
      );
    }


    /* =================================================
       HERO TITLE
    ================================================= */

    const heroTitle =
      document.querySelector(
        ".hero-left h1"
      );

    if (heroTitle) {
      heroTitle.textContent =
        "";

      heroTitle.append(
        t(
          "hero.title"
        )
      );

      const subtitle =
        document.createElement(
          "em"
        );

      subtitle.textContent =
        t(
          "hero.subtitle"
        );

      heroTitle.appendChild(
        subtitle
      );
    }


    /* =================================================
       HERO DESCRIPTION
    ================================================= */

    const heroDescription =
      document.querySelector(
        ".hero-description"
      );

    if (
      heroDescription
    ) {
      heroDescription.textContent =
        t(
          "hero.description"
        );
    }


    /* =================================================
       DOCUMENT
    ================================================= */

    const currentLanguage =
      i18n.language
        .split("-")[0]
        .toLowerCase();

    document.documentElement.lang =
      currentLanguage;

    document.title =
      "Findoc";
  }, [
    i18n.language,
    t,
  ]);


  return null;
}


export default AppTranslationBridge;