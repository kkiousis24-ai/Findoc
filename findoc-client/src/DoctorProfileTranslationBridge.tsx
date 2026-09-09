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

function DoctorProfileTranslationBridge() {
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
       SPECIALTY
    ================================================= */

    function translateSpecialty(
      element: Element
    ) {
      const currentText =
        element.textContent
          ?.trim() ??
        "";


      const specialtyKey =
        specialtyAliases[
          normalize(
            currentText
          )
        ];


      if (
        !specialtyKey
      ) {
        return;
      }


      const translated =
        t(
          `filterOptions.specialties.${specialtyKey}`,
          {
            defaultValue:
              currentText,
          }
        );


      if (
        element.textContent !==
        translated
      ) {
        element.textContent =
          translated;
      }
    }


    /* =================================================
       CITY
    ================================================= */

    function translateCity(
      element: Element
    ) {
      const currentText =
        element.textContent
          ?.trim() ??
        "";


      const cityKey =
        cityAliases[
          normalize(
            currentText
          )
        ];


      if (
        !cityKey
      ) {
        return;
      }


      const translated =
        t(
          `filterOptions.cities.${cityKey}`,
          {
            defaultValue:
              currentText,
          }
        );


      if (
        element.textContent !==
        translated
      ) {
        element.textContent =
          translated;
      }
    }


    /* =================================================
       APPLY TRANSLATIONS
    ================================================= */

    function applyTranslations() {

      /* -----------------------------------------------
         PROFILE LOADING
      ----------------------------------------------- */

      const profileLoading =
        document.querySelector(
          ".profile-loading"
        );


      if (
        profileLoading
      ) {
        const translated =
          t(
            "profile.loading"
          );


        if (
          profileLoading.textContent !==
          translated
        ) {
          profileLoading.textContent =
            translated;
        }
      }


      /* -----------------------------------------------
         PROFILE MODAL
      ----------------------------------------------- */

      const modal =
        document.querySelector(
          ".profile-modal"
        );


      if (
        !modal
      ) {
        return;
      }


      /* -----------------------------------------------
         VERIFIED DOCTOR
      ----------------------------------------------- */

      const verifiedDoctor =
        modal.querySelector(
          ".verified-doctor"
        );


      if (
        verifiedDoctor
      ) {
        const translated =
          `✓ ${t(
            "profile.verifiedDoctor"
          )}`;


        if (
          verifiedDoctor.textContent !==
          translated
        ) {
          verifiedDoctor.textContent =
            translated;
        }
      }


      /* -----------------------------------------------
         SPECIALTY
      ----------------------------------------------- */

      const specialty =
        modal.querySelector(
          ".profile-specialty"
        );


      if (
        specialty
      ) {
        translateSpecialty(
          specialty
        );
      }


      /* -----------------------------------------------
         REVIEWS
      ----------------------------------------------- */

      const ratingSpan =
        modal.querySelector(
          ".profile-rating span"
        );


      if (
        ratingSpan
      ) {
        const reviewCount =
          ratingSpan.textContent
            ?.match(
              /\d+/
            )?.[0];


        if (
          reviewCount
        ) {
          const translated =
            ` (${reviewCount} ${t(
              "profile.reviews"
            )})`;


          if (
            ratingSpan.textContent !==
            translated
          ) {
            ratingSpan.textContent =
              translated;
          }
        }
      }


      /* -----------------------------------------------
         DETAIL CARDS
      ----------------------------------------------- */

      const detailCards =
        modal.querySelectorAll(
          ".profile-detail"
        );


      detailCards.forEach(
        (
          card,
          index
        ) => {
          const label =
            card.querySelector(
              "span"
            );


          const strong =
            card.querySelector(
              "strong"
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
                "profile.location"
              );


            if (
              label.textContent !==
              translated
            ) {
              label.textContent =
                translated;
            }


            if (
              strong
            ) {
              translateCity(
                strong
              );
            }


            return;
          }


          if (
            index ===
            1
          ) {
            const translated =
              t(
                "profile.consultationCost"
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
                "profile.experience"
              );


            if (
              label.textContent !==
              translated
            ) {
              label.textContent =
                translated;
            }


            if (
              strong
            ) {
              const years =
                strong.textContent
                  ?.match(
                    /\d+/
                  )?.[0];


              if (
                years
              ) {
                const translatedYears =
                  `${years} ${t(
                    "profile.years"
                  )}`;


                if (
                  strong.textContent !==
                  translatedYears
                ) {
                  strong.textContent =
                    translatedYears;
                }
              }
            }


            return;
          }


          if (
            index ===
            3
          ) {
            const translated =
              t(
                "profile.languages"
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
         ABOUT DOCTOR
      ----------------------------------------------- */

      const aboutSection =
        modal.querySelector(
          ".profile-about"
        );


      if (
        aboutSection
      ) {
        const eyebrow =
          aboutSection.querySelector(
            "span"
          );


        const title =
          aboutSection.querySelector(
            "h3"
          );


        const paragraph =
          aboutSection.querySelector(
            "p"
          );


        if (
          eyebrow
        ) {
          const translated =
            t(
              "profile.aboutDoctor"
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
              "profile.professionalProfile"
            );


          if (
            title.textContent !==
            translated
          ) {
            title.textContent =
              translated;
          }
        }


        if (
          paragraph
        ) {
          const text =
            paragraph.textContent
              ?.trim() ??
            "";


          const noBioTexts = [
            "Δεν υπάρχει διαθέσιμο βιογραφικό.",
            "No biography is currently available.",
          ];


          if (
            noBioTexts.includes(
              text
            )
          ) {
            const translated =
              t(
                "profile.noBio"
              );


            if (
              paragraph.textContent !==
              translated
            ) {
              paragraph.textContent =
                translated;
            }
          }
        }
      }


      /* -----------------------------------------------
         PROFILE FEATURES
      ----------------------------------------------- */

      const featureItems =
        modal.querySelectorAll(
          ".profile-features > div"
        );


      featureItems.forEach(
        item => {
          const text =
            item.textContent
              ?.trim() ??
            "";


          const normalized =
            normalize(
              text
            );


          if (
            normalized.includes(
              "online consultation"
            )
          ) {
            const translated =
              `✓ ${t(
                "profile.onlineConsultation"
              )}`;


            if (
              item.textContent !==
              translated
            ) {
              item.textContent =
                translated;
            }


            return;
          }


          if (
            normalized.includes(
              "επιβεβαιωμένο προφίλ"
            ) ||
            normalized.includes(
              "verified profile"
            )
          ) {
            const translated =
              `✓ ${t(
                "profile.verifiedProfile"
              )}`;


            if (
              item.textContent !==
              translated
            ) {
              item.textContent =
                translated;
            }
          }
        }
      );


      /* -----------------------------------------------
         FOOTER
      ----------------------------------------------- */

      const footer =
        modal.querySelector(
          ".profile-footer"
        );


      if (
        footer
      ) {
        const costLabel =
          footer.querySelector(
            "small"
          );


        const bookButton =
          footer.querySelector(
            "button"
          );


        if (
          costLabel
        ) {
          const translated =
            t(
              "profile.consultationCost"
            );


          if (
            costLabel.textContent !==
            translated
          ) {
            costLabel.textContent =
              translated;
          }
        }


        if (
          bookButton
        ) {
          const translated =
            t(
              "profile.bookAppointment"
            );


          if (
            bookButton.textContent !==
            translated
          ) {
            bookButton.textContent =
              translated;
          }
        }
      }
    }


    /* =================================================
       SAFE MUTATION OBSERVER
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


export default DoctorProfileTranslationBridge;