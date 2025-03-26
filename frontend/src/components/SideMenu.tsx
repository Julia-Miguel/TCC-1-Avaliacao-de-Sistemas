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
          <path d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm7.43-2.1c.04-.33.07-.66.07-1s-.03-.67-.07-1l2.11-1.65a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1a7.007 7.007 0 00-1.73-1L14.5 2.81a.5.5 0 00-.5-.31h-4a.5.5 0 00-.5.31L8.45 5.04a7.007 7.007 0 00-1.73 1l-2.49-1a.5.5 0 00-.61.22l-2 3.46a.5.5 0 00.12.64l2.11 1.65c-.04.33-.07.66-.07 1s.03.67.07 1L2.39 14.05a.5.5 0 00-.12.64l2 3.46c.14.24.44.33.68.22l2.49-1c.54.39 1.12.71 1.73 1l.75 2.29a.5.5 0 00.5.31h4a.5.5 0 00.5-.31l.75-2.29c.61-.29 1.19-.62 1.73-1l2.49 1c.24.11.54.02.68-.22l2-3.46a.5.5 0 00-.12-.64l-2.11-1.65zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
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
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm1.31-7.9l-.95.95C12.45 12.65 12 13.5 12 15h-2v-.5c0-1 .45-1.85 1.17-2.55l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.67-.69 2.3z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 bg-blue-900 text-white p-6 flex flex-col shadow-lg">
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
                className={`flex items-center p-3 rounded transition-colors hover:bg-blue-800 ${
                  pathname === item.href ? "bg-blue-800" : ""
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Rodapé do Menu */}
      <div className="pt-6 mt-auto border-t border-blue-800">
        <p className="text-xs text-blue-300">
          &copy; {new Date().getFullYear()} Sistema de Avaliação
        </p>
      </div>
    </aside>
  );
}
