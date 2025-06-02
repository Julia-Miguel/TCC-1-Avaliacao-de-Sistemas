// frontend/src/app/layout.tsx
'use client'; 

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarLayout from "@/components/NavBar"; // Veremos como ele usa o useAuth
import SideMenu from "@/components/SideMenu";
import { ThemeProvider } from "@/components/menu/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext"; // <<< Importe
import { usePathname } from "next/navigation";

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

// export const metadata: Metadata = { /* ... */ }; // Movido para Server Components ou generateMetadata

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noNavSideBarRoutes = ["/empresas/registrar", "/empresas/login", "/admin/login"]; // Ajuste se /admin/login for para o grupo (auth-empresa)
  const showNavAndSidebar = !noNavSideBarRoutes.some(route => pathname.startsWith(route));

  return (
    <html lang="pt">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 text-gray-900 antialiased`}>
        <ThemeProvider>
          <AuthProvider> {/* <<< ENVOLVA COM AuthProvider */}
            {showNavAndSidebar ? (
              <NavbarLayout> {/* NavbarLayout agora pode usar useAuth() */}
                <div className="flex-1 md:pl-64">
                  <SideMenu />
                  <main className="flex-1 p-4 md:p-6">{children}</main>
                </div>
              </NavbarLayout>
            ) : (
              children 
            )}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}