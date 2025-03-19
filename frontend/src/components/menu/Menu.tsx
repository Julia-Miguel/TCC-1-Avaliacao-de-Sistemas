// src/components/menu/Menu.tsx
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import "./menu.css";

const Menu = () => {
  return (
    <div className="menu-container">
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>
      <h2>Sistema web questionário</h2>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/perguntas">Perguntas</Link></li>
      </ul>
    </div>
  );
};

export default Menu;