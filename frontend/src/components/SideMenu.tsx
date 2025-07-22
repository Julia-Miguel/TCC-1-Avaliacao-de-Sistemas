// frontend/src/components/SideMenu.tsx
"use client";

import {
  Home,
  Users,
  HelpCircle,
  FileText,
  BarChart2,
  Settings,
  Menu,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./SideMenu.css";
import { useAuth } from "@/contexts/AuthContext";
import ApplicationLogo from "./ApplicationLogo";
import ThemeToggle from "@/components/menu/ThemeToggle";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", icon: BarChart2, href: "/dashboard" },
  { label: "Questionários", icon: FileText, href: "/questionarios" },
  { label: "Perguntas Base", icon: HelpCircle, href: "/perguntas" },
  { label: "Associar P-Q", icon: FileText, href: "/queperg" },
  { label: "Avaliações", icon: FileText, href: "/avaliacao" },
  { label: "Usuários", icon: Users, href: "/usuario" },
  // Adicione outros links de admin aqui
];

interface SideMenuProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function SideMenu({ collapsed, setCollapsed }: SideMenuProps) {
  const pathname = usePathname();
  const { loggedInAdmin, logoutAdmin } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <aside className={`side-menu ${collapsed ? "collapsed" : ""}`}>
      <div className="side-menu-header">
        <Link href={loggedInAdmin ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center gap-2">
            <ApplicationLogo className="block h-8 w-auto text-primary" />
        </Link>
        {!collapsed && <span className="side-menu-title">Evaluation</span>}
        <button
          className="hamburger-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <Menu />
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
            >
              <Icon className="side-menu-icon" />
              {!collapsed && <span className="side-menu-label">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="side-menu-footer">
          {!collapsed && loggedInAdmin && (
              <div className="user-profile-section">
                  <button className="user-profile-button" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                      <div className="user-info">
                          <span className="user-name">{loggedInAdmin.nome}</span>
                          <span className="user-email">{loggedInAdmin.email}</span>
                      </div>
                      {userMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {userMenuOpen && (
                      <div className="user-profile-menu">
                          <button onClick={logoutAdmin} className="logout-button">
                              <LogOut size={16} className="mr-2" />
                              Sair
                          </button>
                      </div>
                  )}
              </div>
          )}
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>
      </div>
    </aside>
  );
}