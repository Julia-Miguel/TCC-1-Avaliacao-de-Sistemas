// frontend/src/components/SideMenu.tsx
"use client";

import {
  Link2,
  Users,
  ClipboardList,
  LayoutDashboard,
  FileQuestion,
  UserRoundCheck,
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
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Questionários", icon: ClipboardList, href: "/questionarios" },
  { label: "Perguntas Base", icon: FileQuestion, href: "/perguntas" },
  { label: "Associar P-Q", icon: Link2, href: "/queperg" },
  { label: "Avaliações", icon: UserRoundCheck, href: "/avaliacao" },
  { label: "Usuários", icon: Users, href: "/usuario" },
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
       <Link href={loggedInAdmin ? "/dashboard" : "/"} className="side-menu-logo-link">
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