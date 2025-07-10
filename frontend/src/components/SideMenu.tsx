"use client";

import {
  Home,
  Users,
  HelpCircle,
  FileText,
  BarChart2,
  Settings,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./SideMenu.css";

const menuItems = [
  { label: "Início", icon: Home, href: "/" },
  { label: "Usuários", icon: Users, href: "/usuario" },
  { label: "Perguntas", icon: HelpCircle, href: "/perguntas" },
  { label: "Questionários", icon: FileText, href: "/questionarios" },
  { label: "Dashboards", icon: BarChart2, href: "/dashboard" },
  { label: "Configurações", icon: Settings, href: "/config" },
];

interface SideMenuProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function SideMenu({ collapsed, setCollapsed }: SideMenuProps) {
  const pathname = usePathname();

  return (
    <aside className={`side-menu ${collapsed ? "collapsed" : ""}`}>
      <div className="side-menu-header">
        <button
          className="hamburger-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Abrir menu" : "Fechar menu"}
          aria-label={collapsed ? "Abrir menu" : "Fechar menu"}
        >
          <Menu />
        </button>
        {!collapsed && <span className="side-menu-title">Painel</span>}
      </div>

      <nav className="side-menu-nav">
        {menuItems.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`side-menu-link ${isActive ? "active" : ""}`}
            >
              <Icon className="side-menu-icon" />
              {!collapsed && <span className="side-menu-label">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="side-menu-footer">
        {!collapsed && <p>Todos os direitos reservados a Juju™</p>}
      </div>
    </aside>
  );
}