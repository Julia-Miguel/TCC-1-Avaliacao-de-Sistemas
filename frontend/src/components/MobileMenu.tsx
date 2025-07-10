// frontend/src/components/MobileMenu.tsx
"use client";

import { useState } from "react";
import { menuItems } from "./menuItems";
import { Menu as HamburgerIcon } from "lucide-react";
import Link from "next/link";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-background-element p-4 flex justify-between items-center border-b border-border">
      <span className="text-foreground font-bold text-lg">Evaluation</span>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-foreground focus:outline-none"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        <HamburgerIcon size={24} />
      </button>
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background-element shadow-lg z-50">
          <ul className="p-4">
            {menuItems.map((item) => (
              <li key={item.id} className="mb-4">
                {item.items ? (
                  <>
                    <span className="font-semibold text-foreground text-base">
                      {item.label}
                    </span>
                    <ul className="ml-4 mt-2 space-y-2">
                      {item.items.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            href={subItem.href}
                            className="text-text-muted hover:text-primary transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="text-text-muted hover:text-primary transition-colors text-base"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}