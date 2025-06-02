// frontend/src/app/questionarios/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminAuthGuard from '../../components/auth/AdminAuthGuard';
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";
import "../questionario.css";

// --- INTERFACES (mantidas como você definiu) ---
interface OpcaoInterface {
  id: number;
  texto: string;
}

interface PerguntaDetalhadaInterface {
  id: number;
  enunciado: string;
  tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA';
  opcoes: OpcaoInterface[];
}

interface QuePergItemInterface {
  pergunta: PerguntaDetalhadaInterface;
}

interface QuestionarioInterface {
  id: number;
  titulo: string;
  created_at: string;
  updated_at: string;
  perguntas: QuePergItemInterface[];
  criador?: { nome: string; email: string };
  _count?: { avaliacoes: number };
}
// --- FIM DAS INTERFACES ---

// Componente que contém a lógica e o JSX da listagem
function ListQuestionariosContent() {
  const router = useRouter();
  const [questionarios, setQuestionarios] = useState<QuestionarioInterface[]>([]);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    api.get("/questionarios")
      .then(response => {
        setQuestionarios(response.data);
      })
      .catch(err => {
        console.error("Erro ao buscar questionários:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Acesso não autorizado. Faça login como administrador.");
          // O AdminAuthGuard deve cuidar do redirecionamento se não estiver autorizado
        } else {
          setError("Erro ao buscar questionários. Verifique a conexão ou tente mais tarde.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // Removido router daqui, pois não é usado diretamente no useEffect para redirecionamento de erro 401/403

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteQuestionario = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este questionário?")) return;
    try {
      await api.delete('/questionarios', { data: { id } });
      setQuestionarios(prev => prev.filter(q => q.id !== id));
      alert("Questionário excluído com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir o questionário!");
    }
  };

  const toggleMenu = (id: number) => {
    setMenuAberto(menuAberto === id ? null : id);
  };

  const toggleDetalhes = (id: number) => {
    setDetalhesVisiveis(detalhesVisiveis === id ? null : id);
    setMenuAberto(null);
  };

  if (isLoading) {
    return <div className="list-container center-content"><p>Carregando questionários...</p></div>;
  }

  if (error) {
    return <div className="list-container center-content"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  // Este é o JSX que será renderizado por ListQuestionariosContent
  return (
    <div className="list-container">
      <div className="center-content">
        <h3>Lista de Questionários</h3>
        <div className="button-group">
          <Link href="/questionarios/create" className="btn-primary">Inserir</Link>
          <Link href="/" className="btn-secondary">Voltar</Link>
        </div>
      </div>

      {questionarios.length === 0 && !isLoading && (
        <div className="center-content" style={{ marginTop: '2rem' }}>
          <p>Nenhum questionário encontrado para sua empresa.</p>
        </div>
      )}

      <div className="questionarios-grid">
        {questionarios.map((q) => (
          <div
            key={q.id}
            className="questionario-card"
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/questionarios/${q.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                router.push(`/questionarios/${q.id}`);
              }
            }}
          >
            <div className="card-header">
              <h4>{q.titulo}</h4>
              <button
                className="botao"
                title="Opções"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(q.id);
                }}
              >
                ⋮
              </button>
            </div>

            <div className="perguntas-list">
              {q.perguntas && q.perguntas.length > 0 ? (
                q.perguntas.map((quePergItem) => (
                  <h5
                    key={quePergItem.pergunta.id}
                    className="enunciado-pergunta"
                    title={quePergItem.pergunta.tipos}
                  >
                    {quePergItem.pergunta.enunciado}
                  </h5>
                ))
              ) : (
                <p className="no-perguntas">Nenhuma pergunta associada</p>
              )}
            </div>

            {menuAberto === q.id && (
              <div
                className="menu-dropdown"
                role="menu"
                tabIndex={0}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                  }
                }}
              >
                <button
                  className="botao"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQuestionario(q.id);
                  }}
                >
                  Deletar
                </button>
                <button
                  className="botao"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDetalhes(q.id);
                  }}
                >
                  Detalhes
                </button>
              </div>
            )}

            {detalhesVisiveis === q.id && (
              <div
                className="detalhes"
                onClick={(e) => e.stopPropagation()}
              >
                <p><strong>ID:</strong> {q.id}</p>
                {q.criador && <p><strong>Criador:</strong> {q.criador.nome} ({q.criador.email})</p>}
                <p><strong>Criado em:</strong> {formatDate(q.created_at)}</p>
                <p><strong>Última modificação:</strong> {formatDate(q.updated_at)}</p>
                {q._count && <p><strong>Nº de Avaliações Associadas:</strong> {q._count.avaliacoes}</p>}
                <button onClick={(e) => { e.stopPropagation(); setDetalhesVisiveis(null) }}>Fechar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de página que exportamos como padrão, que usa o AdminAuthGuard
export default function ProtectedListQuestionariosPage() {
  return (
    <AdminAuthGuard>
      <ListQuestionariosContent />
    </AdminAuthGuard>
  );
}