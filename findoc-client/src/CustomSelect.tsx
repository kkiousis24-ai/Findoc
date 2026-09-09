import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";


export interface CustomSelectOption {
  value: string;
  label: string;
}


interface CustomSelectProps {
  value: string;

  options:
    CustomSelectOption[];

  onChange: (
    value: string
  ) => void;

  ariaLabel?: string;

  disabled?: boolean;
}


/* =====================================================
   CUSTOM SELECT
===================================================== */

function CustomSelect({
  value,
  options,
  onChange,
  ariaLabel = "Επιλογή",
  disabled = false,
}: CustomSelectProps) {
  const {
    t,
  } =
    useTranslation();


  const [
    isOpen,
    setIsOpen,
  ] =
    useState(false);


  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );


  const selectedOption =
    options.find(
      option =>
        option.value ===
        value
    ) ??
    options[0];


  /* ===================================================
     FILTER TYPE
  =================================================== */

  function getFilterType() {
    const normalized =
      ariaLabel
        .trim()
        .toLowerCase();


    if (
      normalized ===
        "πόλη" ||
      normalized ===
        "city"
    ) {
      return "city";
    }


    if (
      normalized ===
        "ασφάλιση" ||
      normalized ===
        "insurance"
    ) {
      return "insurance";
    }


    if (
      normalized ===
        "rating" ||
      normalized ===
        "αξιολόγηση"
    ) {
      return "rating";
    }


    if (
      normalized ===
        "γλώσσα" ||
      normalized ===
        "language"
    ) {
      return "language";
    }


    if (
      normalized ===
        "ταξινόμηση" ||
      normalized ===
        "sort"
    ) {
      return "sort";
    }


    if (
      normalized ===
        "ειδικότητα" ||
      normalized ===
        "specialty"
    ) {
      return "specialty";
    }


    return "generic";
  }


  /* ===================================================
     TRANSLATED OPTION LABEL
  =================================================== */

  function getOptionLabel(
    option:
      CustomSelectOption
  ) {
    const filterType =
      getFilterType();


    /* -----------------------------
       SPECIALTY
    ----------------------------- */

    if (
      filterType ===
      "specialty"
    ) {
      if (
        option.value ===
        ""
      ) {
        return t(
          "filterOptions.all",
          {
            defaultValue:
              option.label,
          }
        );
      }


      return t(
        `filterOptions.specialties.${option.value}`,
        {
          defaultValue:
            option.label,
        }
      );
    }


    /* -----------------------------
       CITY
    ----------------------------- */

    if (
      filterType ===
      "city"
    ) {
      if (
        option.value ===
        ""
      ) {
        return t(
          "filterOptions.allGreece",
          {
            defaultValue:
              option.label,
          }
        );
      }


      return t(
        `filterOptions.cities.${option.value}`,
        {
          defaultValue:
            option.label,
        }
      );
    }


    /* -----------------------------
       INSURANCE
    ----------------------------- */

    if (
      filterType ===
      "insurance"
    ) {
      if (
        option.value ===
        ""
      ) {
        return t(
          "filterOptions.all",
          {
            defaultValue:
              option.label,
          }
        );
      }


      if (
        option.value ===
        "any-insurance"
      ) {
        return t(
          "filterOptions.acceptsInsurance",
          {
            defaultValue:
              option.label,
          }
        );
      }


      return option.label;
    }


    /* -----------------------------
       RATING
    ----------------------------- */

    if (
      filterType ===
      "rating"
    ) {
      if (
        option.value ===
        ""
      ) {
        return t(
          "filterOptions.all",
          {
            defaultValue:
              option.label,
          }
        );
      }


      return option.label;
    }


    /* -----------------------------
       LANGUAGE
    ----------------------------- */

    if (
      filterType ===
      "language"
    ) {
      if (
        option.value ===
        ""
      ) {
        return t(
          "filterOptions.all",
          {
            defaultValue:
              option.label,
          }
        );
      }


      return t(
        `filterOptions.languages.${option.value}`,
        {
          defaultValue:
            option.label,
        }
      );
    }


    /* -----------------------------
       SORT
    ----------------------------- */

    if (
      filterType ===
      "sort"
    ) {
      const sortTranslationKeys:
        Record<
          string,
          string
        > = {
        rating:
          "filterOptions.sort.rating",

        reviews:
          "filterOptions.sort.reviews",

        experience:
          "filterOptions.sort.experience",

        price_asc:
          "filterOptions.sort.priceAsc",

        price_desc:
          "filterOptions.sort.priceDesc",
      };


      const translationKey =
        sortTranslationKeys[
          option.value
        ];


      if (
        translationKey
      ) {
        return t(
          translationKey,
          {
            defaultValue:
              option.label,
          }
        );
      }


      return option.label;
    }


    return option.label;
  }


  /* ===================================================
     TRANSLATED ARIA LABEL
  =================================================== */

  function getTranslatedAriaLabel() {
    const filterType =
      getFilterType();


    const translationKeys:
      Record<
        string,
        string
      > = {
      specialty:
        "filters.specialty",

      city:
        "filters.city",

      insurance:
        "filters.insurance",

      rating:
        "filters.rating",

      language:
        "filters.language",

      sort:
        "filters.sort",
    };


    const translationKey =
      translationKeys[
        filterType
      ];


    if (
      !translationKey
    ) {
      return ariaLabel;
    }


    return t(
      translationKey,
      {
        defaultValue:
          ariaLabel,
      }
    );
  }


  /* ===================================================
     CLICK OUTSIDE
  =================================================== */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        !containerRef.current
      ) {
        return;
      }


      if (
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(
          false
        );
      }
    }


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);


  /* ===================================================
     ESCAPE KEY
  =================================================== */

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setIsOpen(
          false
        );
      }
    }


    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);


  /* ===================================================
     SELECT OPTION
  =================================================== */

  function selectOption(
    optionValue: string
  ) {
    onChange(
      optionValue
    );


    setIsOpen(
      false
    );
  }


  /* ===================================================
     UI
  =================================================== */

  const translatedAriaLabel =
    getTranslatedAriaLabel();


  return (
    <div
      ref={containerRef}
      className={
        isOpen
          ? "custom-select open"
          : "custom-select"
      }
    >

      <button
        type="button"
        className="custom-select-trigger"
        aria-label={
          translatedAriaLabel
        }
        aria-haspopup="listbox"
        aria-expanded={
          isOpen
        }
        disabled={
          disabled
        }
        onClick={() => {
          if (
            disabled
          ) {
            return;
          }

          setIsOpen(
            current =>
              !current
          );
        }}
      >

        <span className="custom-select-value">
          {
            selectedOption
              ? getOptionLabel(
                  selectedOption
                )
              : "Επιλογή"
          }
        </span>

        <span
          className="custom-select-chevron"
          aria-hidden="true"
        >
          ⌄
        </span>

      </button>


      {isOpen && (
        <div
          className="custom-select-menu"
          role="listbox"
          aria-label={
            translatedAriaLabel
          }
        >

          {options.map(
            option => {
              const isSelected =
                option.value ===
                value;


              return (
                <button
                  key={
                    option.value
                  }
                  type="button"
                  role="option"
                  aria-selected={
                    isSelected
                  }
                  className={
                    isSelected
                      ? "custom-select-option selected"
                      : "custom-select-option"
                  }
                  onClick={() =>
                    selectOption(
                      option.value
                    )
                  }
                >

                  <span className="custom-select-option-label">
                    {
                      getOptionLabel(
                        option
                      )
                    }
                  </span>

                  <span
                    className="custom-select-check"
                    aria-hidden="true"
                  >
                    {
                      isSelected
                        ? "✓"
                        : ""
                    }
                  </span>

                </button>
              );
            }
          )}

        </div>
      )}

    </div>
  );
}


export default CustomSelect;