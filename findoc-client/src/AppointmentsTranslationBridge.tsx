import {
  useEffect,
} from "react";

import {
  useTranslation,
} from "react-i18next";


/* =====================================================
   CITY ALIASES
===================================================== */

const cityAliases:
  Record<string, string> = {
  "αθήνα":
    "Athens",

  "athens":
    "Athens",

  "θεσσαλονίκη":
    "Thessaloniki",

  "thessaloniki":
    "Thessaloniki",

  "πάτρα":
    "Patras",

  "patras":
    "Patras",

  "ιωάννινα":
    "Ioannina",

  "ioannina":
    "Ioannina",
};


function normalize(
  value: string
) {
  return value
    .trim()
    .toLowerCase();
}


/* =====================================================
   COMPONENT
===================================================== */

function AppointmentsTranslationBridge() {
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


    let frameId:
      number | null =
      null;


    /* =================================================
       LOCATION
    ================================================= */

    function translateLocation(
      element: Element
    ) {
      const text =
        element.textContent
          ?.trim() ??
        "";


      const parts =
        text.split(
          " · "
        );


      if (
        parts.length <
        2
      ) {
        return;
      }


      const city =
        parts[0];


      const cityKey =
        cityAliases[
          normalize(
            city
          )
        ];


      if (
        !cityKey
      ) {
        return;
      }


      const translatedCity =
        t(
          `filterOptions.cities.${cityKey}`,
          {
            defaultValue:
              city,
          }
        );


      const nextText =
        `${translatedCity} · ${parts
          .slice(1)
          .join(" · ")}`;


      if (
        element.textContent !==
        nextText
      ) {
        element.textContent =
          nextText;
      }
    }


    /* =================================================
       SYSTEM MESSAGE
    ================================================= */

    function translateMessage(
      element: Element
    ) {
      const text =
        normalize(
          element.textContent ??
            ""
        );


      if (
        text.includes(
          "δεν ήταν δυνατή η φόρτωση"
        ) ||
        text.includes(
          "could not be loaded"
        )
      ) {
        element.textContent =
          t(
            "appointments.loadError"
          );

        return;
      }


      if (
        text.includes(
          "ακυρώθηκε επιτυχώς"
        ) ||
        text.includes(
          "cancelled successfully"
        )
      ) {
        element.textContent =
          t(
            "appointments.cancelSuccess"
          );

        return;
      }


      if (
        text.includes(
          "δεν έχεις δικαίωμα"
        ) ||
        text.includes(
          "don't have permission"
        )
      ) {
        element.textContent =
          t(
            "appointments.forbidden"
          );

        return;
      }


      if (
        text.includes(
          "επικοινωνία με το backend"
        ) ||
        text.includes(
          "connect to the backend"
        )
      ) {
        element.textContent =
          t(
            "appointments.backendError"
          );

        return;
      }


      if (
        text.includes(
          "ακύρωση απέτυχε"
        ) ||
        text.includes(
          "could not be cancelled"
        )
      ) {
        element.textContent =
          t(
            "appointments.cancelError"
          );
      }
    }


    /* =================================================
       APPLY TRANSLATIONS
    ================================================= */

    function applyTranslations() {
      const modal =
        document.querySelector(
          ".appointments-modal"
        );


      if (
        !modal
      ) {
        return;
      }


      /* -----------------------------------------------
         HEADER
      ----------------------------------------------- */

      const header =
        modal.querySelector(
          ".appointments-header"
        );


      if (
        header
      ) {
        const eyebrow =
          header.querySelector(
            "span"
          );


        const title =
          header.querySelector(
            "h2"
          );


        if (
          eyebrow
        ) {
          const translated =
            t(
              "appointments.eyebrow"
            );


          if (
            eyebrow.textContent !==
            translated
          ) {
            eyebrow.textContent =
              translated;
          }
        }


        if (
          title
        ) {
          const translated =
            t(
              "appointments.title"
            );


          if (
            title.textContent !==
            translated
          ) {
            title.textContent =
              translated;
          }
        }
      }


      /* -----------------------------------------------
         MESSAGE
      ----------------------------------------------- */

      const message =
        modal.querySelector(
          ".appointments-message"
        );


      if (
        message
      ) {
        translateMessage(
          message
        );
      }


      /* -----------------------------------------------
         LOADING / EMPTY
      ----------------------------------------------- */

      const emptyState =
        modal.querySelector(
          ".appointments-empty"
        );


      if (
        emptyState
      ) {
        const current =
          normalize(
            emptyState.textContent ??
              ""
          );


        const loading =
          current.includes(
            "φόρτωση"
          ) ||
          current.includes(
            "loading"
          );


        const translated =
          loading
            ? t(
                "appointments.loading"
              )
            : t(
                "appointments.empty"
              );


        if (
          emptyState.textContent !==
          translated
        ) {
          emptyState.textContent =
            translated;
        }
      }


      /* -----------------------------------------------
         APPOINTMENT CARDS
      ----------------------------------------------- */

      const cards =
        modal.querySelectorAll(
          ".my-appointment-card"
        );


      cards.forEach(
        card => {

          /* STATUS */

          const status =
            card.querySelector(
              ".appointment-status"
            );


          if (
            status
          ) {
            const cancelled =
              status.classList.contains(
                "cancelled"
              );


            const translated =
              cancelled
                ? t(
                    "appointments.cancelled"
                  )
                : t(
                    "appointments.confirmed"
                  );


            if (
              status.textContent !==
              translated
            ) {
              status.textContent =
                translated;
            }
          }


          /* LOCATION */

          const paragraphs =
            card.querySelectorAll(
              "p"
            );


          if (
            paragraphs.length >=
            2
          ) {
            translateLocation(
              paragraphs[1]
            );
          }


          /* CANCEL BUTTON */

          const cancelButton =
            card.querySelector(
              ".cancel-appointment-button"
            );


          if (
            cancelButton
          ) {
            const text =
              normalize(
                cancelButton.textContent ??
                  ""
              );


            const cancelling =
              text.includes(
                "ακύρωση..."
              ) ||
              text.includes(
                "cancelling"
              );


            const translated =
              cancelling
                ? t(
                    "appointments.cancelling"
                  )
                : t(
                    "appointments.cancel"
                  );


            if (
              cancelButton.textContent !==
              translated
            ) {
              cancelButton.textContent =
                translated;
            }
          }
        }
      );
    }


    /* =================================================
       SAFE OBSERVER
    ================================================= */

    function scheduleTranslation() {
      if (
        frameId !==
        null
      ) {
        return;
      }


      frameId =
        window.requestAnimationFrame(
          () => {
            frameId =
              null;


            observer.disconnect();


            applyTranslations();


            observer.observe(
              root,
              {
                childList:
                  true,

                subtree:
                  true,
              }
            );
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
      }
    );


    scheduleTranslation();


    return () => {
      observer.disconnect();


      if (
        frameId !==
        null
      ) {
        window.cancelAnimationFrame(
          frameId
        );
      }
    };
  }, [
    i18n.language,
    t,
  ]);


  return null;
}


export default AppointmentsTranslationBridge;