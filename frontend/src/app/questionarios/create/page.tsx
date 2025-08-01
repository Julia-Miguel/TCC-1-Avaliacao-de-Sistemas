'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/services/api';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import '../../globals.css';

function CreateQuestionarioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isSatisfactionQuery = searchParams.get('satisfacao') === 'true';

  const [titulo, setTitulo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define o título padrão se for um questionário de satisfação
  useEffect(() => {
    if (isSatisfactionQuery) {
      setTitulo('Satisfação');
    }
  }, [isSatisfactionQuery]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!titulo.trim()) {
      setError("O título não pode estar vazio.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Envia o payload com a marcação de satisfação se necessário
      const payload = {
        titulo,
        eh_satisfacao: isSatisfactionQuery,
      };

      const response = await api.post('/questionarios', payload);
      const novoQuestionario = response.data;

      // Redireciona para a página de edição do questionário recém-criado
      router.push(`/questionarios/${novoQuestionario.id}`);

    } catch (err: any) {
      console.error("Erro ao criar questionário:", err);
      const errorMessage = err.response?.data?.message || "Ocorreu um erro ao criar o questionário.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        {isSatisfactionQuery ? "Criar Questionário de Satisfação" : "Criar Novo Questionário"}
      </h2>
      
      <div className="p-8 bg-card-background shadow-lg rounded-xl border border-border">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="titulo" className="form-label">
              Título do Questionário
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input-edit-mode w-full"
              placeholder="Ex: Pesquisa de Clima Organizacional"
              required
              disabled={isSubmitting}
            />
             {isSatisfactionQuery && (
              <p className="text-sm text-text-muted mt-2">
                Este será o questionário único de satisfação do sistema.
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/questionarios')}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar e Criar Perguntas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function CreateQuestionarioPage() {
  return (
    <AdminAuthGuard>
      <Suspense fallback={<div>Carregando...</div>}>
        <CreateQuestionarioContent />
      </Suspense>
    </AdminAuthGuard>
  );
}