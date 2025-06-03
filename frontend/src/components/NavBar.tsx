// frontend/src/components/NavBar.tsx (VERSÃO UNIFICADA)
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // useRouter para o logout do AuthContext
import {
  ChevronDown,
  Menu as MenuIcon,
  X as XIcon,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

import ApplicationLogo from "./ApplicationLogo";
import NavLink from "./NavLink";
import ThemeToggle from "@/components/menu/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext"; // <<< NOSSA LÓGICA DE AUTENTICAÇÃO

// Interface AdminUser do nosso AuthContext
interface AdminUser {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  empresaId: number;
}

interface NavLinkItem {
  href: string;
  label: string;
}

// Removida a prop 'header' e 'children' daqui, pois este componente
// será apenas a barra de navegação, e o RootLayout gerenciará os children principais.
export default function NavbarLayout() {
  const { loggedInAdmin, logoutAdmin, isLoadingAuth } = useAuth(); // <<< DADOS DO ADMIN LOGADO
  const router = useRouter(); // Para o logout do AuthContext, se ele não redirecionar
  
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const pathname = usePathname();
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Links da área administrativa - só aparecem se logado
  const adminNavLinks: NavLinkItem[] = [
    { href: "/questionarios", label: "Questionários" },
    { href: "/perguntas", label: "Perguntas Base" },
    { href: "/queperg", label: "Associar P-Q" },
    { href: "/avaliacao", label: "Avaliações" },
    // Adicione outros links de admin aqui
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showUserDropdown &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        showingNavigationDropdown &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('#mobile-menu')
      ) {
        setShowingNavigationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown, showingNavigationDropdown]);

  const handleLogoutClick = () => {
    logoutAdmin(); // Função do AuthContext que limpa localStorage e estado
    // O redirecionamento já é feito pelo AuthContext ou você pode adicionar um aqui se necessário
    // router.push('/empresas/login'); 
    setShowUserDropdown(false); // Fecha o dropdown
  };


  // Enquanto o AuthContext está carregando o estado inicial, podemos mostrar um loader simples
  if (isLoadingAuth) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-element-bg border-b border-main-border shadow-sm print:hidden">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                <ApplicationLogo className="block h-8 w-auto text-primary" />
                <span className="font-semibold text-lg text-text-base hidden sm:block">Evaluation</span>
              </Link>
            </div>
            <div className="text-sm text-text-muted">Carregando...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-element-bg border-b border-main-border shadow-sm print:hidden">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Esquerda */}
          <div className="flex items-center">
            <Link href={loggedInAdmin ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center gap-2"> {/* Link para dashboard se logado */}
              <ApplicationLogo className="block h-8 w-auto text-primary" />
              <span className="font-semibold text-lg text-text-base hidden sm:block">
                Evaluation
              </span>
            </Link>

            {/* Links de Navegação para Admin Logado */}
            {loggedInAdmin && (
              <div className="hidden md:ml-6 md:flex md:space-x-1 lg:space-x-2">
                {adminNavLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    active={ pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)) }
                    className="px-3 py-2"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Direita */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <ThemeToggle />

            {loggedInAdmin ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  id="user-menu-button"
                  type="button"
                  onClick={() => setShowUserDropdown((prev) => !prev)}
                  className="flex items-center rounded-full p-1 text-text-muted hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-element-bg"
                  aria-expanded={showUserDropdown ? 'true' : 'false'}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Abrir menu do usuário</span>
                  <UserCircle size={24} className="h-7 w-7 rounded-full text-text-muted" />
                  <span className="mx-1 text-sm font-medium text-text-base">{loggedInAdmin.nome}</span>
                  <ChevronDown size={18} aria-hidden="true" />
                </button>

                {showUserDropdown && (
                  <div
                    id="user-menu"
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-element-bg shadow-lg ring-1 ring-main-border ring-opacity-5 focus:outline-none py-1 z-20"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm text-text-base font-semibold">{loggedInAdmin.nome}</p>
                      <p className="text-xs text-text-muted truncate">{loggedInAdmin.email}</p>
                    </div>
                    <div className="border-t border-main-border my-1"></div>
                    <Link
                      href="/admin/profile" // Defina a rota do perfil do admin
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-text-base hover:bg-page-bg hover:text-primary"
                      role="menuitem"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <UserCircle size={16} className="mr-2" /> Meu Perfil
                    </Link>
                    {/* <Link
                      href="/config" // Se tiver uma página de configurações
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-text-base hover:bg-page-bg hover:text-primary"
                      role="menuitem"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <Settings size={16} className="mr-2" /> Configurações
                    </Link> */}
                    <div className="border-t border-main-border my-1"></div>
                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10"
                      role="menuitem"
                    >
                      <LogOut size={16} className="mr-2" /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink href="/empresas/login" active={pathname === "/empresas/login"}>
                Login Empresa
              </NavLink>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <ThemeToggle />
            <button
              ref={mobileMenuButtonRef}
              type="button"
              onClick={() => setShowingNavigationDropdown((prev) => !prev)}
              className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-text-muted hover:bg-page-bg hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={showingNavigationDropdown ? 'true' : 'false'}
            >
              <span className="sr-only">Abrir menu principal</span>
              {showingNavigationDropdown ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {showingNavigationDropdown && (
        <div className="md:hidden border-t border-main-border bg-element-bg shadow-lg" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {loggedInAdmin ? adminNavLinks.map((link) => ( // Mostra links de admin se logado
              <NavLink
                key={link.href}
                href={link.href}
                active={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))}
                className="block rounded-md px-3 py-2 text-base font-medium"
                onClick={() => setShowingNavigationDropdown(false)}
              >
                {link.label}
              </NavLink>
            )) : ( // Senão, mostra link de login empresa
               <NavLink
                href="/empresas/login"
                active={pathname === "/empresas/login"}
                className="block rounded-md px-3 py-2 text-base font-medium"
                onClick={() => setShowingNavigationDropdown(false)}
              >
                Login Empresa
              </NavLink>
            )}
          </div>
          {loggedInAdmin && (
            <div className="border-t border-main-border pb-3 pt-4">
              <div className="flex items-center px-5">
                <UserCircle size={32} className="h-10 w-10 rounded-full text-text-muted" />
                <div className="ml-3">
                  <div className="text-base font-medium text-text-base">{loggedInAdmin.nome}</div>
                  <div className="text-sm font-medium text-text-muted">{loggedInAdmin.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <NavLink
                  href="/admin/profile"
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-page-bg hover:text-primary"
                  onClick={() => setShowingNavigationDropdown(false)}
                >
                  Meu Perfil
                </NavLink>
                {/* <NavLink
                  href="/config"
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-page-bg hover:text-primary"
                  onClick={() => setShowingNavigationDropdown(false)}
                >
                  Configurações
                </NavLink> */}
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-text-base hover:bg-page-bg hover:text-primary"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}