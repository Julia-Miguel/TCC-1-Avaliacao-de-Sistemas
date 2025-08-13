// frontend/src/app/perguntas/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css"; 
import { Plus, Edit3, Trash2, ListChecks } from 'lucide-react';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';

interface PerguntaInterface {
  id: number;
  enunciado: string;
  tipos: string;
  created_at: string;
  updated_at: string;
  opcoes?: any[];
}

// Componente de conteúdo que será protegido
function ListPerguntaContent() {
  const [perguntas, setPerguntas] = useState<PerguntaInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    api.get("/perguntas") 
      .then(response => {
        setPerguntas(response.data);
      })
      .catch(err => {
        console.error("Erro ao buscar perguntas:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Acesso não autorizado ou negado. Faça login como administrador.");
        } else {
          setError("Erro ao buscar perguntas. Verifique a conexão ou tente mais tarde.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleDeletePergunta = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta pergunta? Esta ação não pode ser desfeita e pode afetar questionários que a utilizam.")) return;
    try {
      await api.delete('/perguntas', { data: { id } });
      setPerguntas(perguntas.filter(pergunta => pergunta.id !== id));
      alert("Pergunta excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir a pergunta:", err);
      alert("Erro ao excluir a pergunta!");
    }
  };

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p className="text-text-muted">Carregando perguntas...</p>
      </div>
    );
  }

  if (error) {
    return <div className="page-container center-content"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="page-container">
      <div className="table-header-actions">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
          Banco de Perguntas
        </h3>
        <div className="button-group">
          <Link href="/perguntas/create" className="btn btn-primary inline-flex items-center">
            <Plus size={18} className="mr-2" />
            Nova Pergunta
          </Link>
        </div>
      </div>

      {perguntas.length > 0 ? (
        <>
          {/* VISÃO DE TABELA PARA DESKTOP (md e acima) */}
          <div className="hidden md:block overflow-x-auto bg-card-background dark:bg-gray-800 shadow-md rounded-lg border border-border mt-6">
            <table className="min-w-full">
              {/* Thead da Tabela */}
              <thead className="border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted uppercase">Enunciado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted uppercase">Criado em</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-text-muted uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {perguntas.map(pergunta => {
                  let tipoClasse = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
                  const tipoTexto = pergunta.tipos?.toLowerCase().replace('_', ' ') || 'N/D';

                  if (pergunta.tipos === 'MULTIPLA_ESCOLHA') {
                    tipoClasse = 'bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-300';
                  } else if (pergunta.tipos === 'TEXTO') {
                    tipoClasse = 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300';
                  }

                  return (
                    <tr key={pergunta.id} className="border-b border-border last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">{pergunta.id}</td>
                      <td className="px-4 py-3 max-w-sm truncate text-sm text-foreground" title={pergunta.enunciado}>
                        {pergunta.enunciado}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${tipoClasse}`}>
                          {tipoTexto}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-text-muted">{formatDate(pergunta.created_at)}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link href={`/perguntas/update/${pergunta.id}`} className="btn btn-sm btn-outline inline-flex items-center mr-2" title="Editar Pergunta">
                          <Edit3 size={14} />
                        </Link>
                        <button onClick={() => handleDeletePergunta(pergunta.id)} className="btn btn-sm btn-danger inline-flex items-center" title="Excluir Pergunta">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* VISÃO DE CARDS PARA MOBILE (abaixo de md) */}
          <div className="md:hidden space-y-4 mt-6">
            {perguntas.map(pergunta => {
                let tipoClasse = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
                let tipoTexto = pergunta.tipos?.toLowerCase().replace('_', ' ') || 'N/D';

                if (pergunta.tipos === 'MULTIPLA_ESCOLHA') {
                  tipoClasse = 'bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-300';
                } else if (pergunta.tipos === 'TEXTO') {
                  tipoClasse = 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300';
                }
                
                return (
                  <div key={pergunta.id} className="bg-card-background dark:bg-gray-800 shadow-md rounded-lg border border-border p-4">
                    <div className="flex justify-between items-start">
                      <p className="text-foreground font-semibold pr-2 flex-1 break-words">{pergunta.enunciado}</p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize flex-shrink-0 ${tipoClasse}`}>
                        {tipoTexto}
                      </span>
                    </div>
                    <div className="mt-4 text-sm text-text-muted">
                      <strong>ID:</strong> {pergunta.id} <br/>
                      <strong>Criado em:</strong> {formatDate(pergunta.created_at)}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-end space-x-2">
                      <Link href={`/perguntas/update/${pergunta.id}`} className="btn btn-sm btn-outline inline-flex items-center" title="Editar Pergunta">
                        <Edit3 size={16} className="mr-1" /> Editar
                      </Link>
                      <button onClick={() => handleDeletePergunta(pergunta.id)} className="btn btn-sm btn-danger inline-flex items-center" title="Excluir Pergunta">
                        <Trash2 size={16} className="mr-1" /> Excluir
                      </button>
                    </div>
                  </div>
                )
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-10 px-4 bg-card-background dark:bg-gray-800 rounded-lg shadow-md border border-border mt-6">
          <ListChecks className="mx-auto h-12 w-12 text-text-muted" strokeWidth={1.5} />
          <h3 className="mt-4 text-md font-medium text-foreground">Nenhuma pergunta cadastrada</h3>
          <p className="mt-1 text-sm text-text-muted">Crie perguntas para utilizá-las em seus questionários.</p>
          <div className="mt-6">
            <Link href="/perguntas/create" className="btn btn-primary inline-flex items-center">
              <Plus size={18} className="mr-2" />
              Criar Pergunta
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de página que exportamos como padrão, que usa o AdminAuthGuard
export default function ProtectedListPerguntaPage() {
  return (
    <AdminAuthGuard>
      <ListPerguntaContent />
    </AdminAuthGuard>
  );
}