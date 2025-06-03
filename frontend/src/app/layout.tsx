// frontend/src/app/layout.tsx
'use client'; 

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarLayout from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import { ThemeProvider } from "@/components/menu/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const noNavSideBarRoutes = [
    "/empresas/registrar", 
    "/empresas/login", 
    "/admin/login" // Adicione a página de login do admin aqui também
  ];

  // Verifica se a rota atual começa com alguma das rotas da lista
  const showNavAndSidebar = !noNavSideBarRoutes.some(route => pathname.startsWith(route));

  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              {showNavAndSidebar ? (
                <>
                  <NavbarLayout /> {/* Renderiza a Navbar no topo */}
                  <div className="flex flex-1 pt-16"> {/* pt-16 para compensar a altura da Navbar (h-16 = 4rem) */}
                    <SideMenu /> {/* SideMenu fixo à esquerda */}
                    <main className="flex-1 md:pl-64 bg-background text-foreground overflow-y-auto"> {/* pl-64 compensa SideMenu em telas md+ */}
                      <div className="page-container p-4 md:p-6"> {/* page-container para padding/max-width internos */}
                        <Suspense fallback={<div>Carregando página...</div>}>
                           {children}
                        </Suspense>
                      </div>
                    </main>
                  </div>
                </>
              ) : (
                // Para rotas sem Navbar/Sidebar, renderiza children diretamente.
                // O layout específico do grupo (ex: (auth-empresa)/layout.tsx) cuidará da estrutura.
                <Suspense fallback={<div>Carregando página...</div>}>
                  {children}
                </Suspense>
              )}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}