// frontend/src/components/auth/AdminAuthGuard.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Ajuste o caminho se o AuthContext estiver em outro lugar

export default function AdminAuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const { loggedInAdmin, isLoadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Não faz nada enquanto o estado de autenticação ainda está carregando do localStorage
    if (isLoadingAuth) {
      return;
    }

    // Se não estiver logado E o carregamento inicial do auth já terminou, redireciona
    if (!loggedInAdmin && !isLoadingAuth) {
      router.push('/empresas/login'); // Ou para /admin/login se preferir um ponto de entrada único
    }
  }, [loggedInAdmin, isLoadingAuth, router]);

  // Se ainda estiver carregando o estado de autenticação ou se não estiver logado (e o redirecionamento vai acontecer),
  // pode mostrar um loader ou nada para evitar flash de conteúdo.
  if (isLoadingAuth || !loggedInAdmin) {
    return <div className="page-container center-content"><p>Verificando autorização...</p></div>;
    // Ou return null; para não mostrar nada até o redirecionamento ocorrer.
  }

  // Se estiver logado, renderiza a página protegida
  return <>{children}</>;
}