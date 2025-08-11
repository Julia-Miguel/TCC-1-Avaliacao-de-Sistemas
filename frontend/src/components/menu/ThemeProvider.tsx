'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

interface CustomThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<CustomThemeContextType>({
  darkMode: false,
  toggleTheme: () => {},
});

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleTheme = React.useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  React.useEffect(() => {
    const newClass = darkMode ? 'dark-mode' : 'light-mode';
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(newClass);
  }, [darkMode]);

  const contextValue = React.useMemo(
    () => ({ darkMode, toggleTheme }),
    [darkMode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => React.useContext(ThemeContext);
