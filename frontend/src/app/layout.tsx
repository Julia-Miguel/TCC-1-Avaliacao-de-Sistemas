// frontend/src/app/layout.tsx
'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideMenu from "@/components/SideMenu";
import MobileMenu from "@/components/MobileMenu";
import { ThemeProvider } from "@/components/menu/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";

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
  const [collapsed, setCollapsed] = useState(false);

  const noNavSideBarRoutes = [
    "/empresas/registrar", 
    "/empresas/login", 
    "/admin/login",
    "/clientes/login",
    "/clientes/registrar",
    "/responder" 
  ];

  const showNavAndSidebar = !noNavSideBarRoutes.some(route => pathname.startsWith(route));

  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {showNavAndSidebar ? (
              <>
                <div className="hidden md:flex h-screen">
                  <SideMenu collapsed={collapsed} setCollapsed={setCollapsed} />
                  <div
                    className="flex flex-col flex-1 h-screen"
                    style={{
                      transition: "margin-left 0.3s",
                      marginLeft: collapsed ? "4rem" : "16rem", // Ajustado para a largura da sidebar
                    }}
                  >
                    <main className="flex-1 overflow-y-auto">
                      <div className="page-container p-4 md:p-6">
                        <Suspense fallback={<div className="text-center p-8">Carregando página...</div>}>
                          {children}
                        </Suspense>
                      </div>
                    </main>
                  </div>
                </div>
                <div className="flex flex-col h-screen md:hidden">
                  <MobileMenu />
                  <main className="flex-1 overflow-y-auto">
                    <div className="page-container p-4">
                      <Suspense fallback={<div className="text-center p-8">Carregando página...</div>}>
                        {children}
                      </Suspense>
                    </div>
                  </main>
                </div>
              </>
            ) : (
          // AQUI: o <main> para centralizar o conteúdo das páginas públicas
              <main className="min-h-screen flex flex-col items-center justify-start bg-page-bg p-4 sm:p-6 md:p-8">
                <Suspense fallback={<div className="text-center p-8">Carregando...</div>}>
                  {children}
                </Suspense>
              </main>
            )}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}