// frontend/src/app/avaliacao/page.tsx
'use client';

import { useEffect, useState, Suspense } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css"; // Seu globals.css unificado
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";
import { PlusIcon, Edit3, Trash2, ExternalLink, ListChecks } from 'lucide-react'; // Ícones

interface UsuarioSimplificado {
  id: number;
  nome?: string | null; // Nome pode ser nulo no seu schema
}

interface QuestionarioSimplificado {
  id: number;
  titulo: string;
}

interface UsuAvalSimplificado {
  id: number;
  status: string;
  isFinalizado: boolean;
  usuario?: UsuarioSimplificado | null; // Usuário respondente pode ser nulo
  anonymousSessionId?: string | null;
}

interface AvaliacaoInterface {
  id: number;
  semestre: string;
  requerLoginCliente: boolean;
  questionario: QuestionarioSimplificado;
  criador: UsuarioSimplificado; // Criador da avaliação (ADMIN_EMPRESA)
  usuarios: UsuAvalSimplificado[]; // Array de quem respondeu/está respondendo (UsuAval)
  _count?: { // Contagem de respondentes
    usuarios: number;
  };
  created_at: string;
  updated_at: string;
}

function ListAvaliacaoContent() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // Backend deve filtrar pela empresa do admin logado e incluir os dados necessários
    api.get("/avaliacao")
      .then(response => {
        setAvaliacoes(response.data);
      })
      .catch(err => {
        console.error("Erro ao buscar as avaliações:", err.response?.data || err.message);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Acesso não autorizado. Faça login como administrador.");
        } else {
          setError("Erro ao buscar as avaliações.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatDate = (isoDate: string | null | undefined) => {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleDeleteAvaliacao = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta avaliação e todas as respostas associadas?")) return;
    try {
      await api.delete('/avaliacao', { data: { id } });
      alert("Avaliação excluída com sucesso!");
      setAvaliacoes(prev => prev.filter(avaliacao => avaliacao.id !== id));
    } catch (err) {
      console.error("Erro ao excluir a avaliação:", err);
      alert("Erro ao excluir a avaliação.");
    }
  };

  const getShareableLink = (avaliacaoId: number) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/responder/${avaliacaoId}`;
    }
    return "";
  };

  if (isLoading) {
    return <div className="page-container flex items-center justify-center min-h-[calc(100vh-8rem)]"><p className="text-text-muted">Carregando avaliações...</p></div>;
  }
  if (error) {
    return <div className="page-container center-content"><p className="text-red-600 dark:text-red-400">{error}</p></div>;
  }

  return (
    <div className="page-container">
      <div className="table-header-actions">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
          Gerenciamento de Avaliações
        </h3>
        <div className="button-group">
            <Link href="/avaliacao/create" className="btn btn-primary inline-flex items-center">
              <PlusIcon size={18} className="mr-2" />
              Nova Avaliação
            </Link>
             <Link href="/" className="btn btn-outline"> {/* Botão Voltar estilizado */}
                Voltar
            </Link>
        </div>
      </div>

      {avaliacoes.length === 0 ? (
        <div className="text-center py-10 px-4 bg-card-background dark:bg-gray-800 rounded-lg shadow-md border border-border mt-6">
          <ListChecks className="mx-auto h-12 w-12 text-text-muted" strokeWidth={1.5} />
          <h3 className="mt-4 text-md font-medium text-foreground">Nenhuma avaliação criada</h3>
          <p className="mt-1 text-sm text-text-muted">Crie uma nova avaliação para começar a coletar respostas.</p>
          <div className="mt-6">
            <Link href="/avaliacao/create" className="btn btn-primary inline-flex items-center">
              <PlusIcon size={18} className="mr-2" />
              Criar Avaliação
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-card-background dark:bg-gray-800 shadow-md rounded-lg border border-border">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Semestre/Contexto</th>
                <th>Questionário</th>
                <th>Login Cliente</th>
                <th>Criador</th>
                <th>Nº Respostas</th>
                <th>Criado em</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {avaliacoes.map(av => (
                <tr key={av.id}>
                  <td data-label="ID">{av.id}</td>
                  <td data-label="Semestre/Contexto">{av.semestre}</td>
                  <td data-label="Questionário">{av.questionario?.titulo || "N/A"}</td>
                  <td data-label="Login Cliente?">{av.requerLoginCliente ? 'Sim' : 'Não'}</td>
                  <td data-label="Criador">{av.criador?.nome || "N/A"}</td>
                  <td data-label="Nº Respostas">{av._count?.usuarios ?? 0}</td>
                  <td data-label="Criado em">{formatDate(av.created_at)}</td>
                  <td data-label="Ações" className="text-right whitespace-nowrap">
                    <Link
                        href={`/responder/${av.id}`} // Link para a página de resposta
                        target="_blank" // Abrir em nova aba
                        className="btn btn-sm btn-outline inline-flex items-center mr-2"
                        title="Ver/Responder (Link Público)"
                      >
                        <ExternalLink size={14} className="mr-0 sm:mr-1" /> <span className="hidden sm:inline">Link</span>
                    </Link>
                    <Link
                      href={`/avaliacao/update/${av.id}`}
                      className="btn btn-sm btn-outline inline-flex items-center mr-2"
                      title="Editar Avaliação"
                    >
                      <Edit3 size={14} className="mr-0 sm:mr-1" /> <span className="hidden sm:inline">Editar</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteAvaliacao(av.id)}
                      className="btn btn-sm btn-danger inline-flex items-center"
                      title="Excluir Avaliação"
                    >
                      <Trash2 size={14} className="mr-0 sm:mr-1" /> <span className="hidden sm:inline">Excluir</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ProtectedListAvaliacaoPage() {
  return (
    <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
      <AdminAuthGuard>
        <ListAvaliacaoContent />
      </AdminAuthGuard>
    </Suspense>
  );
}