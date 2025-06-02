// frontend/src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN_EMPRESA' | string; // Pode ser mais específico se tiver outros tipos de admin
  empresaId: number;
}

interface AuthContextType {
  loggedInAdmin: AdminUser | null;
  adminToken: string | null;
  isLoadingAuth: boolean; // Para saber se o auth ainda está carregando do localStorage
  loginAdmin: (user: AdminUser, token: string) => void;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInAdmin, setLoggedInAdmin] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Começa true até verificarmos o localStorage
  const router = useRouter();

  useEffect(() => {
    // Tenta carregar o usuário e o token do localStorage ao iniciar
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem('adminToken');
      const storedUserString = localStorage.getItem('adminUser');
      if (storedToken && storedUserString) {
        try {
          const storedUser = JSON.parse(storedUserString);
          setLoggedInAdmin(storedUser);
          setAdminToken(storedToken);
        } catch (e) {
          console.error("AuthContext: Erro ao parsear dados do localStorage", e);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      }
      setIsLoadingAuth(false); // Finaliza o carregamento inicial do auth
    }
  }, []);

  const loginAdmin = (user: AdminUser, token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
    }
    setLoggedInAdmin(user);
    setAdminToken(token);
    router.push('/questionarios'); // Ou para o dashboard do admin
  };

  const logoutAdmin = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    setLoggedInAdmin(null);
    setAdminToken(null);
    router.push('/empresas/login'); // Redireciona para o login da empresa
  };

  return (
    <AuthContext.Provider value={{ loggedInAdmin, adminToken, isLoadingAuth, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};