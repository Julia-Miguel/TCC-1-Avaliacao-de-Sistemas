"use client";

import React, { createContext, useState, useContext, useEffect, useMemo } from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(prev => !prev);

  useEffect(() => {
    const newClass = darkMode ? "dark-mode" : "light-mode";
    document.body.classList.remove("dark-mode", "light-mode");
    document.body.classList.add(newClass);
  }, [darkMode]);

  const contextValue = useMemo(() => ({ darkMode, toggleTheme }), [darkMode]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
