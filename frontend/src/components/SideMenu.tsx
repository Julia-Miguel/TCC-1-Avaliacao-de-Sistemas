// frontend/src/components/SideMenu.tsx
"use client";

import { Home, User, Settings } from "lucide-react"; //
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./SideMenu.css"; //

const menuItems = [
  { label: "Início", icon: Home, href: "/" },
  { label: "Usuários", icon: User, href: "/usuario" }, //
  // Adicione outros itens conforme sua navbar
  { label: "Perguntas", icon: Settings /* Trocar ícone */, href: "/perguntas" },
  { label: "Questionários", icon: Settings /* Trocar ícone */, href: "/questionarios" },
  // ... etc
  { label: "Configurações", icon: Settings, href: "/config" },
];

export default function SideMenu() {
  const pathname = usePathname();

  return (
    // Aplicar a classe gradient-border aqui se desejado
    <aside className="side-menu"> {/* Removido gradient-border para simplificar, adicione se quiser */}
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
        {/* Melhor usar <p> ou <span> para direitos autorais */}
        <p>Todos os direitos reservados a Juju™</p>
      </div>
    </aside>
  );
}