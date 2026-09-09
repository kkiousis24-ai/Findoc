import {
  useEffect,
} from "react";

import {
  useTranslation,
} from "react-i18next";


function FilterTranslationBridge() {
  const {
    t,
    i18n,
  } =
    useTranslation();


  useEffect(() => {
    /* =================================================
       FILTER HEADINGS
    ================================================= */

    const filterLabels =
      document.querySelectorAll(
        ".search-item label"
      );


    const translatedLabels = [
      t(
        "filters.specialty"
      ),

      t(
        "filters.city"
      ),

      t(
        "filters.area"
      ),

      t(
        "filters.insurance"
      ),

      t(
        "filters.maxPrice"
      ),

      t(
        "filters.rating"
      ),

      t(
        "filters.language"
      ),

      t(
        "filters.sort"
      ),
    ];


    filterLabels.forEach(
      (
        label,
        index
      ) => {
        const translatedLabel =
          translatedLabels[
            index
          ];


        if (
          translatedLabel
        ) {
          label.textContent =
            translatedLabel;
        }
      }
    );


    /* =================================================
       INPUT PLACEHOLDERS
    ================================================= */

    const areaInput =
      document.querySelector(
        '.search-item input[type="text"]'
      );


    if (
      areaInput instanceof
      HTMLInputElement
    ) {
      areaInput.placeholder =
        t(
          "filterOptions.placeholders.area",
          {
            defaultValue:
              "e.g. Kolonaki",
          }
        );
    }


    const priceInput =
      document.querySelector(
        '.search-item input[type="number"]'
      );


    if (
      priceInput instanceof
      HTMLInputElement
    ) {
      priceInput.placeholder =
        t(
          "filterOptions.placeholders.maxPrice",
          {
            defaultValue:
              "e.g. 60",
          }
        );
    }


    /* =================================================
       SEARCH BUTTON
    ================================================= */

    const searchButton =
      document.querySelector(
        ".main-search-button"
      );


    if (
      searchButton
    ) {
      searchButton.textContent =
        t(
          "common.search"
        );
    }


    /* =================================================
       TRUST ROW
       Preserve checkbox elements — change text only.
    ================================================= */

    const trustLabels =
      document.querySelectorAll(
        ".trust-row label"
      );


    function updateCheckboxLabel(
      label: Element | undefined,
      translatedText: string
    ) {
      if (
        !label
      ) {
        return;
      }


      const input =
        label.querySelector(
          'input[type="checkbox"]'
        );


      if (
        !input
      ) {
        return;
      }


      const textNodes =
        Array.from(
          label.childNodes
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


      label.append(
        document.createTextNode(
          ` ${translatedText}`
        )
      );
    }


    updateCheckboxLabel(
      trustLabels[0],
      t(
        "filters.onlineOnly"
      )
    );


    updateCheckboxLabel(
      trustLabels[1],
      t(
        "filters.verifiedOnly"
      )
    );


    /* =================================================
       CLEAR FILTERS
    ================================================= */

    const clearButton =
      document.querySelector(
        ".trust-row button"
      );


    if (
      clearButton
    ) {
      clearButton.textContent =
        t(
          "filters.clear"
        );
    }


    /* =================================================
       DOCUMENT LANGUAGE
    ================================================= */

    const currentLanguage =
      i18n.language
        .split("-")[0]
        .toLowerCase();


    document.documentElement.lang =
      currentLanguage;
  }, [
    i18n.language,
    t,
  ]);


  return null;
}


export default FilterTranslationBridge;