import {
  useEffect,
} from "react";

import {
  useTranslation,
} from "react-i18next";


/* =====================================================
   HELPERS
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

function DoctorResultsTranslationBridge() {
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
       TRANSLATE SPECIALTY
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
       TRANSLATE LOCATION
    ================================================= */

    function translateLocation(
      element: HTMLParagraphElement
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
        parts.length ===
        0
      ) {
        return;
      }


      const cityKey =
        cityAliases[
          normalize(
            parts[0]
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
              parts[0],
          }
        );


      const nextText =
        parts.length > 1
          ? `${translatedCity} · ${parts
              .slice(1)
              .join(" · ")}`
          : translatedCity;


      if (
        element.textContent !==
        nextText
      ) {
        element.textContent =
          nextText;
      }
    }


    /* =================================================
       APPLY TRANSLATIONS
    ================================================= */

    function applyTranslations() {

      /* -----------------------------------------------
         RESULTS HEADER
      ----------------------------------------------- */

      const resultsSection =
        document.querySelector(
          ".results-section"
        );


      if (
        !resultsSection
      ) {
        return;
      }


      const resultsTitle =
        resultsSection.querySelector(
          ".results-heading h2"
        );


      if (
        resultsTitle
      ) {
        const translatedTitle =
          t(
            "results.title"
          );


        if (
          resultsTitle.textContent !==
          translatedTitle
        ) {
          resultsTitle.textContent =
            translatedTitle;
        }
      }


      const resultsCount =
        resultsSection.querySelector(
          ".results-heading > p"
        );


      if (
        resultsCount
      ) {
        const count =
          resultsCount.textContent
            ?.match(
              /\d+/
            )?.[0];


        if (
          count
        ) {
          const translatedText =
            `${count} ${t(
              "results.results"
            )}`;


          if (
            resultsCount.textContent !==
            translatedText
          ) {
            resultsCount.textContent =
              translatedText;
          }
        }
      }


      /* -----------------------------------------------
         EMPTY RESULTS
      ----------------------------------------------- */

      const emptyResults =
        resultsSection.querySelector(
          ".empty-results"
        );


      if (
        emptyResults
      ) {
        const translatedEmpty =
          t(
            "results.noResults"
          );


        if (
          emptyResults.textContent !==
          translatedEmpty
        ) {
          emptyResults.textContent =
            translatedEmpty;
        }
      }


      /* -----------------------------------------------
         DOCTOR CARDS
      ----------------------------------------------- */

      const doctorCards =
        resultsSection.querySelectorAll(
          ".doctor-card"
        );


      doctorCards.forEach(
        card => {

          /* RATING + REVIEWS */

          const rating =
            card.querySelector(
              ".doctor-rating"
            );


          if (
            rating
          ) {
            const text =
              rating.textContent ??
              "";


            const numbers =
              text.match(
                /\d+(?:[.,]\d+)?/g
              );


            if (
              numbers &&
              numbers.length >= 2
            ) {
              const ratingValue =
                numbers[0];

              const reviewCount =
                numbers[1];


              const translatedRating =
                `★ ${ratingValue} · ${reviewCount} ${t(
                  "results.reviews"
                )}`;


              if (
                rating.textContent !==
                translatedRating
              ) {
                rating.textContent =
                  translatedRating;
              }
            }
          }


          /* SPECIALTY */

          const specialty =
            card.querySelector(
              ".doctor-specialty"
            );


          if (
            specialty
          ) {
            translateSpecialty(
              specialty
            );
          }


          /* PARAGRAPHS */

          const paragraphs =
            card.querySelectorAll(
              ".doctor-card-content > p"
            );


          paragraphs.forEach(
            paragraph => {
              const element =
                paragraph as
                  HTMLParagraphElement;


              const text =
                element.textContent
                  ?.trim() ??
                "";


              const normalized =
                normalize(
                  text
                );


              /* EXPERIENCE */

              if (
                normalized.includes(
                  "χρόνια εμπειρίας"
                ) ||
                normalized.includes(
                  "years of experience"
                )
              ) {
                const years =
                  text.match(
                    /\d+/
                  )?.[0];


                if (
                  years
                ) {
                  const translated =
                    `${years} ${t(
                      "results.yearsExperience"
                    )}`;


                  if (
                    element.textContent !==
                    translated
                  ) {
                    element.textContent =
                      translated;
                  }
                }


                return;
              }


              /* INSURANCE */

              if (
                normalized.startsWith(
                  "✓ ασφάλιση:"
                ) ||
                normalized.startsWith(
                  "✓ insurance:"
                )
              ) {
                const colonIndex =
                  text.indexOf(
                    ":"
                  );


                if (
                  colonIndex !==
                  -1
                ) {
                  const providers =
                    text
                      .slice(
                        colonIndex + 1
                      )
                      .trim();


                  const translated =
                    `✓ ${t(
                      "results.insurance"
                    )}: ${providers}`;


                  if (
                    element.textContent !==
                    translated
                  ) {
                    element.textContent =
                      translated;
                  }
                }


                return;
              }


              /* ONLINE CONSULTATION */

              if (
                normalized ===
                  "✓ online consultation"
              ) {
                const translated =
                  `✓ ${t(
                    "results.onlineConsultation"
                  )}`;


                if (
                  element.textContent !==
                  translated
                ) {
                  element.textContent =
                    translated;
                }


                return;
              }


              /* CITY */

              translateLocation(
                element
              );
            }
          );


          /* PRICE */

          const price =
            card.querySelector(
              ".doctor-bottom > span"
            );


          if (
            price
          ) {
            const priceValue =
              price.textContent
                ?.match(
                  /€\s*\d+(?:[.,]\d+)?/
                )?.[0]
                .replace(
                  /\s+/g,
                  ""
                );


            if (
              priceValue
            ) {
              const translated =
                `${t(
                  "results.from"
                )} ${priceValue}`;


              if (
                price.textContent
                  ?.trim() !==
                translated
              ) {
                price.textContent =
                  translated;
              }
            }
          }


          /* PROFILE BUTTON */

          const profileButton =
            card.querySelector(
              ".profile-button"
            );


          if (
            profileButton
          ) {
            const translated =
              t(
                "results.profile"
              );


            if (
              profileButton.textContent !==
              translated
            ) {
              profileButton.textContent =
                translated;
            }
          }


          /* AVAILABILITY BUTTON */

          const availabilityButton =
            card.querySelector(
              ".availability-button"
            );


          if (
            availabilityButton
          ) {
            const translated =
              t(
                "results.availability"
              );


            if (
              availabilityButton.textContent !==
              translated
            ) {
              availabilityButton.textContent =
                translated;
            }
          }
        }
      );
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


export default DoctorResultsTranslationBridge;