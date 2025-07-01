'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminAuthGuard from '../../components/auth/AdminAuthGuard';
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";
import "../questionario.css";
import { MoreVertical, Trash2, Edit3, Info, PlusIcon } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- INTERFACES ---
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
  ordem?: number; // Adicionado campo ordem
}
// --- FIM DAS INTERFACES ---

function ListQuestionariosContent() {
  const router = useRouter();
  const [questionarios, setQuestionarios] = useState<QuestionarioInterface[]>([]);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordem, setOrdem] = useState<number[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    api.get("/questionarios")
      .then(response => {
        const data = response.data as QuestionarioInterface[];
        setQuestionarios(data);
        setOrdem(data.map(q => q.id)); // Usa os IDs, mas pode ser ajustado para ordem se o backend a fornecer
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = ordem.indexOf(active.id);
      const newIndex = ordem.indexOf(over.id);
      const novaOrdem = arrayMove(ordem, oldIndex, newIndex);
      setOrdem(novaOrdem);

      // Atualize a ordem no backend
      try {
        await api.patch("/reorder", { orderedIds: novaOrdem }); // Ajustado para /reorder e orderedIds
        // Sincroniza o estado local com a nova ordem
        const updatedQuestionarios = novaOrdem.map(id =>
          questionarios.find(q => q.id === id)
        ).filter((q): q is QuestionarioInterface => q !== undefined);
        setQuestionarios(updatedQuestionarios);
      } catch (err) {
        console.error("Erro ao salvar ordem:", err);
        alert("Erro ao salvar ordem!");
        // Reverte a ordem local em caso de erro
        setOrdem(prevOrdem => prevOrdem);
      }
    }
  };

  if (isLoading) {
    return <div className="page-container center-content"><p>Carregando questionários...</p></div>;
  }

  if (error) {
    return <div className="page-container center-content"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="page-container">
      <div className="table-header-actions">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
          Meus Questionários
        </h3>
        <div className="button-group flex space-x-2">
          <Link href="/questionarios/create" className="btn btn-primary">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Novo Questionário
          </Link>
        </div>
      </div>

      {questionarios.length === 0 ? (
        <div className="text-center py-10 px-4 bg-element-bg rounded-lg shadow-md mt-6">
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ordem} strategy={verticalListSortingStrategy}>
            <div className="questionarios-grid">
              {ordem.map((id) => {
                const q = questionarios.find(q => q.id === id);
                if (!q) return null;
                return (
                  <SortableCard key={q.id} q={q}>
                    <div
                      key={q.id}
                      className="questionario-card"
                    >
                      <div className="card-header">
                        <button
                          type="button"
                          className="btn btn-card-title w-full text-left flex items-center justify-between"
                          onClick={() => handleEditQuestionario(q.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleEditQuestionario(q.id); }}}
                          aria-label={`Editar questionário ${q.titulo}`}
                        >
                          <span className="flex-1"><h4>{q.titulo}</h4></span>
                        </button>
                        <button
                          type="button"
                          className="botao icon-button ml-2"
                          title="Opções"
                          onClick={(e) => { e.stopPropagation(); toggleMenu(q.id, e); }}
                          aria-label="Opções do questionário"
                          tabIndex={0}
                        >
                          <MoreVertical size={20} />
                        </button>
                      </div>

                      <div className="perguntas-list">
                        {q.perguntas && q.perguntas.length > 0 ? (
                          q.perguntas.slice(0, 3).map((quePergItem) => (
                            <p
                              key={quePergItem.pergunta.id}
                              className="enunciado-pergunta truncate"
                              title={quePergItem.pergunta.enunciado}
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
                          role="menu"
                          tabIndex={0}
                          aria-label="Opções do questionário"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape' || e.key === 'Tab') {
                              setMenuAberto(null);
                            }
                          }}
                        >
                          <button
                            className="botao edit-action w-full flex items-center"
                            onClick={(e) => { e.stopPropagation(); handleEditQuestionario(q.id); }}
                          >
                            <Edit3 size={16} className="mr-2" /> Editar
                          </button>
                          <button
                            className="botao details-action w-full flex items-center"
                            onClick={(e) => toggleDetalhes(q.id, e)}
                          >
                            <Info size={16} className="mr-2" /> Detalhes
                          </button>
                          <button
                            className="botao delete-action w-full flex items-center"
                            onClick={(e) => { e.stopPropagation(); handleDeleteQuestionario(q.id);}}
                          >
                            <Trash2 size={16} className="mr-2" /> Excluir
                          </button>
                        </div>
                      )}

                      {detalhesVisiveis === q.id && (
                        <dialog
                          className="detalhes"
                          open
                          aria-modal="true"
                        >
                          <div>
                            <p><strong>ID:</strong> {q.id}</p>
                            {q.criador && <p><strong>Criador:</strong> {q.criador.nome} ({q.criador.email})</p>}
                            <p><strong>Criado em:</strong> {formatDate(q.created_at)}</p>
                            <p><strong>Última modificação:</strong> {formatDate(q.updated_at)}</p>
                            {q._count && <p><strong>Nº de Avaliações Associadas:</strong> {q._count.avaliacoes}</p>}
                            <button
                              onClick={(e) => { e.stopPropagation(); setDetalhesVisiveis(null); }}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                                  setDetalhesVisiveis(null);
                                }
                              }}
                              className="btn btn-sm btn-outline mt-2 w-full"
                            >
                              Fechar Detalhes
                            </button>
                          </div>
                        </dialog>
                      )}
                    </div>
                  </SortableCard>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
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

function SortableCard({ q, ...props }: Readonly<{ q: QuestionarioInterface; [key: string]: any }>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: q.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} {...props}>
      {props.children}
    </div>
  );
}