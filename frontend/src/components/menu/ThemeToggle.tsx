import { useThemeContext } from "./ThemeProvider";
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useThemeContext();

  return (
    <button className={`theme-toggle ${darkMode ? 'dark' : 'light'}`} onClick={toggleTheme}>
      <div className="toggle-circle"></div>
      <span>{darkMode ? 'Claro' : 'Escuro'}</span>
    </button>
  );
}

export default ThemeToggle;