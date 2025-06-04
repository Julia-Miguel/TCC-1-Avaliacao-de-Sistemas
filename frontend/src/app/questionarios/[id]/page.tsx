// frontend/src/app/questionarios/[id]/page.tsx
'use client';

import { useEffect, useState, Suspense, useMemo } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "../../globals.css";
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import { PlusIcon, Trash2, ChevronDown, ChevronUp, Users, CalendarDays, ListChecks } from "lucide-react"; // Adicionado ícones

// --- Interfaces (mantidas como antes) ---
interface Opcao {
    id?: number;
    texto: string;
    tempId?: string;
}
interface PerguntaAninhada {
    id?: number;
    enunciado: string;
    tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA';
    opcoes: Opcao[];
    tempId?: string;
}
interface QuePerg {
    perguntaId?: number;
    questionarioId: number;
    pergunta: PerguntaAninhada;
    id?: number;
}
interface QuestionarioData {
    id: number;
    titulo: string;
}
interface RespostaDetalhada {
    id: number;
    resposta: string;
    pergunta: {
        id: number;
        enunciado: string;
        tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA';
        opcoes: Opcao[];
    };
}
interface Respondente {
    id: number;
    status: string;
    isFinalizado: boolean;
    usuario?: { id: number; nome?: string | null; email: string };
    anonymousSessionId?: string | null;
    respostas: RespostaDetalhada[];
    created_at: string;
}
interface AvaliacaoComDetalhes {
    id: number;
    semestre: string;
    requerLoginCliente: boolean;
    usuarios: Respondente[];
    _count?: { usuarios: number };
    created_at: string; // Adicionado para ordenação se necessário
}
// --- Fim das Interfaces ---

// Componente exportado da página (sem mudanças)
export default function EditQuestionarioPage() {
    return (
        <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
            <AdminAuthGuard>
                <EditQuestionarioFormContent />
            </AdminAuthGuard>
        </Suspense>
    );
}

