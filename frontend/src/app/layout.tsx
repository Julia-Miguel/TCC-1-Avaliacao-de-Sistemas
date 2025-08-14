'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideMenu from "@/components/SideMenu";
import MobileMenu from "@/components/MobileMenu";
import { ThemeProvider } from "@/components/menu/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import Head from "next/head"; // Import necessário

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

  // Rotas que não mostram menu
  const noNavSideBarRoutes = [
    "/empresas/registrar", 
    "/empresas/login", 
    "/admin/login",
    "/admin/registrar",
    "/clientes/login",
    "/clientes/registrar",
    "/responder" 
  ];

  const showNavAndSidebar = !noNavSideBarRoutes.some(route => pathname.startsWith(route));

  // Mapeamento de títulos por rota
  const pageTitle = useMemo(() => {
    const map: Record<string, string> = {
      "/dashboard": "Q+ - Dashboard",
      "/questionarios": "Q+ - Questionários",
      "/avaliacao": "Q+ - Avaliações",
      "/usuario": "Q+ - Administradores",
      "/empresas/login": "Login Empresa - Q+",
      "/admin/login": "Login Admin - Q+",
      "/clientes/login": "Login Cliente - Q+",
    };
    // Busca exata ou rota inicial
    return map[pathname] || "Q+ - Sistema de Avaliação";
  }, [pathname]);

  return (
    <html lang="pt" suppressHydrationWarning>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Sistema de questionários e avaliações Q+" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {showNavAndSidebar ? (
              <>
                <div className="hidden md:flex h-screen">
                  <SideMenu collapsed={collapsed} setCollapsed={setCollapsed} />
                  <div
                    className={`
                      flex flex-col flex-1 h-screen 
                      transition-[margin-left] ease-in-out duration-300
                      ${collapsed ? "md:ml-16" : "md:ml-64"}
                    `}
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
