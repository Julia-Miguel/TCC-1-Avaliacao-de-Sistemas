// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarLayout from "@/components/NavBar";
import SideMenu from "@/components/SideMenu";
import { ThemeProvider } from "@/components/menu/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Avaliação",
  description: "Página de avaliação com dashboard e relatórios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 text-gray-900 antialiased`}>
        <ThemeProvider>
          <NavbarLayout>
            <div className="flex h-screen pt-16">
              <SideMenu />
              <main className="flex-1 p-8 bg-gray-50 overflow-auto">{children}</main>
            </div>
          </NavbarLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
