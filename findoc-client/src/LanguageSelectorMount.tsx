import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import LanguageSelector from "./LanguageSelector";


function LanguageSelectorMount() {
  const [
    mountNode,
    setMountNode,
  ] =
    useState<HTMLDivElement | null>(
      null
    );


  useEffect(() => {
    const oldLanguageButton =
      document.querySelector(
        ".language-button"
      );

    if (!oldLanguageButton) {
      return;
    }


    const existing =
      document.querySelector(
        ".language-selector-slot"
      );

    if (
      existing instanceof
      HTMLDivElement
    ) {
      oldLanguageButton.setAttribute(
        "style",
        "display: none;"
      );

      setMountNode(
        existing
      );

      return;
    }


    const slot =
      document.createElement(
        "div"
      );

    slot.className =
      "language-selector-slot";


    oldLanguageButton.insertAdjacentElement(
      "beforebegin",
      slot
    );


    oldLanguageButton.setAttribute(
      "style",
      "display: none;"
    );


    setMountNode(
      slot
    );


    return () => {
      oldLanguageButton.removeAttribute(
        "style"
      );

      slot.remove();
    };
  }, []);


  if (!mountNode) {
    return null;
  }


  return createPortal(
    <LanguageSelector />,
    mountNode
  );
}


export default LanguageSelectorMount;