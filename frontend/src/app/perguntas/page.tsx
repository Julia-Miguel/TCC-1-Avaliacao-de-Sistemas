// frontend/src/app/perguntas/page.tsx (VERSÃO UNIFICADA)
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css"; // Seu globals.css unificado
// Se houver um CSS específico para a página de perguntas, importe-o aqui
// import "./perguntas.css"; 
import { Plus, Edit3, Trash2, ListChecks } from 'lucide-react';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard'; // Ajuste o caminho se necessário

interface PerguntaInterface {
  id: number;
  enunciado: string;
  tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA' | string; // Permitindo string para tipos desconhecidos
  created_at: string;
  updated_at: string;
  opcoes?: any[]; // Adicionado para consistência, embora não usado diretamente na listagem
}

// Componente de conteúdo que será protegido
function ListPerguntaContent() {
  const [perguntas, setPerguntas] = useState<PerguntaInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // A rota /perguntas no backend deve ser protegida e filtrar por empresa se necessário,
    // ou listar todas as perguntas base disponíveis para a empresa/admins.
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
      // A rota DELETE /perguntas no backend deve verificar permissões
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
        <p className="text-text-muted">Carregando perguntas...</p> {/* Usando text-text-muted */}
      </div>
    );
  }

  if (error) {
    return <div className="page-container center-content"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="page-container">
      <div className="table-header-actions">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
          Banco de Perguntas
        </h3>
        <div className="button-group"> {/* Adicionei sua classe .button-group para consistência se necessário */}
          <Link href="/perguntas/create" className="btn btn-primary inline-flex items-center">
            <Plus size={18} className="mr-2" />
            Nova Pergunta
          </Link>
        </div>
      </div>

      {perguntas.length > 0 ? (
        <div className="overflow-x-auto bg-card-background dark:bg-gray-800 shadow-md rounded-lg border border-border"> {/* Usando suas vars CSS */}
          <table className="min-w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Enunciado</th>
                <th>Tipo de Pergunta</th>
                <th>Criado em</th>
                <th>Atualizado em</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {perguntas.map(pergunta => {
                let tipoClasse = 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // Padrão
                let tipoTexto = pergunta.tipos?.toLowerCase().replace('_', ' ') || 'N/D';

                if (pergunta.tipos === 'MULTIPLA_ESCOLHA') {
                  tipoClasse = 'bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-300';
                } else if (pergunta.tipos === 'TEXTO') {
                  tipoClasse = 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300';
                }

                return (
                  <tr key={pergunta.id}>
                    <td data-label="ID" className="whitespace-nowrap">{pergunta.id}</td>
                    <td data-label="Enunciado" className="max-w-sm truncate" title={pergunta.enunciado}>
                      {pergunta.enunciado}
                    </td>
                    <td data-label="Tipo de Pergunta">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${tipoClasse}`}>
                        {tipoTexto}
                      </span>
                    </td>
                    <td data-label="Criado em" className="whitespace-nowrap">{formatDate(pergunta.created_at)}</td>
                    <td data-label="Atualizado em" className="whitespace-nowrap">{formatDate(pergunta.updated_at)}</td>
                    <td data-label="Ações" className="text-right whitespace-nowrap">
                      <Link
                        href={`/perguntas/update/${pergunta.id}`}
                        className="btn btn-sm btn-outline inline-flex items-center mr-2"
                        title="Editar Pergunta"
                      >
                        <Edit3 size={14} className="mr-0 sm:mr-1" /> <span className="hidden sm:inline">Editar</span>
                      </Link>
                      <button
                        onClick={() => handleDeletePergunta(pergunta.id)}
                        className="btn btn-sm btn-danger inline-flex items-center"
                        title="Excluir Pergunta"
                      >
                        <Trash2 size={14} className="mr-0 sm:mr-1" /> <span className="hidden sm:inline">Excluir</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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