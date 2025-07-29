// frontend/src/app/queperg/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

// Define a estrutura dos dados que esperamos da API
interface QuePerg {
  id: number;
  questionario: {
    id: number;
    titulo: string;
  };
  pergunta: {
    id: number;
    enunciado: string;
    tipos: string;
  };
  criado_em: string;
  alterado_em: string;
}

function QuePergPageContent() {
  const [quepergs, setQuepergs] = useState<QuePerg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Passo 1: Buscar a lista de todos os questionários disponíveis.
        const questionariosResponse = await api.get('/questionarios');
        const questionarios = questionariosResponse.data;

        // Passo 2: Verificar se existe algum questionário.
        if (questionarios && questionarios.length > 0) {
          // Usar o ID do primeiro questionário encontrado para a busca inicial.
          const primeiroQuestionarioId = questionarios[0].id;
          
          // Passo 3: Buscar as associações usando o ID do questionário.
          const quepergsResponse = await api.get(`/queperg?questionarioId=${primeiroQuestionarioId}`);
          setQuepergs(quepergsResponse.data);
        } else {
          // Se não houver questionários, não há associações para mostrar.
          setQuepergs([]);
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Falha ao carregar as associações. Verifique se existem questionários cadastrados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função placeholder para o botão de deletar
  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja remover esta associação?')) {
      // Lógica para chamar a API de deleção
      console.log('Deletar associação com ID:', id);
      // Exemplo: api.delete(`/queperg/${id}`).then(...)
    }
  };

  if (loading) {
    return <div className="text-center py-20">Carregando associações...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="page-container p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Associações de Perguntas e Questionários
        </h1>
        <div className="flex gap-2">
          <Link href="/queperg/create" className="btn btn-primary">
            <Plus size={18} className="mr-2" />
            Nova Associação
          </Link>
        </div>
      </div>
      <div className="bg-card-background p-4 rounded-lg shadow-md border border-main-border">
        {quepergs.length === 0 ? (
          <div className="text-center py-10">
            <AlertCircle className="mx-auto h-12 w-12 text-text-muted" />
            <h3 className="mt-2 text-sm font-medium text-foreground">Nenhuma associação encontrada</h3>
            <p className="mt-1 text-sm text-text-muted">
              Parece que não há perguntas associadas ao primeiro questionário ou não há questionários cadastrados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Questionário</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Pergunta</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Tipo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Criado em</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="bg-card-background divide-y divide-gray-200 dark:divide-gray-700">
                {quepergs.map((qp) => (
                  <tr key={qp.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{qp.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{qp.questionario.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted max-w-xs truncate">{qp.pergunta.enunciado}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{qp.pergunta.tipos}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{new Date(qp.criado_em).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleDelete(qp.id)} className="btn-icon text-red-600 hover:text-red-900">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuePergPage() {
    return (
        <AdminAuthGuard>
            <QuePergPageContent />
        </AdminAuthGuard>
    )
}