import {
  useEffect,
  useState,
} from "react";

type Theme =
  | "dark"
  | "light";

function getInitialTheme(): Theme {
  const savedTheme =
    localStorage.getItem(
      "findoc_theme"
    );

  if (
    savedTheme === "dark" ||
    savedTheme === "light"
  ) {
    return savedTheme;
  }

  const prefersLight =
    window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;

  return prefersLight
    ? "light"
    : "dark";
}

function ThemeToggle() {
  const [
    theme,
    setTheme,
  ] =
    useState<Theme>(
      getInitialTheme
    );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "findoc_theme",
      theme
    );
  }, [theme]);

  function toggleTheme() {
    setTheme(
      currentTheme =>
        currentTheme ===
        "dark"
          ? "light"
          : "dark"
    );
  }

  const isDark =
    theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Ενεργοποίηση φωτεινού θέματος"
          : "Ενεργοποίηση σκοτεινού θέματος"
      }
      title={
        isDark
          ? "Light mode"
          : "Dark mode"
      }
    >
      <span
        className="theme-toggle-icon"
        aria-hidden="true"
      >
        {isDark
          ? "☀"
          : "☾"}
      </span>
    </button>
  );
}

export default ThemeToggle;