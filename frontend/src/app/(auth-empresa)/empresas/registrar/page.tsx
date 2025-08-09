'use client';

import { useState, Suspense } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../../globals.css';

function RegisterEmpresaForm() {
  const router = useRouter();

  // Estados alinhados com o model 'Empresa' do backend
  const [nome, setNome] = useState('');
  const [emailResponsavel, setEmailResponsavel] = useState('');
  const [senhaEmpresa, setSenhaEmpresa] = useState('');

  // Estados de controle da UI
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (senhaEmpresa.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      // Objeto de dados enviado para a API, correspondendo ao controller
      const data = {
        nome,
        emailResponsavel,
        senhaEmpresa,
      };

      const response = await api.post('/empresas/register', data); 

      setSuccess('Empresa registrada com sucesso! Agora, crie o seu usuário administrador.');

      // Após criar a empresa, redireciona para o registro do primeiro admin
      setTimeout(() => {
        const { id, nome: nomeDaEmpresa } = response.data;
        router.push(`/admin/registrar?empresaId=${id}&empresaNome=${encodeURIComponent(nomeDaEmpresa)}`);
      }, 3000);

    } catch (err: any) {
      console.error('Erro ao registrar empresa:', err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao registrar a empresa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-center text-xl sm:text-2xl font-semibold text-text-base mb-6">
        Registro de Nova Empresa
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-sm text-center text-error bg-red-50 dark:bg-red-700/10 p-3 rounded-md border border-error">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-center text-green-700 bg-green-50 dark:bg-green-700/10 p-3 rounded-md border border-green-600">
            {success}
          </p>
        )}

        {/* --- DADOS DA EMPRESA E RESPONSÁVEL --- */}
        <fieldset className="border border-border p-4 rounded-md space-y-5">
            <legend className="text-sm font-medium text-text-muted px-2">Dados da Empresa</legend>
            <div className="form-group">
                <label htmlFor="nomeEmpresa" className="form-label">Nome da Empresa</label>
                <input id="nomeEmpresa" type="text" value={nome} onChange={e => setNome(e.target.value)} required className="input-edit-mode" disabled={isLoading} />
            </div>
            <div className="form-group">
                <label htmlFor="emailResponsavel" className="form-label">Email do Responsável</label>
                <input id="emailResponsavel" type="email" value={emailResponsavel} onChange={e => setEmailResponsavel(e.target.value)} required className="input-edit-mode" disabled={isLoading} />
            </div>
            <div className="form-group">
                <label htmlFor="senhaEmpresa" className="form-label">Senha da Empresa</label>
                <input id="senhaEmpresa" type="password" value={senhaEmpresa} onChange={e => setSenhaEmpresa(e.target.value)} required minLength={6} className="input-edit-mode" disabled={isLoading} />
            </div>
        </fieldset>

        <div className="pt-2 space-y-3">
          <button type="submit" className="btn btn-primary w-full py-2.5 text-sm" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar Empresa'}
          </button>
          <Link href="/empresas/login" className="btn btn-link w-full text-sm text-center block" aria-disabled={isLoading}>
            Já tem uma empresa registrada? Fazer Login
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
      <RegisterEmpresaForm />
    </Suspense>
  );
}