function EditQuestionarioFormContent() {
    const router = useRouter();
    const params = useParams();
    const questionarioId = Number(params.id);

    const [titulo, setTitulo] = useState("");
    const [quePergs, setQuePergs] = useState<QuePerg[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<'editar' | 'respostas'>('editar');
    const [avaliacoesComRespostas, setAvaliacoesComRespostas] = useState<AvaliacaoComDetalhes[]>([]);
    const [isLoadingRespostas, setIsLoadingRespostas] = useState(false);
    const [selectedAvaliacaoId, setSelectedAvaliacaoId] = useState<number | null>(null);
    
    // NOVO: Estado para controlar quais semestres estão expandidos (opcional, para UI com colapso)
    const [semestresExpandidos, setSemestresExpandidos] = useState<Set<string>>(new Set());

    // --- Lógica de carregamento inicial (sem mudanças significativas) ---
    useEffect(() => {
        if (!questionarioId) {
            setError("ID do Questionário não encontrado na URL.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        const loadData = async () => {
            try {
                const respQuestionario = await api.get<QuestionarioData>(`/questionarios/${questionarioId}`);
                setTitulo(respQuestionario.data.titulo);
                const respQuePerg = await api.get<QuePerg[]>(`/quePerg?questionarioId=${questionarioId}`);
                const sanitizedQuePergs = respQuePerg.data.map(qp => ({
                    ...qp,
                    pergunta: {
                        ...qp.pergunta,
                        opcoes: (qp.pergunta.opcoes || []).map(opt => ({ ...opt }))
                    }
                }));
                setQuePergs(sanitizedQuePergs);
            } catch (err: any) { /* ... (tratamento de erro existente) ... */ 
                console.error("Erro ao carregar dados do questionário:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError("Acesso não autorizado ou negado. Faça o login novamente.");
                } else if (err.response && err.response.status === 404) {
                    setError("Questionário não encontrado. Verifique o ID ou se ele pertence à sua empresa.");
                } else {
                    setError("Não foi possível carregar os dados para edição. Tente novamente.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [questionarioId]);

    // --- Lógica para buscar respostas quando o modo de visualização muda ---
    useEffect(() => {
        if (viewMode === 'respostas' && questionarioId) {
            setIsLoadingRespostas(true);
            setError(null);
            api.get<AvaliacaoComDetalhes[]>(`/questionarios/${questionarioId}/avaliacoes-com-respostas`) // Endpoint ajustado conforme backend
                .then(response => {
                    setAvaliacoesComRespostas(response.data);
                })
                .catch(err => {
                    console.error("Erro ao buscar avaliações com respostas:", err);
                    setError("Erro ao buscar dados das respostas.");
                })
                .finally(() => {
                    setIsLoadingRespostas(false);
                });
        }
    }, [viewMode, questionarioId]);

    // --- Funções de manipulação de perguntas e opções (sem mudanças) ---
    const handlePerguntaChange = (qIndex: number, novoEnunciado: string) => { /* ... seu código ... */ 
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) =>
                index === qIndex
                    ? { ...qp, pergunta: { ...qp.pergunta, enunciado: novoEnunciado } }
                    : qp
            )
        );
    };
    const handleTipoChange = (qIndex: number, novoTipo: 'TEXTO' | 'MULTIPLA_ESCOLHA') => { /* ... seu código ... */ 
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) => {
                if (index === qIndex) {
                    const perguntaAtual = qp.pergunta;
                    const novasOpcoes = novoTipo === 'TEXTO'
                        ? []
                        : (perguntaAtual.opcoes.length === 0 ? [{ texto: '', tempId: `temp-opt-${Date.now()}` }] : perguntaAtual.opcoes.map(o => ({ ...o })));
                    return { ...qp, pergunta: { ...perguntaAtual, tipos: novoTipo, opcoes: novasOpcoes } };
                }
                return qp;
            })
        );
    };
    const handleOptionChange = (qIndex: number, oIndex: number, novoTexto: string) => { /* ... seu código ... */ 
         setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) => {
                if (index === qIndex) {
                    const novasOpcoes = qp.pergunta.opcoes.map((opt, optIdx) =>
                        optIdx === oIndex ? { ...opt, texto: novoTexto } : opt
                    );
                    return { ...qp, pergunta: { ...qp.pergunta, opcoes: novasOpcoes } };
                }
                return qp;
            })
        );
    };
    const addOptionToList = (qIndex: number) => { /* ... seu código ... */
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) => {
                if (index === qIndex) {
                    const novasOpcoes = [...qp.pergunta.opcoes, { texto: '', tempId: `temp-opt-${Date.now()}-${qp.pergunta.opcoes.length}` }];
                    return { ...qp, pergunta: { ...qp.pergunta, opcoes: novasOpcoes } };
                }
                return qp;
            })
        );
     };
    const removeOption = (qIndex: number, oIndex: number) => { /* ... seu código ... */ 
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) => {
                if (index === qIndex) {
                    const novasOpcoes = qp.pergunta.opcoes.filter((_, optIdx) => optIdx !== oIndex);
                    return { ...qp, pergunta: { ...qp.pergunta, opcoes: novasOpcoes } };
                }
                return qp;
            })
        );
    };
    const handleAddNewPergunta = () => { /* ... seu código ... */ 
        const novaPerguntaDefault: PerguntaAninhada = {
            tempId: `temp-perg-${Date.now()}`,
            enunciado: "",
            tipos: "TEXTO",
            opcoes: []
        };
        const novoQuePerg: QuePerg = {
            questionarioId: questionarioId,
            pergunta: novaPerguntaDefault
        };
        setQuePergs(prevQuePergs => [...prevQuePergs, novoQuePerg]);
    };
    const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => { /* ... seu código ... */ 
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await api.put(`/questionarios`, {
                id: questionarioId,
                titulo: titulo
            });

            const promisesPerguntas = quePergs.map(async (qp) => {
                let perguntaData = qp.pergunta;
                let perguntaSalvaOuAtualizada: PerguntaAninhada;

                if (perguntaData.id) {
                    const updatePayload = {
                        id: perguntaData.id,
                        enunciado: perguntaData.enunciado,
                        tipos: perguntaData.tipos,
                        opcoes: perguntaData.tipos === 'MULTIPLA_ESCOLHA' ? perguntaData.opcoes.map(opt => ({ texto: opt.texto })) : []
                    };
                    const response = await api.put(`/perguntas`, updatePayload);
                    perguntaSalvaOuAtualizada = response.data;
                } else {
                    const createPayload = {
                        enunciado: perguntaData.enunciado,
                        tipos: perguntaData.tipos,
                        opcoes: perguntaData.tipos === 'MULTIPLA_ESCOLHA' ? perguntaData.opcoes.map(opt => opt.texto) : []
                    };
                    const response = await api.post(`/perguntas`, createPayload);
                    perguntaSalvaOuAtualizada = response.data;

                    if (perguntaSalvaOuAtualizada.id) { // Garante que temos ID antes de associar
                        await api.post('/queperg', {
                            questionario_id: questionarioId,
                            pergunta_id: perguntaSalvaOuAtualizada.id
                        });
                    } else {
                        throw new Error("Nova pergunta criada não retornou um ID.");
                    }
                }
                return perguntaSalvaOuAtualizada;
            });

            await Promise.all(promisesPerguntas);

            alert("Questionário e perguntas atualizados com sucesso!");
            router.push("/questionarios");

        } catch (err: any) {
            console.error('Erro ao salvar:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Erro ao salvar as alterações!');
        } finally {
            setIsLoading(false);
        }
    };


    // NOVO: Agrupamento e ordenação das avaliações por semestre
    const avaliacoesAgrupadasPorSemestre = useMemo(() => {
        if (viewMode !== 'respostas' || avaliacoesComRespostas.length === 0) {
            return {};
        }
        const agrupado: { [semestre: string]: AvaliacaoComDetalhes[] } = {};
        avaliacoesComRespostas.forEach(av => {
            if (!agrupado[av.semestre]) {
                agrupado[av.semestre] = [];
            }
            agrupado[av.semestre].push(av);
        });

        // Ordenar os semestres (mais recentes primeiro)
        const semestresOrdenados = Object.keys(agrupado).sort((a, b) => {
            const [anoA, periodoA] = a.split('/').map(Number);
            const [anoB, periodoB] = b.split('/').map(Number);
            if (anoA !== anoB) return anoB - anoA;
            return periodoB - periodoA;
        });

        const agrupadoOrdenado: { [semestre: string]: AvaliacaoComDetalhes[] } = {};
        semestresOrdenados.forEach(sem => {
            // Ordenar avaliações dentro de cada semestre pela data de criação (mais recente primeiro)
            agrupado[sem].sort((evalA, evalB) => new Date(evalB.created_at).getTime() - new Date(evalA.created_at).getTime());
            agrupadoOrdenado[sem] = agrupado[sem];
        });

        return agrupadoOrdenado;
    }, [viewMode, avaliacoesComRespostas]);

    // Função para alternar a expansão de um semestre
    const toggleSemestreExpandido = (semestre: string) => {
        setSemestresExpandidos(prev => {
            const novoSet = new Set(prev);
            if (novoSet.has(semestre)) {
                novoSet.delete(semestre);
            } else {
                novoSet.add(semestre);
            }
            return novoSet;
        });
    };


    const selectedAvaliacaoDetalhes = useMemo(() => {
        if (!selectedAvaliacaoId) return null;
        return avaliacoesComRespostas.find(av => av.id === selectedAvaliacaoId);
    }, [selectedAvaliacaoId, avaliacoesComRespostas]);

    // --- Renderização do Loading e Erro Inicial ---
    if (isLoading && quePergs.length === 0 && !titulo) { /* ... (sem mudança) ... */ 
        return <div className="page-container center-content"><p>Carregando dados do questionário...</p></div>;
    }
    if (error && quePergs.length === 0 && !titulo) { /* ... (sem mudança) ... */ 
        return (
            <div className="page-container center-content">
                <p style={{ color: 'red' }}>{error}</p>
                <Link href="/questionarios" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                    Voltar para Lista de Questionários
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="mb-6 flex space-x-2 border-b border-border pb-2">
                <button
                    onClick={() => { setViewMode('editar'); setSelectedAvaliacaoId(null); }}
                    className={`btn ${viewMode === 'editar' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Configurar Perguntas
                </button>
                <button
                    onClick={() => { setViewMode('respostas'); setSelectedAvaliacaoId(null); }}
                    className={`btn ${viewMode === 'respostas' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Visualizar Respostas
                </button>
            </div>

            {viewMode === 'editar' && (
                <form onSubmit={handleSaveChanges} className="editor-form-card">
                    {/* ... (Conteúdo do formulário de edição como antes) ... */}
                    <div className="form-header"> {/* Estilo do cabeçalho do card */}
                        <h3>Editando Questionário: {titulo || "Carregando Título..."}</h3>
                        <div className="form-header-actions">
                            <button type="button" onClick={() => router.push("/questionarios")} className="btn btn-secondary" disabled={isLoading}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </div>

                    <div className="display-section">
                        <label htmlFor="titulo-input" className="form-label">Título do Questionário</label> {/* Usando form-label */}
                        <input
                            id="titulo-input"
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="input-edit-mode title-input" // Sua classe ou a global para inputs
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="display-section">
                        <label className="form-label">Perguntas do Questionário</label> {/* Usando form-label */}
                        <div className="perguntas-edit-list">
                            {quePergs.map((qp, qIndex) => (
                                <div key={qp.pergunta.id || qp.pergunta.tempId} className="pergunta-editor-item">
                                    <label htmlFor={`enunciado-pergunta-${qIndex}`} className="form-label sr-only">Enunciado da Pergunta {qIndex + 1}</label>
                                    <textarea
                                        id={`enunciado-pergunta-${qIndex}`}
                                        value={qp.pergunta.enunciado}
                                        onChange={(e) => handlePerguntaChange(qIndex, e.target.value)}
                                        className="input-edit-mode question-textarea" // Sua classe ou a global para textareas
                                        rows={2}
                                        placeholder={`Enunciado da Pergunta ${qIndex + 1}`}
                                        disabled={isLoading}
                                        required
                                    />
                                    <div className="pergunta-meta-editor">
                                        <label htmlFor={`tipo-pergunta-${qIndex}`} className="form-label">Tipo</label>
                                        <select
                                            id={`tipo-pergunta-${qIndex}`}
                                            value={qp.pergunta.tipos}
                                            onChange={(e) => handleTipoChange(qIndex, e.target.value as 'TEXTO' | 'MULTIPLA_ESCOLHA')}
                                            className="select-tipo-pergunta" // Sua classe ou a global para selects
                                            disabled={isLoading}
                                        >
                                            <option value="TEXTO">Texto</option>
                                            <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
                                        </select>
                                    </div>

                                    {qp.pergunta.tipos === 'MULTIPLA_ESCOLHA' && (
                                        <div className="opcoes-editor-container">
                                            <label className="form-label">Opções de Resposta</label>
                                            {qp.pergunta.opcoes.map((opt, oIndex) => (
                                                <div key={opt.id || opt.tempId || `q${qIndex}-o${oIndex}`} className="opcao-editor-item">
                                                    <label htmlFor={`opcao-q${qIndex}-o${oIndex}`} className="sr-only">Opção {oIndex + 1}</label>
                                                    <input
                                                        id={`opcao-q${qIndex}-o${oIndex}`}
                                                        type="text"
                                                        value={opt.texto}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                        placeholder={`Texto da Opção ${oIndex + 1}`}
                                                        className="input-edit-mode" // Sua classe ou a global para inputs
                                                        disabled={isLoading}
                                                        required={qp.pergunta.tipos === 'MULTIPLA_ESCOLHA'} // Obrigatório se for múltipla escolha
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOption(qIndex, oIndex)}
                                                        className="btn-remover-opcao" // Estilo para este botão específico
                                                        title="Remover Opção"
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addOptionToList(qIndex)}
                                                className="btn btn-outline btn-sm mt-2 flex items-center self-start" // Usando classes de botão genéricas
                                                disabled={isLoading}
                                            >
                                                <PlusIcon size={16} className="mr-1" /> Adicionar Opção
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddNewPergunta}
                                className="btn btn-primary mt-4 flex items-center" // Botão primário para ação principal
                                style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }} // Estilo inline mantido, pode virar classe
                                disabled={isLoading}
                            >
                                <PlusIcon size={20} className="mr-2" /> Adicionar Nova Pergunta
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* // --- SEÇÃO DE VISUALIZAÇÃO DE RESPOSTAS MODIFICADA --- */}
            {viewMode === 'respostas' && (
                <div className="respostas-view-container mt-6"> {/* Adiciona margem no topo */}
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
                        Respostas para o Questionário: <span className="text-primary">{titulo}</span>
                    </h3>

                    {isLoadingRespostas && <div className="text-center py-10"><p className="text-text-muted">Carregando respostas...</p></div>}
                    {error && !isLoadingRespostas && <div className="text-center py-10"><p className="text-red-600 dark:text-red-400">{error}</p></div>}

                    {!isLoadingRespostas && Object.keys(avaliacoesAgrupadasPorSemestre).length === 0 && !error && (
                        <div className="text-center py-10 px-4 bg-card-background dark:bg-gray-800 rounded-lg shadow border border-border">
                            <ListChecks className="mx-auto h-12 w-12 text-text-muted" strokeWidth={1.5} />
                            <p className="mt-4 text-text-muted">
                                Nenhuma avaliação utilizando este questionário foi encontrada ou nenhuma resposta foi submetida ainda.
                            </p>
                        </div>
                    )}

                    {/* Se uma avaliação específica está selecionada, mostra os detalhes dela */}
                    {selectedAvaliacaoDetalhes && (
                        <div className="bg-card-background dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-border">
                            <button
                                onClick={() => setSelectedAvaliacaoId(null)}
                                className="btn btn-outline btn-sm mb-6 inline-flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                Voltar para Lista de Avaliações
                            </button>
                            <h4 className="text-xl font-semibold text-primary mb-1">
                                {selectedAvaliacaoDetalhes.semestre}
                            </h4>
                            <p className="text-sm text-text-muted mb-4">
                                ID da Avaliação: {selectedAvaliacaoDetalhes.id} - Requer Login: {selectedAvaliacaoDetalhes.requerLoginCliente ? "Sim" : "Não"}
                            </p>

                            {selectedAvaliacaoDetalhes.usuarios.length === 0 && (
                                <p className="text-text-muted py-4">Nenhuma resposta submetida para esta avaliação.</p>
                            )}

                            <div className="space-y-6">
                                {selectedAvaliacaoDetalhes.usuarios.map(respondente => (
                                    <div key={respondente.id} className="p-4 border border-border rounded-md bg-page-bg dark:bg-gray-800/50">
                                        <p className="text-md font-medium text-foreground">
                                            Respondente: {respondente.usuario?.nome || respondente.usuario?.email || `Anônimo (Sessão: ...${respondente.anonymousSessionId?.slice(-6)})`}
                                        </p>
                                        <p className="text-xs text-text-muted mb-3">
                                            Status: {respondente.status} ({respondente.isFinalizado ? "Finalizado" : "Em Andamento"}) - Em: {new Date(respondente.created_at).toLocaleString('pt-BR')}
                                        </p>
                                        <ul className="space-y-3">
                                            {respondente.respostas.map(resp => (
                                                <li key={resp.id} className="text-sm">
                                                    <strong className="block text-text-muted mb-0.5">{resp.pergunta.enunciado}</strong>
                                                    <span className="text-foreground pl-1">{resp.resposta}</span>
                                                    {/* Opcional: Mostrar opções para perguntas de múltipla escolha, se necessário */}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Se NENHUMA avaliação específica está selecionada, mostra a lista agrupada por semestre */}
                    {!isLoadingRespostas && Object.keys(avaliacoesAgrupadasPorSemestre).length > 0 && !selectedAvaliacaoId && (
                        <div className="space-y-8">
                            {Object.entries(avaliacoesAgrupadasPorSemestre).map(([semestre, avaliacoesDoSemestre]) => (
                                <div key={semestre} className="bg-card-background dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-border">
                                    <button
                                        onClick={() => toggleSemestreExpandido(semestre)}
                                        className="w-full flex justify-between items-center text-left py-2"
                                        aria-expanded={semestresExpandidos.has(semestre)}
                                    >
                                        <h4 className="text-lg font-semibold text-primary flex items-center">
                                            <CalendarDays size={20} className="mr-2 text-primary/80" />
                                            Semestre: {semestre}
                                        </h4>
                                        {semestresExpandidos.has(semestre) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>

                                    {semestresExpandidos.has(semestre) && (
                                        <div className="mt-4 space-y-3 pl-2 border-l-2 border-primary/30">
                                            {avaliacoesDoSemestre.map(av => (
                                                <div key={av.id}
                                                    className="p-3 border border-border rounded-md hover:bg-page-bg dark:hover:bg-gray-700/40 cursor-pointer transition-colors duration-150"
                                                    onClick={() => setSelectedAvaliacaoId(av.id)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedAvaliacaoId(av.id)}
                                                >
                                                    <p className="font-medium text-foreground">
                                                        Avaliação ID: {av.id}
                                                        <span className="text-xs text-text-muted ml-2">
                                                            (Criada em: {new Date(av.created_at).toLocaleDateString('pt-BR')})
                                                        </span>
                                                    </p>
                                                    <div className="text-sm text-text-muted flex items-center mt-1">
                                                        <Users size={14} className="mr-1.5 text-text-muted/80" />
                                                        {av._count?.usuarios ?? 0} respondente(s)
                                                        <span className="mx-2">|</span>
                                                        <span>Requer Login: {av.requerLoginCliente ? "Sim" : "Não"}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}