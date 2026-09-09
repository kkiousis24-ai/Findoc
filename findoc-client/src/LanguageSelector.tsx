import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";

import {
  supportedLanguages,
} from "./i18n";


function LanguageSelector() {
  const {
    i18n,
  } =
    useTranslation();

  const [
    open,
    setOpen,
  ] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );


  /* ===================================================
     CURRENT LANGUAGE
  =================================================== */

  const currentLanguageCode =
    i18n.language
      .split("-")[0]
      .toLowerCase();

  const currentLanguage =
    supportedLanguages.find(
      language =>
        language.code ===
        currentLanguageCode
    ) ??
    supportedLanguages[0];


  /* ===================================================
     CLOSE ON OUTSIDE CLICK / ESC
  =================================================== */

  useEffect(() => {
    function handleMouseDown(
      event: MouseEvent
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }


    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(false);
      }
    }


    document.addEventListener(
      "mousedown",
      handleMouseDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleMouseDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);


  /* ===================================================
     CHANGE LANGUAGE
  =================================================== */

  async function changeLanguage(
    languageCode: string
  ) {
    await i18n.changeLanguage(
      languageCode
    );

    setOpen(false);
  }


  /* ===================================================
     UI
  =================================================== */

  return (
    <div
      className="language-selector"
      ref={containerRef}
    >
      <button
        type="button"
        className="language-selector-trigger"
        onClick={() =>
          setOpen(
            current =>
              !current
          )
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        title={
          currentLanguage.nativeName
        }
      >
        <span className="language-selector-globe">
          ◉
        </span>

        <span className="language-selector-code">
          {currentLanguage.code.toUpperCase()}
        </span>

        <span className="language-selector-chevron">
          {open
            ? "⌃"
            : "⌄"}
        </span>
      </button>


      {open && (
        <div
          className="language-selector-menu"
          role="listbox"
        >
          <div className="language-selector-header">
            <strong>
              Language
            </strong>

            <small>
              Europe
            </small>
          </div>


          <div className="language-selector-list">

            {supportedLanguages.map(
              language => {

                const selected =
                  language.code ===
                  currentLanguageCode;

                return (
                  <button
                    key={
                      language.code
                    }
                    type="button"
                    className={
                      selected
                        ? "language-selector-option selected"
                        : "language-selector-option"
                    }
                    onClick={() =>
                      void changeLanguage(
                        language.code
                      )
                    }
                    role="option"
                    aria-selected={
                      selected
                    }
                  >
                    <span className="language-option-code">
                      {language.code.toUpperCase()}
                    </span>

                    <span className="language-option-name">
                      {language.nativeName}

                      <small>
                        {language.name}
                      </small>
                    </span>

                    {selected && (
                      <span className="language-option-check">
                        ✓
                      </span>
                    )}

                  </button>
                );
              }
            )}

          </div>

        </div>
      )}

    </div>
  );
}


export default LanguageSelector;