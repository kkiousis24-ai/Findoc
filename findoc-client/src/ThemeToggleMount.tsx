import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import ThemeToggle from "./ThemeToggle";

function ThemeToggleMount() {
  const [
    mountNode,
    setMountNode,
  ] =
    useState<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    const navActions =
      document.querySelector(
        ".nav-actions"
      );

    const languageButton =
      document.querySelector(
        ".language-button"
      );

    if (
      !navActions ||
      !languageButton
    ) {
      return;
    }

    const existing =
      document.querySelector(
        ".theme-toggle-slot"
      );

    if (
      existing instanceof
      HTMLDivElement
    ) {
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
      "theme-toggle-slot";

    languageButton.insertAdjacentElement(
      "afterend",
      slot
    );

    setMountNode(
      slot
    );

    return () => {
      slot.remove();
    };
  }, []);

  if (!mountNode) {
    return null;
  }

  return createPortal(
    <ThemeToggle />,
    mountNode
  );
}

export default ThemeToggleMount;