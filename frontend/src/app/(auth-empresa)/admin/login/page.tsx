// frontend/src/app/(auth-empresa)/admin/login/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import api from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../../../globals.css'; 

interface AdminLogado {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN_EMPRESA'; 
  empresaId: number;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [empresaId, setEmpresaId] = useState<string | null>(null); // Inicia como null
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Para o submit do formulário
  const [isPageLoading, setIsPageLoading] = useState(true); // Para o carregamento inicial do empresaId

  useEffect(() => {
    const idDaEmpresa = searchParams.get('empresaId');
    if (idDaEmpresa) {
      setEmpresaId(idDaEmpresa);
    } else {
      setError("ID da empresa não fornecido. Você será redirecionado.");
      // Redireciona após um pequeno atraso para o usuário ler a mensagem
      setTimeout(() => {
        router.push('/empresas/login');
      }, 3000);
    }
    setIsPageLoading(false); // Terminou de verificar o empresaId
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

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(admin)); 

      alert(`Login bem-sucedido! Bem-vindo, ${admin.nome}!`);
      router.push('/questionarios'); 

    } catch (err: any) {
      console.error('Erro ao fazer login do admin:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
      }
      else {
        setError('Ocorreu um erro desconhecido ao tentar fazer login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) { 
      return (
        <div className="page-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px'}}>
            <p>Verificando informações da empresa...</p>
        </div>
      );
  }

  return (
    <> {/* Envolvido por um Fragment, pois o layout (auth-empresa) já provê o card */}
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
        Login do Administrador
      </h3>
      {empresaId && <p style={{textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#666'}}>Para Empresa ID: {empresaId}</p>}
      
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>{error}</p>}

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="admin-email">Email do Administrador</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-edit-mode" // Reutilizando seu estilo
            placeholder="seu.email@empresa.com"
            disabled={!empresaId || isLoading} // Desabilita se não tiver empresaId ou estiver carregando
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="admin-senha">Senha</label>
          <input
            id="admin-senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="input-edit-mode"
            placeholder="Sua senha"
            disabled={!empresaId || isLoading}
          />
        </div>

        <div className="form-header-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn-primary w-full" disabled={isLoading || !empresaId}>
            {isLoading ? "Entrando..." : "Entrar como Admin"}
          </button>
          <Link href="/empresas/login" className="btn-link" style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Não é esta empresa? Voltar para Login da Empresa
          </Link>
        </div>
      </form>
    </>
  );
}

// Componente Page com Suspense (continua igual)
export default function Page() {
  return (
    <Suspense fallback={
        <div className="page-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px'}}>
            <p>Carregando...</p>
        </div>
    }>
      <LoginForm />
    </Suspense>
  );
}