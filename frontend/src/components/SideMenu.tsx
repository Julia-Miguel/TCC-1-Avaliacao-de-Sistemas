"use client";

import {
  Users,
  ClipboardList,
  LayoutDashboard,
  UserRoundCheck,
  Menu as MenuIcon,
  UserCog,
  LogOut,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./SideMenu.css";
import { useAuth } from "@/contexts/AuthContext";
import ApplicationLogo from "./ApplicationLogo";
import ThemeToggle from "@/components/menu/ThemeToggle";
import { useState, useEffect, useMemo } from "react";
import api from "@/services/api";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Questionários", icon: ClipboardList, href: "/questionarios" },
  { label: "Avaliações", icon: UserRoundCheck, href: "/avaliacao" },
  { label: "Administradores", icon: Users, href: "/usuario" },
];

interface SideMenuProps {
  readonly collapsed: boolean;
  readonly setCollapsed: (collapsed: boolean) => void;
  readonly isMobile?: boolean;
  readonly onCloseMenu?: () => void;
}

interface UsuarioInterface {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  created_at: string;
  updated_at: string;
  token: string;
}

export default function SideMenu({
  collapsed,
  setCollapsed,
  isMobile = false,
  onCloseMenu,
}: SideMenuProps) {
  const [usuarios, setUsuarios] = useState<UsuarioInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const { loggedInAdmin, logoutAdmin } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get("/usuario");
        setUsuarios(response.data.usuarios || response.data);
      } catch (err: any) {
        console.error("Erro ao buscar usuários:", err.response?.data ?? err.message);
        setError("Erro ao carregar dados.");
      } finally {
        setIsLoading(false);
      }
    };

    if (loggedInAdmin) {
      fetchUsuarios();
    } else {
      setIsLoading(false);
    }
  }, [loggedInAdmin]);

  const handleLinkClick = () => {
    if (isMobile && onCloseMenu) onCloseMenu();
  };

  const buttonTitle = isMobile
    ? "Fechar menu"
    : collapsed
    ? "Expandir menu"
    : "Recolher menu";

  const currentUserToken = useMemo(() => {
    if (!loggedInAdmin) return undefined;
    const found = usuarios.find(u => String(u.id) === String((loggedInAdmin as any).id));
    return found?.token ?? (loggedInAdmin as any).token ?? undefined;
  }, [usuarios, loggedInAdmin]);

  const renderUserProfile = () => {
    if (isLoading) {
      return (
        <div className="user-profile-feedback">
          <Loader2 aria-hidden="true" className="animate-spin mr-2" size={16} />
          Carregando...
        </div>
      );
    }

    if (error) {
      return (
        <div className="user-profile-feedback error">
          <AlertCircle aria-hidden="true" className="mr-2" size={16} />
          {error}
        </div>
      );
    }

    if (loggedInAdmin) {
      return (
        <div className="user-profile-section">
          <button
            className="user-profile-button"
            onClick={() => setUserMenuOpen(prev => !prev)}
            aria-label="Abrir menu do usuário"
          >
            <div className="user-info">
              <span className="user-name">{loggedInAdmin.nome}</span>
              <span className="user-email">{loggedInAdmin.email}</span>
            </div>
            {userMenuOpen ? (
              <ChevronUp aria-hidden="true" size={20} />
            ) : (
              <ChevronDown aria-hidden="true" size={20} />
            )}
          </button>

          <div className={`user-profile-menu ${userMenuOpen ? "open" : ""}`}>
            <Link
              href={currentUserToken ? `/usuario/update/${currentUserToken}` : `/usuario`}
              className="btn btn-sm btn-outline p-1.5 inline-flex items-center"
              title="Editar Perfil"
              aria-label="Editar Perfil"
              onClick={handleLinkClick}
            >
              <UserCog aria-hidden="true" size={16} className="mr-2" />
              Editar Perfil
            </Link>
            <button
              onClick={() => {
                setUserMenuOpen(false);
                logoutAdmin();
              }}
              className="logout-button"
              aria-label="Sair da conta"
            >
              <LogOut aria-hidden="true" size={16} className="mr-2" />
              Sair
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <aside className={`side-menu ${collapsed ? "collapsed" : ""}`}>
      <div className="side-menu-header">
        <Link
          href={loggedInAdmin ? "/dashboard" : "/"}
          className="side-menu-logo-link"
          aria-label="Ir para página inicial"
        >
          <ApplicationLogo className="block h-8 w-auto text-primary" aria-hidden="true" />
        </Link>
        {!collapsed && <span className="side-menu-title">Q+</span>}
        <button
          type="button"
          className="hamburger-toggle"
          onClick={isMobile ? onCloseMenu : () => setCollapsed(!collapsed)}
          title={buttonTitle}
          aria-label={buttonTitle}
        >
          {isMobile ? <X aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
        </button>
      </div>

      <nav className="side-menu-nav">
        {menuItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`side-menu-link ${isActive ? "active" : ""}`}
              title={label}
              aria-label={`Ir para ${label}`}
              onClick={handleLinkClick}
            >
              <Icon className="side-menu-icon" aria-hidden="true" />
              {!collapsed && <span className="side-menu-label">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="side-menu-footer">
        {!collapsed && renderUserProfile()}
        <div className="theme-toggle-wrapper">
          {!collapsed && <span className="theme-toggle-label">Tema</span>}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
