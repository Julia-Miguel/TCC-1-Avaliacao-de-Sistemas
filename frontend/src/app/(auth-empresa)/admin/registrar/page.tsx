'use client';

import { useState, useEffect, Suspense } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import '../../../globals.css';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

interface AdminUser {
  id: number;
  empresaId: number;
  token: string;
  tipo: string;
  nome: string;
  email: string;
}

function RegisterForm() {
  const { loginAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [empresaNome, setEmpresaNome] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);


  useEffect(() => {
    const id = searchParams.get('empresaId');
    const nome = searchParams.get('empresaNome');
    if (id) {
      setEmpresaId(id);
      if (nome) setEmpresaNome(decodeURIComponent(nome));
    } else {
      setError('ID da empresa não fornecido. Você será redirecionado.');
      setTimeout(() => {
        router.push('/empresas/login');
      }, 3000);
    }
    setIsPageLoading(false);
  }, [searchParams, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!empresaId) {
      setError('ID da empresa não identificado.');
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post<{ admin: AdminUser; token: string }>(
        '/usuarios/register-admin',
        {
          nome,
          email,
          senha,
          empresaId: parseInt(empresaId),
        }
      );

      const { admin, token } = response.data;
      
      setSuccess('Conta de administrador criada com sucesso! Redirecionando...');
      loginAdmin(admin, token);
      router.push('/dashboard');

    } catch (err: any) {
      console.error('Erro ao registrar admin:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro desconhecido ao tentar criar a conta.');
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
      <h3 className="text-center text-xl sm:text-2xl font-semibold text-text-base mb-6">
        Registrar Usuário
      </h3>
      {empresaNome && (
        <p className="text-center text-sm text-text-muted mb-6">
          Empresa: <span className="font-medium">{empresaNome}</span>
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-sm text-center text-error bg-red-50 p-3 rounded-md border border-error">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-center text-green-700 bg-green-50 p-3 rounded-md border border-green-600">
            {success}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="nome" className="form-label">Nome</label>
          <input id="nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required className="input-edit-mode" disabled={isLoading} />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-edit-mode" disabled={isLoading} />
        </div>

        <div className="form-group">
          <label htmlFor="senha" className="form-label">Senha</label>
          <input id="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} required className="input-edit-mode" disabled={isLoading} />
        </div>

        <div className="form-group">
          <label htmlFor="confirmar-senha" className="form-label">Confirmar Senha</label>
          <input id="confirmar-senha" type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} required className="input-edit-mode" disabled={isLoading} />
        </div>

        <div className="pt-2 space-y-3">
          <button type="submit" className="btn btn-primary w-full py-2.5 text-sm" disabled={isLoading}>
            {isLoading ? 'Criando conta...' : 'Registrar'}
          </button>
          <Link href={`/admin/login?empresaId=${empresaId}&empresaNome=${encodeURIComponent(empresaNome || '')}`} className="btn btn-link w-full text-sm text-center block">
            Já tem uma conta? Fazer Login
          </Link>
        </div>
      </form>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[200px]"><p className="text-text-muted">Carregando...</p></div>}>
      <RegisterForm />
    </Suspense>
  );
}
