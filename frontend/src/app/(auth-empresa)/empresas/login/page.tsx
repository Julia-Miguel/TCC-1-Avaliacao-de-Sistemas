// frontend/src/app/(auth-empresa)/empresas/login/page.tsx
'use client';

import { useState } from 'react';
import api from '@/services/api';
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
      const response = await api.post<{ empresa: EmpresaLogada }>('/empresas/login', {
        emailResponsavel,
        senhaEmpresa,
      });

      const empresaLogada = response.data.empresa;

      // Login da empresa bem-sucedido!
      // Agora redirecionamos para a página de login do administrador desta empresa,
      // passando o ID da empresa como query parameter.
      // AINDA NÃO CRIAMOS A PÁGINA /admin/login, mas esta é a ideia.
      router.push(`/admin/login?empresaId=${empresaLogada.id}`);

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
    // O layout em (auth-empresa)/layout.tsx já deve fornecer um container centralizado
    <>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
        Login da Empresa
      </h3>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="email-responsavel">Email do Responsável</label>
          <input
            id="email-responsavel"
            type="email"
            value={emailResponsavel}
            onChange={(e) => setEmailResponsavel(e.target.value)}
            required
            className="input-edit-mode" // Reutilizando estilo de input
            placeholder="email@empresa.com"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="senha-empresa">Senha da Empresa</label>
          <input
            id="senha-empresa"
            type="password"
            value={senhaEmpresa}
            onChange={(e) => setSenhaEmpresa(e.target.value)}
            required
            className="input-edit-mode"
            placeholder="Digite a senha da empresa"
          />
        </div>

        <div className="form-header-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
          <Link href="/empresas/registrar" className="btn-secondary w-full" style={{ textAlign: 'center' }}>
            Não tem conta? Registrar Empresa
          </Link>
          <Link href="/" className="btn-link" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            Voltar para Home
          </Link>
        </div>
      </form>
    </>
  );
}