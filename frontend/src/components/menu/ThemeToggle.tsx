"use client";

import { useTheme } from "./ThemeProvider";
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  const buttonLabel = darkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro';

  return (
    <button
      className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
      onClick={toggleTheme}
    >
      <div className="toggle-circle"></div>
      <span className="sr-only">{buttonLabel}</span>
    </button>
  );
}

export default ThemeToggle;