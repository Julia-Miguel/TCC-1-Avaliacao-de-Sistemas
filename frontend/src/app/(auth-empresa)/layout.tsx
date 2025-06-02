// frontend/src/app/(auth-empresa)/layout.tsx
import type { Metadata } from "next";
import "../globals.css"; // Seus estilos globais ainda são importantes

// Metadata específica para estas páginas, se desejar
export const metadata: Metadata = {
  title: "Acesso da Empresa",
  description: "Registro e Login para Empresas no Sistema de Avaliação",
};

export default function AuthEmpresaLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    // Este <main> será o container para o conteúdo das páginas dentro deste grupo.
    // As classes de Tailwind ou CSS global podem ser usadas para estilizar.
    // Este <main> será renderizado DENTRO do <body> do seu RootLayout.
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Você pode adicionar um card ou um logo específico para esta seção aqui */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 md:p-8">
        {children} 
      </div>
    </main>
  );
}