// frontend/src/components/NavBar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import ApplicationLogo from "./ApplicationLogo";
import Dropdown from "./Dropdown";
import NavLink from "./NavLink";
import ThemeToggle from "@/components/menu/ThemeToggle";

interface NavbarProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
}

export default function NavbarLayout({ header, children }: NavbarProps) {
  const user = {
    name: "Fulano de Tal",
    email: "fulano@example.com",
  };

  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <div>
      {/* Removido bg-white para deixar o CSS de tema controlar o background */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Seção Esquerda */}
            <div className="flex items-center">
              <Link href="/">
                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
              </Link>
              <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                <NavLink href="/perguntas" active={false}>Perguntas</NavLink>
                <NavLink href="/questionarios" active={false}>Questionarios</NavLink>
                <NavLink href="/queperg" active={false}>Queperg</NavLink>
                <NavLink href="/avaliacao" active={false}>Avaliação</NavLink>
                <NavLink href="/respostas" active={false}>Respostas</NavLink>
              </div>
            </div>

            {/* Seção Direita */}
            <div className="hidden sm:flex sm:items-center space-x-4">
              <ThemeToggle />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown((prev) => !prev)}
                  className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {user.name}
                  <svg
                    className="-mr-0.5 ml-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293..."
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md py-2 shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                    <Dropdown.Trigger>
                      <span>Opções</span>
                    </Dropdown.Trigger>
                    <Dropdown.Content align="right">
                      <Dropdown.Link href="/profile">Profile</Dropdown.Link>
                      <button
                        onClick={() => alert("Fazer logout")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </Dropdown.Content>
                  </div>
                )}
              </div>
            </div>

            {/* Botão Mobile */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                title="Toggle Navigation"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path
                    className={showingNavigationDropdown ? "hidden" : "inline-flex"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={showingNavigationDropdown ? "inline-flex" : "hidden"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {showingNavigationDropdown && (
          <div className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              <NavLink href="/perguntas" active={false}>Perguntas</NavLink>
              <NavLink href="/questionarios" active={false}>Questionarios</NavLink>
              <NavLink href="/queperg" active={false}>Queperg</NavLink>
              <NavLink href="/avaliacao" active={false}>Avaliacao</NavLink>
              <NavLink href="/respostas" active={false}>Respostas</NavLink>
            </div>
            <div className="border-t border-gray-200 pb-1 pt-4">
              <div className="px-4">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
              <div className="mt-3 space-y-1">
                <NavLink href="/profile" active={false}>Profile</NavLink>
                <button
                  onClick={() => alert("Fazer logout")}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-16">
        {header && (
          <header className="bg-white shadow mb-4">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {header}
            </div>
          </header>
        )}

        {children}
      </main>
    </div>
  );
}
