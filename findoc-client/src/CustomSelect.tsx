import {
  useEffect,
  useRef,
  useState,
} from "react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: CustomSelectOption[];
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
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

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
        setIsOpen(false);
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
        setIsOpen(false);
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

  return (
    <div
      ref={containerRef}
      className={
        isOpen
          ? "custom-select open"
          : "custom-select"
      }
    >

      {/* TRIGGER */}

      <button
        type="button"
        className="custom-select-trigger"
        aria-label={
          ariaLabel
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
            selectedOption?.label ??
            "Επιλογή"
          }
        </span>

        <span
          className="custom-select-chevron"
          aria-hidden="true"
        >
         ⌄
        </span>

      </button>

      {/* MENU */}

      {isOpen && (
        <div
          className="custom-select-menu"
          role="listbox"
          aria-label={
            ariaLabel
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
                      option.label
                    }
                  </span>

                  <span
                    className="custom-select-check"
                    aria-hidden="true"
                  >
                    {isSelected
                      ? "✓"
                      : ""}
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