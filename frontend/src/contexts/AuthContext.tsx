// frontend/src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

// Interface
interface AdminUser {
  id: number; // AQUI: Alterado de 'usuarioId' para 'id' para corresponder à API
  empresaId: number;
  tipo: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  loggedInAdmin: AdminUser | null;
  isLoading: boolean;
  loginAdmin: (user: AdminUser, token: string) => void;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor de Autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInAdmin, setLoggedInAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userString = localStorage.getItem('adminUser');

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setLoggedInAdmin(user);
      } catch (error) {
        console.error("Falha ao carregar dados de autenticação do localStorage", error);
        localStorage.clear(); // Limpa tudo se os dados estiverem corrompidos
      }
    }
    setIsLoading(false); // Finaliza o carregamento inicial
  }, []);

  const loginAdmin = useCallback((user: AdminUser, token: string) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setLoggedInAdmin(user);
    router.push('/'); // Redireciona para a página principal após o login
  }, [router]);

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    delete api.defaults.headers.Authorization;
    setLoggedInAdmin(null);
    router.push('/empresas/login'); // Volta para o início do fluxo de login
  }, [router]);

  return (
    <AuthContext.Provider value={{ loggedInAdmin, isLoading, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};