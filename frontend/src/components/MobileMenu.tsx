// frontend/src/components/menu/MobileMenu.tsx
"use client";

import { useState, useRef } from "react";
import { Menu } from "lucide-react";
import Draggable from "react-draggable";
import SideMenu from "./SideMenu";
import ApplicationLogo from "./ApplicationLogo";
import "./SideMenu.css";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  // 1. A posição agora sempre começará em {x: 0, y: 0}
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  // 2. O useEffect que carregava a posição foi REMOVIDO.

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleDragStart = (e: any, data: { x: number; y: number }) => {
    setDragStartPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y };
    
    // 3. A linha que salvava no localStorage foi REMOVIDA.
    // A posição só é atualizada no estado do componente.
    setPosition(newPosition);

    const deltaX = Math.abs(data.x - dragStartPos.x);
    const deltaY = Math.abs(data.y - dragStartPos.y);

    if (deltaX < 5 && deltaY < 5) {
      toggleMenu();
    }
  };

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        position={position}
        onStart={handleDragStart}
        onStop={handleDragStop}
        bounds="parent"
      >
        <button
          ref={nodeRef}
          className="fixed top-4 left-4 z-[1100] p-2 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-100 transition-colors md:hidden cursor-grab active:cursor-grabbing"
          aria-label="Abrir ou mover menu"
        >
          <Menu size={24} />
        </button>
      </Draggable>

      {/* O resto do componente permanece igual */}
      <div
        className={`mobile-overlay ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      ></div>

      <div
        className={`mobile-drawer ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <ApplicationLogo className="block h-10 w-auto text-primary mb-4" />
        </div>

        <SideMenu
          collapsed={false}
          setCollapsed={() => {}}
          isMobile={true}
          onCloseMenu={toggleMenu}
        />
      </div>
    </>
  );
}