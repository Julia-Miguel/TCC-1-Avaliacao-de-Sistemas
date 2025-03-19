// src/components/main.tsx
"use client";

import Menu from "@/components/menu/Menu";
import { ThemeProvider } from "@/components/menu/ThemeProvider";
import "./main.css"; // Importa os estilos específicos

export default function Main() {
  return (
    <div className="App">
      <ThemeProvider>
        <Menu />
      </ThemeProvider>
    </div>
  );
}