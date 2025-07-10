// frontend/src/components/menuItems.ts
import { Home, User, Settings, BarChart2, BookOpen, FileText } from "lucide-react";

export const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
  { id: "questionarios", label: "Questionários", icon: BookOpen, href: "/questionarios" },
  { id: "perguntas", label: "Perguntas", icon: FileText, href: "/perguntas" },
  {
    id: "relatorios",
    label: "Relatórios",
    icon: BarChart2,
    items: [
      { id: "analise", label: "Análise Geral", href: "/dashboard/geral" },
      { id: "respostas", label: "Respostas", href: "/respostas" }
    ]
  },
  { id: "usuarios", label: "Usuários", icon: User, href: "/usuario" },
  { id: "config", label: "Configurações", icon: Settings, href: "/config" },
];