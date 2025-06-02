// frontend/src/components/NavBar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ApplicationLogo from "./ApplicationLogo";
import Dropdown from "./Dropdown";
import NavLink from "./NavLink";
import ThemeToggle from "@/components/menu/ThemeToggle";

interface AdminUser {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  empresaId: number;
}

interface NavbarProps {
  readonly header?: React.ReactNode;
  readonly children?: React.ReactNode;
}

export default function NavbarLayout({ header, children }: NavbarProps) {
  const router = useRouter();

  const [loggedInAdmin, setLoggedInAdmin] = useState<AdminUser | null>(null);
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  const [showUserDropdownMenu, setShowUserDropdownMenu] = useState(false);

  useEffect(() => {
    console.log("[NavbarLayout] useEffect executando no cliente."); // LOG 1
    if (typeof window !== "undefined") {
      const adminUserString = localStorage.getItem('adminUser');
      const token = localStorage.getItem('adminToken');
      
      console.log("[NavbarLayout] Token do localStorage:", token); // LOG 2
      console.log("[NavbarLayout] AdminUser string do localStorage:", adminUserString); // LOG 3

      if (adminUserString && token) {
        try {
          const parsedAdminUser = JSON.parse(adminUserString);
          console.log("[NavbarLayout] AdminUser parseado:", parsedAdminUser); // LOG 4
          setLoggedInAdmin(parsedAdminUser);
        } catch (e) {
          console.error("[NavbarLayout] Erro ao parsear dados do usuário do localStorage:", e);
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminToken');
          setLoggedInAdmin(null); // Garante que está nulo se houver erro
        }
      } else {
        console.log("[NavbarLayout] Token ou AdminUser não encontrados no localStorage."); // LOG 5
        setLoggedInAdmin(null); // Garante que está nulo se não encontrar
      }
    }
  }, []); 

  const handleLogout = () => {
    // ... (sua função handleLogout)
    if (typeof window !== "undefined") {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    setLoggedInAdmin(null);
    setShowUserDropdownMenu(false);
    router.push('/empresas/login'); 
    alert("Logout realizado com sucesso!");
  };

  console.log("[NavbarLayout] Estado de loggedInAdmin:", loggedInAdmin); // LOG 6 (fora do useEffect para ver em cada render)

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Seção Esquerda */}
            <div className="flex items-center">
              <Link href="/">
                <ApplicationLogo className="block h-9 w-auto" />
              </Link>
              {/* --- CORREÇÃO IMPORTANTE: Mostrar links se loggedInAdmin for VERDADEIRO --- */}
              {loggedInAdmin && ( 
                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                  <NavLink href="/questionarios" active={false}>Questionários</NavLink>
                  <NavLink href="/perguntas" active={false}>Perguntas Base</NavLink>
                  <NavLink href="/queperg" active={false}>Associar P-Q</NavLink>
                  <NavLink href="/avaliacao" active={false}>Avaliações</NavLink>
                  {/* <NavLink href="/respostas" active={false}>Respostas</NavLink> */}
                  {/* <NavLink href="/usuAval" active={false}>Usuário Avaliado</NavLink> */}
                  {/* <NavLink href="/usuario" active={false}>Usuários Admin</NavLink> */}
                </div>
              )}
            </div>

            {/* Seção Direita */}
            <div className="hidden sm:flex sm:items-center space-x-4">
              <ThemeToggle />
              {loggedInAdmin ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserDropdownMenu((prev) => !prev)}
                    className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
                  >
                    {loggedInAdmin.nome}
                    <svg
                      className="-mr-0.5 ml-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        // Path SVG completo para a seta
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {showUserDropdownMenu && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <Dropdown.Link href="/admin/profile">Meu Perfil</Dropdown.Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink href="/empresas/login" active={false}>Login Empresa</NavLink>
              )}
            </div>

            {/* Botão Mobile */}
            <div className="-mr-2 flex items-center sm:hidden">
              <ThemeToggle />
              <button
                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                title="Toggle Navigation"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path className={showingNavigationDropdown ? "hidden" : "inline-flex"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  <path className={showingNavigationDropdown ? "inline-flex" : "hidden"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {showingNavigationDropdown && (
          <div className="sm:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <div className="space-y-1 pb-3 pt-2 px-2">
              {loggedInAdmin ? (
                <>
                  <NavLink href="/questionarios" active={false}>Questionários</NavLink>
                  <NavLink href="/perguntas" active={false}>Perguntas Base</NavLink>
                  <NavLink href="/queperg" active={false}>Associar P-Q</NavLink>
                  <NavLink href="/avaliacao" active={false}>Avaliações</NavLink>
                </>
              ) : (
                <NavLink href="/empresas/login" active={false}>Login Empresa</NavLink>
              )}
            </div>
            {loggedInAdmin && (
              <div className="border-t border-gray-200 dark:border-gray-700 pb-3 pt-3">
                <div className="px-4">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">{loggedInAdmin.nome}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{loggedInAdmin.email}</div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <NavLink href="/admin/profile" active={false}>Meu Perfil</NavLink>
                  <button onClick={handleLogout} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      <main className="pt-16"> 
        {header && (
          <header className="bg-white dark:bg-gray-800 shadow mb-4">
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