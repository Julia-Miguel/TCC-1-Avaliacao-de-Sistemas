// frontend/src/app/(auth-empresa)/empresas/login/page.tsx
'use client';

import { useState } from 'react';
import api from '@/services/api'; //
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../../globals.css'; 

interface EmpresaLogada {
  id: number;
  nome: string;
  emailResponsavel: string;
}

export default function LoginEmpresaPage() {
  const [emailResponsavel, setEmailResponsavel] = useState('');
  const [senhaEmpresa, setSenhaEmpresa] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post<{ empresa: EmpresaLogada }>('/empresas/login', { //
        emailResponsavel,
        senhaEmpresa,
      });
      const empresaLogada = response.data.empresa;
      router.push(`/admin/login?empresaId=${empresaLogada.id}&empresaNome=${encodeURIComponent(empresaLogada.nome)}`);

    } catch (err: any) {
      console.error('Erro ao fazer login da empresa:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro desconhecido ao tentar fazer login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-center text-xl sm:text-2xl font-semibold text-text-base mb-6">
        Login da Empresa
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-center text-error bg-red-50 dark:bg-red-700/10 p-3 rounded-md border border-error">
            {error}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="email-responsavel" className="form-label">
            Email do Responsável
          </label>
          <input
            id="email-responsavel"
            type="email"
            value={emailResponsavel}
            onChange={(e) => setEmailResponsavel(e.target.value)}
            required
            className="input-edit-mode"
            placeholder="email@suaempresa.com"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha-empresa" className="form-label">
            Senha da Empresa
          </label>
          <input
            id="senha-empresa"
            type="password"
            value={senhaEmpresa}
            onChange={(e) => setSenhaEmpresa(e.target.value)}
            required
            className="input-edit-mode"
            placeholder="Digite a senha da empresa"
            disabled={isLoading}
          />
        </div>

        <div className="pt-2 space-y-4">
          <button 
            type="submit" 
            className="btn btn-primary w-full py-2.5 text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Avançando..." : "Avançar para Login do Admin"}
          </button>
          <Link 
            href="/empresas/registrar" 
            className="btn btn-outline w-full py-2.5 text-sm text-center block"
            aria-disabled={isLoading}
            style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
          >
            Não tem conta? Registrar Empresa
          </Link>
        </div>
      </form>
    </>
  );
}