"use client";

import { Home, User, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./SideMenu.css";

const menuItems = [
  { label: "Início", icon: Home, href: "/" },
  { label: "Usuários", icon: User, href: "/usuarios" },
  { label: "Configurações", icon: Settings, href: "/config" },
];

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <aside className="side-menu gradient-border">
      <div className="side-menu-header">
        Painel
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
              <span className="side-menu-label">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="side-menu-footer">
        <h1>Todos os direitos reservados a Juju™</h1>
      </div>
    </aside>
  );
}
