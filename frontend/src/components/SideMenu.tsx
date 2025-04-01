// src/components/SideMenu.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideMenu() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zm0-8h8V3h-8v10zM3 21h8v-6H3v6z" />
        </svg>
      ),
    },
    {
      href: "/relatorios",
      label: "Relatórios",
      icon: (
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z" />
        </svg>
      ),
    },
    {
      href: "/configuracoes",
      label: "Configurações",
      icon: (
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
        </svg>
      ),
    },
    {
      href: "/suporte",
      label: "Suporte",
      icon: (
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 h-[calc(100vh-64px)] bg-[#826C5B] text-white p-6 flex flex-col shadow-lg">
      {/* Cabeçalho do Menu */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Menu Avaliação</h2>
      </div>

      {/* Itens de Navegação */}
      <nav className="flex-1">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded transition-colors hover:bg-opacity-80 ${
                  pathname === item.href ? "bg-opacity-80" : ""
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Rodapé do Menu */}
      <div className="pt-6 mt-auto border-t border-opacity-50">
        <p className="text-xs opacity-80">&copy; {new Date().getFullYear()} Sistema de Avaliação</p>
      </div>
    </aside>
  );
}