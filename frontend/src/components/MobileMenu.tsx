// frontend/src/components/MobileMenu.tsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import SideMenu from "./SideMenu"; // Reutilizamos o SideMenu!
import ApplicationLogo from "./ApplicationLogo";
import Link from "next/link";
import "./SideMenu.css";


export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Função para fechar o menu, que será passada para o SideMenu
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Barra superior fixa */}
      <header className="mobile-header">
        <Link href="/dashboard" className="mobile-header-logo-link">
          <ApplicationLogo className="block h-8 w-auto text-primary" />
          <span className="mobile-header-title">Q+</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="mobile-header-button"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Overlay que aparece quando o menu está aberto */}
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div
            className="mobile-menu-drawer"
            onClick={(e) => e.stopPropagation()} // Evita que o clique dentro do menu o feche
          >
            {/* O SideMenu é renderizado aqui dentro! */}
            <SideMenu
              collapsed={false}
              setCollapsed={() => {}} // Não precisamos da função de recolher no mobile
              isMobile={true} // Prop para indicar o modo móvel
              onCloseMenu={closeMenu} // Passamos a função para fechar
            />
          </div>
        </div>
      )}
    </>
  );
}
