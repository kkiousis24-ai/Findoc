import {
  useEffect,
} from "react";

import {
  useTranslation,
} from "react-i18next";


/* =====================================================
   ALIASES
===================================================== */

const specialtyAliases:
  Record<string, string> = {
  "καρδιολόγος":
    "Cardiologist",

  "cardiologist":
    "Cardiologist",

  "δερματολόγος":
    "Dermatologist",

  "dermatologist":
    "Dermatologist",

  "νευρολόγος":
    "Neurologist",

  "neurologist":
    "Neurologist",

  "παιδίατρος":
    "Pediatrician",

  "pediatrician":
    "Pediatrician",

  "ορθοπαιδικός":
    "Orthopedic",

  "orthopedic":
    "Orthopedic",
};


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

function BookingTranslationBridge() {
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
       HEADER INFO
    ================================================= */

    function translateHeaderInfo(
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


      const specialty =
        parts[0];

      const city =
        parts[1];


      const specialtyKey =
        specialtyAliases[
          normalize(
            specialty
          )
        ];


      const cityKey =
        cityAliases[
          normalize(
            city
          )
        ];


      const translatedSpecialty =
        specialtyKey
          ? t(
              `filterOptions.specialties.${specialtyKey}`,
              {
                defaultValue:
                  specialty,
              }
            )
          : specialty;


      const translatedCity =
        cityKey
          ? t(
              `filterOptions.cities.${cityKey}`,
              {
                defaultValue:
                  city,
              }
            )
          : city;


      const translatedText =
        `${translatedSpecialty} · ${translatedCity}`;


      if (
        element.textContent !==
        translatedText
      ) {
        element.textContent =
          translatedText;
      }
    }


    /* =================================================
       BOOKING MESSAGE
    ================================================= */

    function translateBookingMessage(
      element: Element
    ) {
      const text =
        element.textContent
          ?.trim() ??
        "";


      const normalized =
        normalize(
          text
        );


      if (
        normalized.includes(
          "έκλεισε επιτυχώς"
        ) ||
        normalized.includes(
          "booked successfully"
        )
      ) {
        element.textContent =
          t(
            "booking.success"
          );

        return;
      }


      if (
        normalized.includes(
          "επίλεξε πρώτα"
        ) ||
        normalized.includes(
          "select an available time"
        ) ||
        normalized.includes(
          "select a time"
        )
      ) {
        element.textContent =
          i18n.language
            .toLowerCase()
            .startsWith(
              "el"
            )
            ? "Επίλεξε πρώτα μία διαθέσιμη ώρα."
            : "Please select an available time first.";

        return;
      }


      if (
        normalized.includes(
          "ονοματεπώνυμό"
        ) ||
        normalized.includes(
          "enter your full name"
        )
      ) {
        element.textContent =
          i18n.language
            .toLowerCase()
            .startsWith(
              "el"
            )
            ? "Γράψε το ονοματεπώνυμό σου."
            : "Please enter your full name.";

        return;
      }


      if (
        normalized.includes(
          "γράψε το email"
        ) ||
        normalized.includes(
          "enter your email"
        )
      ) {
        element.textContent =
          i18n.language
            .toLowerCase()
            .startsWith(
              "el"
            )
            ? "Γράψε το email σου."
            : "Please enter your email.";

        return;
      }


      if (
        normalized.includes(
          "πρόβλημα κατά την κράτηση"
        ) ||
        normalized.includes(
          "δεν ήταν δυνατή η κράτηση"
        ) ||
        normalized.includes(
          "problem booking"
        )
      ) {
        element.textContent =
          t(
            "booking.error"
          );
      }
    }


    /* =================================================
       APPLY TRANSLATIONS
    ================================================= */

    function applyTranslations() {
      const modal =
        document.querySelector(
          ".booking-modal"
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
          ".booking-header"
        );


      if (
        header
      ) {
        const eyebrow =
          header.querySelector(
            "span"
          );


        const info =
          header.querySelector(
            "p"
          );


        if (
          eyebrow
        ) {
          const translated =
            t(
              "booking.title"
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
          info
        ) {
          translateHeaderInfo(
            info
          );
        }
      }


      /* -----------------------------------------------
         BOOKING SECTIONS
      ----------------------------------------------- */

      const sections =
        modal.querySelectorAll(
          ".booking-section"
        );


      sections.forEach(
        (
          section,
          index
        ) => {
          const label =
            section.querySelector(
              "label"
            );


          if (
            !label
          ) {
            return;
          }


          if (
            index ===
            0
          ) {
            const translated =
              t(
                "booking.selectDate"
              );


            if (
              label.textContent !==
              translated
            ) {
              label.textContent =
                translated;
            }


            return;
          }


          if (
            index ===
            1
          ) {
            const translated =
              t(
                "booking.availableTimes"
              );


            if (
              label.textContent !==
              translated
            ) {
              label.textContent =
                translated;
            }


            return;
          }


          if (
            index ===
            2
          ) {
            const translated =
              t(
                "booking.patientDetails"
              );


            if (
              label.textContent !==
              translated
            ) {
              label.textContent =
                translated;
            }
          }
        }
      );


      /* -----------------------------------------------
         INPUT PLACEHOLDERS
      ----------------------------------------------- */

      const patientNameInput =
        modal.querySelector(
          'input[type="text"]'
        );


      if (
        patientNameInput instanceof
        HTMLInputElement
      ) {
        patientNameInput.placeholder =
          t(
            "booking.placeholders.fullName"
          );
      }


      const patientEmailInput =
        modal.querySelector(
          'input[type="email"]'
        );


      if (
        patientEmailInput instanceof
        HTMLInputElement
      ) {
        patientEmailInput.placeholder =
          t(
            "booking.placeholders.email"
          );
      }


      /* -----------------------------------------------
         LOADING / EMPTY AVAILABILITY
      ----------------------------------------------- */

      const muted =
        modal.querySelector(
          ".booking-muted"
        );


      if (
        muted
      ) {
        const text =
          normalize(
            muted.textContent ??
              ""
          );


        if (
          text.includes(
            "φόρτωση"
          ) ||
          text.includes(
            "loading"
          )
        ) {
          const translated =
            i18n.language
              .toLowerCase()
              .startsWith(
                "el"
              )
              ? "Φόρτωση..."
              : "Loading...";


          if (
            muted.textContent !==
            translated
          ) {
            muted.textContent =
              translated;
          }
        } else {
          const translated =
            t(
              "booking.noAvailableTimes"
            );


          if (
            muted.textContent !==
            translated
          ) {
            muted.textContent =
              translated;
          }
        }
      }


      /* -----------------------------------------------
         MESSAGE
      ----------------------------------------------- */

      const bookingMessage =
        modal.querySelector(
          ".booking-message"
        );


      if (
        bookingMessage
      ) {
        translateBookingMessage(
          bookingMessage
        );
      }


      /* -----------------------------------------------
         CONFIRM BUTTON
      ----------------------------------------------- */

      const confirmButton =
        modal.querySelector(
          ".confirm-booking-button"
        );


      if (
        confirmButton instanceof
        HTMLButtonElement
      ) {
        const currentText =
          normalize(
            confirmButton.textContent ??
              ""
          );


        const isLoading =
          currentText.includes(
            "γίνεται κράτηση"
          ) ||
          currentText.includes(
            "booking..."
          );


        const translated =
          isLoading
            ? t(
                "booking.booking"
              )
            : t(
                "booking.confirmAppointment"
              );


        if (
          confirmButton.textContent !==
          translated
        ) {
          confirmButton.textContent =
            translated;
        }
      }
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


export default BookingTranslationBridge;