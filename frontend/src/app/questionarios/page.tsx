// frontend/src/app/questionarios/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminAuthGuard from '../../components/auth/AdminAuthGuard'; // Ajuste o caminho se necessário
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";
import "../questionario.css";
import { MoreVertical, Trash2, Edit3, Info, PlusIcon } from 'lucide-react'; // Ícones

// --- INTERFACES (Mantidas da sua versão funcional) ---
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
    api.get("/questionarios") // Backend deve filtrar por empresa e incluir perguntas/opções
      .then(response => {
        setQuestionarios(response.data);
      })
      .catch(err => {
        console.error("Erro ao buscar questionários:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Acesso não autorizado. Faça login como administrador.");
        } else {
          setError("Erro ao buscar questionários. Verifique a conexão ou tente mais tarde.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "Data indisponível";
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleDeleteQuestionario = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este questionário?")) return;
    try {
      await api.delete('/questionarios', { data: { id } });
      setQuestionarios(prev => prev.filter(q => q.id !== id));
      setMenuAberto(null);
      alert("Questionário excluído com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir o questionário!");
    }
  };

  const handleEditQuestionario = (id: number) => {
    router.push(`/questionarios/${id}`);
  };

  const toggleMenu = (id: number, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setMenuAberto(prevMenuAberto => (prevMenuAberto === id ? null : id));
    setDetalhesVisiveis(null);
  };

  const toggleDetalhes = (id: number, event?: React.MouseEvent) => {
    event?.stopPropagation();
    setDetalhesVisiveis(prevDetalhesVisiveis => (prevDetalhesVisiveis === id ? null : id));
    setMenuAberto(null);
  };

  if (isLoading) {
    return <div className="page-container center-content"><p>Carregando questionários...</p></div>;
  }

  if (error) {
    return <div className="page-container center-content"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="page-container"> {/* Use sua classe de container global ou defina .page-container */}
      <div className="table-header-actions"> {/* Classe do layout dela */}
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground"> {/* Classe do layout dela */}
          Meus Questionários
        </h3>
        <div className="button-group flex space-x-2"> {/* Classe do layout dela */}
          <Link href="/questionarios/create" className="btn btn-primary"> {/* Classe do layout dela */}
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Novo Questionário
          </Link>
        </div>
      </div>

      {questionarios.length === 0 ? (
        <div className="text-center py-10 px-4 bg-element-bg rounded-lg shadow-md mt-6"> {/* Estilo "nenhum item" dela */}
          <svg className="mx-auto h-12 w-12 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-text-base">Nenhum questionário</h3>
          <p className="mt-1 text-sm text-text-muted">Crie um novo questionário para começar.</p>
          <div className="mt-6">
            <Link href="/questionarios/create" className="btn btn-primary">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Criar Questionário
            </Link>
          </div>
        </div>
      ) : (
        <div className="questionarios-grid">
          {questionarios.map((q) => (
            <div
              key={q.id}
              className="questionario-card" // Mantém o card clicável
              role="button" // Para acessibilidade
              tabIndex={0}  // Para acessibilidade
              onClick={() => handleEditQuestionario(q.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleEditQuestionario(q.id); }}}
            >
              <div className="card-header">
                <h4>{q.titulo}</h4>
                <button
                  className="botao icon-button" // Classe do layout dela
                  title="Opções"
                  onClick={(e) => toggleMenu(q.id, e)}
                  aria-label="Opções do questionário"
                >
                  <MoreVertical size={20} /> {/* Ícone do layout dela */}
                </button>
              </div>

              <div className="perguntas-list">
                {q.perguntas && q.perguntas.length > 0 ? (
                  // Mostra até 3 perguntas, como na versão dela
                  q.perguntas.slice(0, 3).map((quePergItem) => (
                    <p
                      key={quePergItem.pergunta.id}
                      className="enunciado-pergunta truncate" // Classe do layout dela
                      title={quePergItem.pergunta.enunciado} // Mostrar completo no hover
                    >
                      {quePergItem.pergunta.enunciado}
                    </p>
                  ))
                ) : (
                  <p className="no-perguntas">Nenhuma pergunta adicionada.</p> 
                )}
                {q.perguntas && q.perguntas.length > 3 && (
                  <p className="text-xs text-text-muted mt-1"> 
                    ...e mais {q.perguntas.length - 3}.
                  </p>
                )}
              </div>

              {menuAberto === q.id && (
                <div
                  className="menu-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="botao edit-action w-full flex items-center" // Estilo dela
                    onClick={(e) => { e.stopPropagation(); handleEditQuestionario(q.id); }}
                  >
                    <Edit3 size={16} className="mr-2" /> Editar
                  </button>
                  <button
                    className="botao details-action w-full flex items-center" // Estilo dela
                    onClick={(e) => toggleDetalhes(q.id, e)}
                  >
                    <Info size={16} className="mr-2" /> Detalhes
                  </button>
                  <button
                    className="botao delete-action w-full flex items-center" // Estilo dela
                    onClick={(e) => { e.stopPropagation(); handleDeleteQuestionario(q.id);}}
                  >
                    <Trash2 size={16} className="mr-2" /> Excluir
                  </button>
                </div>
              )}

              {detalhesVisiveis === q.id && (
                <div
                  className="detalhes" // Você pode precisar estilizar esta classe
                  onClick={(e) => e.stopPropagation()}
                >
                  <p><strong>ID:</strong> {q.id}</p>
                  {q.criador && <p><strong>Criador:</strong> {q.criador.nome} ({q.criador.email})</p>}
                  <p><strong>Criado em:</strong> {formatDate(q.created_at)}</p>
                  <p><strong>Última modificação:</strong> {formatDate(q.updated_at)}</p>
                  {q._count && <p><strong>Nº de Avaliações Associadas:</strong> {q._count.avaliacoes}</p>}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDetalhesVisiveis(null); }}
                    className="btn btn-sm btn-outline mt-2 w-full" // Classe do layout dela
                  >
                    Fechar Detalhes
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProtectedListQuestionariosPage() {
  return (
    <AdminAuthGuard>
      <ListQuestionariosContent />
    </AdminAuthGuard>
  );
}

// Ícone Plus que estava na versão dela, pode ser usado se preferir ao invés do da lucide-react
// function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//     </svg>
//   );
// }