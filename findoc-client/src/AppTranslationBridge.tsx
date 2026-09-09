import {
  useEffect,
} from "react";

import {
  useTranslation,
} from "react-i18next";


/* =====================================================
   FINDOC — APP TRANSLATION BRIDGE
===================================================== */

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

    const navigationLinks =
      document.querySelectorAll(
        ".main-nav a"
      );


    const navTranslations = [
      t(
        "nav.findDoctor"
      ),

      t(
        "nav.howItWorks"
      ),

      t(
        "nav.forDoctors"
      ),
    ];


    navigationLinks.forEach(
      (
        link,
        index
      ) => {
        const translated =
          navTranslations[
            index
          ];


        if (
          translated &&
          link.textContent !==
            translated
        ) {
          link.textContent =
            translated;
        }
      }
    );


    /* =================================================
       HERO BADGE
    ================================================= */

    const heroBadge =
      document.querySelector(
        ".hero-badge"
      );


    if (
      heroBadge
    ) {
      const icon =
        heroBadge.querySelector(
          "span"
        );


      if (
        icon
      ) {
        /*
         * Διατηρούμε το ✦ span και αλλάζουμε
         * μόνο το text node δίπλα του.
         */

        const textNodes =
          Array.from(
            heroBadge.childNodes
          ).filter(
            node =>
              node.nodeType ===
              Node.TEXT_NODE
          );


        textNodes.forEach(
          node => {
            node.remove();
          }
        );


        heroBadge.append(
          document.createTextNode(
            ` ${t(
              "hero.badge"
            )}`
          )
        );
      } else {
        heroBadge.textContent =
          t(
            "hero.badge"
          );
      }
    }


    /* =================================================
       HERO TITLE
    ================================================= */

    const heroTitle =
      document.querySelector(
        ".hero-left h1"
      );


    if (
      heroTitle
    ) {
      const subtitle =
        heroTitle.querySelector(
          "em"
        );


      /*
       * Το App.tsx έχει:
       *
       * <h1>
       *   title
       *   <em>subtitle</em>
       * </h1>
       *
       * Δεν κάνουμε textContent στο h1,
       * γιατί θα σβήσει το <em>.
       */

      const textNodes =
        Array.from(
          heroTitle.childNodes
        ).filter(
          node =>
            node.nodeType ===
            Node.TEXT_NODE
        );


      textNodes.forEach(
        node => {
          node.remove();
        }
      );


      const titleText =
        document.createTextNode(
          `${t(
            "hero.title"
          )} `
        );


      if (
        subtitle
      ) {
        heroTitle.insertBefore(
          titleText,
          subtitle
        );


        subtitle.textContent =
          t(
            "hero.subtitle"
          );
      } else {
        heroTitle.append(
          titleText
        );
      }
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
      const translated =
        t(
          "hero.description"
        );


      if (
        heroDescription.textContent !==
          translated
      ) {
        heroDescription.textContent =
          translated;
      }
    }


    /* =================================================
       DOCUMENT LANGUAGE
    ================================================= */

    const currentLanguage =
      i18n.language
        .split(
          "-"
        )[0]
        .toLowerCase();


    document.documentElement.lang =
      currentLanguage;

  }, [
    i18n.language,
    t,
  ]);


  return null;
}


export default AppTranslationBridge;