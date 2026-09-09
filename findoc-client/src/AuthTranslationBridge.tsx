import {
  useEffect,
} from "react";

import {
  useTranslation,
} from "react-i18next";


/* =====================================================
   COMPONENT
===================================================== */

function AuthTranslationBridge() {
  const {
    t,
    i18n,
  } =
    useTranslation();


  useEffect(() => {
    const rootElement =
      document.getElementById(
        "root"
      );


    if (
      !rootElement
    ) {
      return;
    }


    const root:
      HTMLElement =
      rootElement;


    let animationFrame:
      number | null =
      null;


    /* =================================================
       HEADER AUTH BUTTONS
    ================================================= */

    function translateHeaderAuth() {
      const loginButton =
        document.querySelector(
          ".login-button"
        );


      if (
        loginButton
      ) {
        const translated =
          t(
            "auth.login"
          );


        if (
          loginButton.textContent !==
          translated
        ) {
          loginButton.textContent =
            translated;
        }
      }


      const appointmentsButton =
        document.querySelector(
          ".my-appointments-nav"
        );


      if (
        appointmentsButton
      ) {
        const translated =
          t(
            "auth.myAppointments"
          );


        if (
          appointmentsButton.textContent !==
          translated
        ) {
          appointmentsButton.textContent =
            translated;
        }
      }


      const logoutButton =
        document.querySelector(
          ".logout-button"
        );


      if (
        logoutButton
      ) {
        const translated =
          t(
            "auth.logout"
          );


        if (
          logoutButton.textContent !==
          translated
        ) {
          logoutButton.textContent =
            translated;
        }
      }
    }


    /* =================================================
       AUTH MODAL
    ================================================= */

    function translateAuthModal() {
      const modal =
        document.querySelector(
          ".auth-modal"
        );


      if (
        !modal
      ) {
        return;
      }


      /* -----------------------------------------------
         DETECT MODE
      ----------------------------------------------- */

      const registerInput =
        modal.querySelector(
          'input[type="text"]'
        );


      const isRegisterMode =
        registerInput instanceof
        HTMLInputElement;


      /* -----------------------------------------------
         EYEBROW
      ----------------------------------------------- */

      const eyebrow =
        modal.querySelector(
          ".auth-eyebrow"
        );


      if (
        eyebrow
      ) {
        const translated =
          isRegisterMode
            ? t(
                "auth.createAccountEyebrow"
              )
            : t(
                "auth.welcomeBack"
              );


        if (
          eyebrow.textContent !==
          translated
        ) {
          eyebrow.textContent =
            translated;
        }
      }


      /* -----------------------------------------------
         TITLE
      ----------------------------------------------- */

      const title =
        modal.querySelector(
          "h2"
        );


      if (
        title
      ) {
        const translated =
          isRegisterMode
            ? t(
                "auth.registerTitle"
              )
            : t(
                "auth.loginTitle"
              );


        if (
          title.textContent !==
          translated
        ) {
          title.textContent =
            translated;
        }
      }


      /* -----------------------------------------------
         LOGIN / REGISTER TABS
      ----------------------------------------------- */

      const modeButtons =
        modal.querySelectorAll(
          ".profile-button"
        );


      const loginModeButton =
        modeButtons[0];


      const registerModeButton =
        modeButtons[1];


      if (
        loginModeButton
      ) {
        const translated =
          t(
            "auth.login"
          );


        if (
          loginModeButton.textContent !==
          translated
        ) {
          loginModeButton.textContent =
            translated;
        }
      }


      if (
        registerModeButton
      ) {
        const translated =
          t(
            "auth.register"
          );


        if (
          registerModeButton.textContent !==
          translated
        ) {
          registerModeButton.textContent =
            translated;
        }
      }


      /* -----------------------------------------------
         FORM FIELDS
      ----------------------------------------------- */

      const fields =
        modal.querySelectorAll(
          ".auth-field"
        );


      fields.forEach(
        field => {
          const label =
            field.querySelector(
              "label"
            );


          const input =
            field.querySelector(
              "input"
            );


          if (
            !label ||
            !(
              input instanceof
              HTMLInputElement
            )
          ) {
            return;
          }


          /* FULL NAME */

          if (
            input.type ===
            "text"
          ) {
            const translated =
              t(
                "auth.fullName"
              );


            if (
              label.textContent !==
              translated
            ) {
              label.textContent =
                translated;
            }


            input.placeholder =
              t(
                "auth.placeholders.fullName"
              );


            return;
          }


          /* EMAIL */

          if (
            input.type ===
            "email"
          ) {
            const translated =
              t(
                "auth.email"
              );


            if (
              label.textContent !==
              translated
            ) {
              label.textContent =
                translated;
            }


            input.placeholder =
              t(
                "auth.placeholders.email"
              );


            return;
          }


          /* PASSWORD */

          if (
            input.type ===
            "password"
          ) {
            const translated =
              t(
                "auth.password"
              );


            if (
              label.textContent !==
              translated
            ) {
              label.textContent =
                translated;
            }


            input.placeholder =
              t(
                "auth.placeholders.password"
              );
          }
        }
      );


      /* -----------------------------------------------
         SUBMIT BUTTON
      ----------------------------------------------- */

      const submitButton =
        modal.querySelector(
          ".auth-submit"
        );


      if (
        submitButton instanceof
        HTMLButtonElement
      ) {
        const translated =
          submitButton.disabled
            ? t(
                "auth.wait"
              )
            : isRegisterMode
              ? t(
                  "auth.createAccount"
                )
              : t(
                  "auth.login"
                );


        if (
          submitButton.textContent !==
          translated
        ) {
          submitButton.textContent =
            translated;
        }
      }
    }


    /* =================================================
       APPLY
    ================================================= */

    function applyTranslations() {
      translateHeaderAuth();

      translateAuthModal();
    }


    /* =================================================
       SAFE OBSERVER
    ================================================= */

    function runTranslation() {
      observer.disconnect();


      applyTranslations();


      observer.observe(
        root,
        {
          childList:
            true,

          subtree:
            true,

          characterData:
            true,

          attributes:
            true,

          attributeFilter: [
            "disabled",
          ],
        }
      );
    }


    function scheduleTranslation() {
      if (
        animationFrame !==
        null
      ) {
        return;
      }


      animationFrame =
        window.requestAnimationFrame(
          () => {
            animationFrame =
              null;

            runTranslation();
          }
        );
    }


    const observer =
      new MutationObserver(
        scheduleTranslation
      );


    observer.observe(
      root,
      {
        childList:
          true,

        subtree:
          true,

        characterData:
          true,

        attributes:
          true,

        attributeFilter: [
          "disabled",
        ],
      }
    );


    scheduleTranslation();


    return () => {
      observer.disconnect();


      if (
        animationFrame !==
        null
      ) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }
    };
  }, [
    i18n.language,
    t,
  ]);


  return null;
}


export default AuthTranslationBridge;