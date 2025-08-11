"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import Draggable from "react-draggable";
import SideMenu from "./SideMenu";
import ApplicationLogo from "./ApplicationLogo";
import "./SideMenu.css";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const nodeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      try {
        if (typeof dialogRef.current.showModal === "function") {
          dialogRef.current.showModal();
        }
      } catch (err) {
        console.error("Erro ao abrir o diálogo:", err);
      }
    } else if (!isOpen && dialogRef.current) {
      try {
        if (typeof dialogRef.current.close === "function") {
          dialogRef.current.close();
        }
      } catch (err) {
        console.error("Erro ao fechar o diálogo:", err);
      }
    }
  }, [isOpen]);

  const handleDragStart = (_e: any, data: { x: number; y: number }) => {
    setDragStartPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y };
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
          type="button"
          className="fixed top-4 left-4 z-[1200] p-2 rounded-md bg-white shadow-md text-gray-700 hover:bg-gray-100 transition-colors md:hidden cursor-grab active:cursor-grabbing"
          aria-label="Abrir ou mover menu"
        >
          <Menu size={24} />
        </button>
      </Draggable>

      {isOpen && (
        <button
          type="button"
          className={`mobile-overlay ${isOpen ? "open" : ""}`}
          aria-label="Fechar menu"
          onClick={toggleMenu}
        />
      )}

      <dialog
        ref={dialogRef}
        className={`mobile-drawer ${isOpen ? "open" : ""}`}
        aria-modal="true"
      >
        <div className="drawer-content">
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
      </dialog>
    </>
  );
}