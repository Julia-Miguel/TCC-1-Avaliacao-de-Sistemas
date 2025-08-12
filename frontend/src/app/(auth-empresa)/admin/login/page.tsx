'use client';

import { useState, useEffect, Suspense } from 'react';
import api from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../../../globals.css';
import { useAuth } from '@/contexts/AuthContext';

// 1. A interface do usuário que vem da API
interface AdminLogado {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN_EMPRESA';
  empresaId: number;
}

// 2. A interface que o AuthContext espera (precisa ter o token)
interface AdminUser {
  id: number;
  empresaId: number;
  token: string;
  tipo: string;
  nome: string;
  email: string;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [empresaNome, setEmpresaNome] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const idDaEmpresa = searchParams.get('empresaId');
    const nomeDaEmpresa = searchParams.get('empresaNome');

    if (idDaEmpresa) {
      setEmpresaId(idDaEmpresa);
      if (nomeDaEmpresa) {
        setEmpresaNome(decodeURIComponent(nomeDaEmpresa));
      }
    } else {
      setError("ID da empresa não fornecido. Você será redirecionado.");
      setTimeout(() => {
        router.push('/empresas/login');
      }, 3000);
    }
    setIsPageLoading(false);
  }, [searchParams, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!empresaId) {
      setError("ID da empresa não identificado. Não é possível fazer login.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await api.post<{ admin: AdminLogado, token: string }>('/usuarios/login-admin', {
        email,
        senha,
        empresaId: parseInt(empresaId),
      });

      const { admin, token } = response.data;

      const adminDataForContext: AdminUser = {
        ...admin,
        token: token,
      };

      loginAdmin(adminDataForContext, token);
      // Redireciona para a rota /dashboard após login bem-sucedido
      router.push('/dashboard');

    } catch (err: any) {
      console.error('Erro ao fazer login do admin:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        setError('Ocorreu um erro desconhecido ao tentar fazer login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-text-muted">Verificando informações da empresa...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-center text-xl sm:text-2xl font-semibold text-text-base mb-2">
        Login do Administrador
      </h3>
      {empresaNome && (
        <p className="text-center text-sm text-text-muted mb-6">
          Empresa: <span className="font-medium text-text-base">{empresaNome}</span>
        </p>
      )}
      {!empresaNome && empresaId && (
        <p className="text-center text-sm text-text-muted mb-6">Para Empresa ID: {empresaId}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-center text-error bg-red-50 dark:bg-red-700/10 p-3 rounded-md border border-error">
            {error}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="admin-email" className="form-label">Email do usuário</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-edit-mode"
            placeholder="seu.email@empresa.com"
            disabled={!empresaId || isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="admin-senha" className="form-label">Senha</label>
          <input
            id="admin-senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="input-edit-mode"
            placeholder="Sua senha de administrador"
            disabled={!empresaId || isLoading}
          />
        </div>

        <div className="pt-2 space-y-3">
          <button
            type="submit"
            className="btn btn-primary w-full py-2.5 text-sm"
            disabled={isLoading || !empresaId}
          >
            {isLoading ? "Entrando..." : "Entrar como Admin"}
          </button>
          <Link
            href={`/admin/registrar?empresaId=${empresaId}&empresaNome=${encodeURIComponent(empresaNome || '')}`}
            className="btn btn-outline w-full py-2.5 text-sm text-center block"
            aria-disabled={isLoading}
            style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
          >
            Registrar-se
          </Link>
          <Link
            href="/empresas/login"
            className="btn btn-link w-full text-sm text-center block"
            aria-disabled={isLoading}
            style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
          >
            Voltar para login da empresa
          </Link>
        </div>
      </form>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-text-muted">Carregando...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}