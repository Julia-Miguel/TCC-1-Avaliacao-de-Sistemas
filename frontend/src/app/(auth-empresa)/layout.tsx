// frontend/src/app/(auth-empresa)/layout.tsx
import type { Metadata } from "next";
import "../globals.css"; // Seus estilos globais ainda são importantes
import ApplicationLogo from "@/components/ApplicationLogo"; // Supondo que você queira usar

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-page-bg p-4">
      <div 
        className="w-full bg-element-bg rounded-xl shadow-lg border border-main-border p-6 md:p-10" 
        style={{ maxWidth: 'var(--auth-card-max-width, 28rem)' }} // Use a variável ou fallback
      >
        <div className="flex justify-center mb-6">
          {/* Você pode instanciar seu ApplicationLogo aqui se desejar */}
          {/* Exemplo: <ApplicationLogo className="w-16 h-16 text-primary" /> */}
        </div>
        {children} 
      </div>
    </main>
  );
}