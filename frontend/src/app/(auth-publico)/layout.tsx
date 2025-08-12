// frontend/src/app/(auth-publico)/layout.tsx
import type { Metadata } from "next";
import "../globals.css"; // Seu globals.css unificado

// Metadata específica para estas páginas, se desejar
export const metadata: Metadata = {
    title: "Acesso Cliente - Sistema de Avaliação",
    description: "Registro e Login para Clientes da Plataforma",
};

export default function AuthPublicoLayout({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    return (
        // A tag <html> e <body> já são providenciadas pelo RootLayout principal.
        // Este layout só precisa fornecer a estrutura INTERNA para este grupo.
        // As classes aqui são para centralizar o conteúdo do formulário.
        <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="w-full max-w-md bg-card-background dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
                {/* Você pode adicionar um logo da aplicação aqui se desejar */}
                {children}
            </div>
        </main>
    );
}
