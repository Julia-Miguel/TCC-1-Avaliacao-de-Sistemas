'use client';

import { useEffect, useState, Suspense, useMemo } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "../../globals.css";
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import { PlusIcon, Trash2, ChevronDown, ChevronUp, CalendarDays, ListChecks, TrendingUp, FileText, CheckSquare, Users, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuestionBarChart } from "@/components/dashboard/QuestionBarChart";
import { WordCloud } from "@/components/dashboard/WordCloud";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableItem } from '@/components/SortableItem';

interface KpiData {
    totalAvaliacoes: number;
    totalRespondentes: number;
    totalFinalizados: number;
    taxaDeConclusao: number;
}
interface GraficoData {
    perguntaId: number;
    enunciado: string;
    respostas: { name: string; value: number }[];
}
interface Opcao {
    id?: number;
    texto: string;
    tempId?: string;
}
interface PerguntaAninhada {
    id?: number;
    enunciado: string;
    tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA';
    obrigatoria: boolean;
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
    created_at: string;
}

interface WordData {
    text: string;
    value: number;
}

interface TextQuestion {
    id: string;
    enunciado: string;
}

interface SpecificQuestionnaireDashboardData {
    info: {
        id: number;
        titulo: string;
        avaliacoesCount: number;
        updated_at: string;
        textQuestions: { id: number; enunciado: string; tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA' }[];
    };
    kpis: KpiData;
    graficos: GraficoData[];
    overallMultiChoiceDistribution?: { name: string; value: number }[];
}

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

    const [viewMode, setViewMode] = useState<'editar' | 'respostas' | 'analise'>('editar');
    const [avaliacoesComRespostas, setAvaliacoesComRespostas] = useState<AvaliacaoComDetalhes[]>([]);
    const [isLoadingRespostas, setIsLoadingRespostas] = useState(false);
    const [selectedAvaliacaoId, setSelectedAvaliacaoId] = useState<number | null>(null);

    const [dashboardData, setDashboardData] = useState<SpecificQuestionnaireDashboardData | null>(null);
    const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
    const [selectedTextQuestion, setSelectedTextQuestion] = useState('');
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
    const [isLoadingWordCloud, setIsLoadingWordCloud] = useState(false);

    const [semestresExpandidos, setSemestresExpandidos] = useState<Set<string>>(new Set());
    const [chartVisibility, setChartVisibility] = useState<{ [key: string]: boolean }>({});

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5,
            },
        })
    );

    const availableTextQuestions = useMemo(() => {
        return quePergs
            .filter(qp => qp.pergunta.tipos === 'TEXTO' && qp.pergunta.id != null)
            .map(qp => ({
                id: qp.pergunta.id!.toString(),
                enunciado: qp.pergunta.enunciado
            }));
    }, [quePergs]);

    const handleDragStart = (event: any) => {
        const interactiveElements = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'];
        if (interactiveElements.includes(event?.active?.event?.target?.tagName)) {
            event.cancel();
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = quePergs.findIndex(q => (q.pergunta.id ?? q.pergunta.tempId) === active.id);
        const newIndex = quePergs.findIndex(q => (q.pergunta.id ?? q.pergunta.tempId) === over.id);
        const novos = arrayMove(quePergs, oldIndex, newIndex);
        setQuePergs(novos);
    };

    useEffect(() => {
        if (viewMode === 'analise' && questionarioId) {
            setIsLoadingDashboard(true);
            api.get(`/dashboard?questionarioId=${questionarioId}`)
                .then(response => {
                    const backendData = response.data;

                    const formattedData: SpecificQuestionnaireDashboardData = {
                        info: {
                            id: questionarioId,
                            titulo: titulo,
                            avaliacoesCount: backendData.kpis?.totalAvaliacoes ?? 0,
                            updated_at: new Date().toISOString(),
                            textQuestions: backendData.textQuestions || [],
                        },
                        kpis: backendData.kpis,
                        graficos: backendData.graficos,
                        overallMultiChoiceDistribution: backendData.overallMultiChoiceDistribution,
                    };

                    if (availableTextQuestions.length > 0) {
                        setSelectedTextQuestion(availableTextQuestions[0].id);
                    }

                    if (formattedData && formattedData.info && formattedData.info.textQuestions && formattedData.kpis && formattedData.graficos) {
                        setDashboardData(formattedData);

                        const initialVisibility: { [key: string]: boolean } = {};
                        formattedData.graficos.forEach((g: GraficoData) => {
                            initialVisibility[g.perguntaId.toString()] = true;
                        });
                        setChartVisibility(initialVisibility);

                        if (formattedData.info.textQuestions.length > 0) {
                            setSelectedTextQuestion(formattedData.info.textQuestions[0].id.toString());
                        } else {
                            setSelectedTextQuestion('');
                            setWordCloudData([]);
                        }
                    } else {
                        console.error("Estrutura de dados do dashboard inválida ou incompleta recebida da API (após formatação):", backendData);
                        setDashboardData(null);
                        setChartVisibility({});
                        setSelectedTextQuestion('');
                        setWordCloudData([]);
                    }
                })
                .catch(err => {
                    console.error("Erro ao buscar dados do dashboard específico:", err);
                    setError("Erro ao carregar dados de análise do questionário.");
                    setDashboardData(null);
                    setChartVisibility({});
                    setSelectedTextQuestion('');
                    setWordCloudData([]);
                })
                .finally(() => {
                    setIsLoadingDashboard(false);
                });
        }
    }, [viewMode, questionarioId, titulo]);

    useEffect(() => {
        if (viewMode === 'analise' && selectedTextQuestion && questionarioId) {
            const fetchWordCloud = async () => {
                try {
                    setIsLoadingWordCloud(true);
                    const response = await api.get(`/analise-texto?perguntaId=${selectedTextQuestion}&questionarioId=${questionarioId}`);
                    setWordCloudData(response.data.wordCloud);
                } catch (error) {
                    console.error("Erro ao carregar nuvem de palavras:", error);
                    setWordCloudData([]);
                } finally {
                    setIsLoadingWordCloud(false);
                }
            };
            fetchWordCloud();
        } else if (viewMode === 'analise' && !selectedTextQuestion) {
            setWordCloudData([]);
        }
    }, [viewMode, selectedTextQuestion, questionarioId]);

    function sanitizeQuePergs(data: QuePerg[]): QuePerg[] {
        return data.map(qp => ({
            ...qp,
            pergunta: {
                ...qp.pergunta,
                opcoes: (qp.pergunta.opcoes || []).map(opt => ({ ...opt }))
            }
        }));
    }

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
                const sanitizedQuePergs = sanitizeQuePergs(respQuePerg.data);
                setQuePergs(sanitizedQuePergs);
            } catch (err: any) {
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

    useEffect(() => {
        if (viewMode === 'respostas' && questionarioId) {
            setIsLoadingRespostas(true);
            setError(null);
            api.get<AvaliacaoComDetalhes[]>(`/questionarios/${questionarioId}/avaliacoes-com-respostas`)
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

    const handlePerguntaChange = (qIndex: number, novoEnunciado: string) => {
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) =>
                index === qIndex
                    ? { ...qp, pergunta: { ...qp.pergunta, enunciado: novoEnunciado } }
                    : qp
            )
        );
    };
    const removePergunta = (indexToRemove: number) => {
        if (!window.confirm("Tem certeza de que deseja remover esta pergunta?")) {
            return;
        }

        const novasPerguntas = quePergs.filter((_, index) => index !== indexToRemove);
        setQuePergs(novasPerguntas);
    };

    function getNovasOpcoes(perguntaAtual: PerguntaAninhada, novoTipo: 'TEXTO' | 'MULTIPLA_ESCOLHA'): Opcao[] {
        if (novoTipo === 'TEXTO') {
            return [];
        } else if (perguntaAtual.opcoes.length === 0) {
            return [{ texto: '', tempId: `temp-opt-${Date.now()}` }];
        } else {
            return perguntaAtual.opcoes.map(o => ({ ...o }));
        }
    }

    const handleTipoChange = (qIndex: number, novoTipo: 'TEXTO' | 'MULTIPLA_ESCOLHA') => {
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) => {
                if (index !== qIndex) {
                    return qp;
                }
                const perguntaAtual = qp.pergunta;
                const novasOpcoes = getNovasOpcoes(perguntaAtual, novoTipo);
                return { ...qp, pergunta: { ...perguntaAtual, tipos: novoTipo, opcoes: novasOpcoes } };
            })
        );
    };
    function updateOptionText(qp: QuePerg, oIndex: number, novoTexto: string): QuePerg {
        const novasOpcoes = qp.pergunta.opcoes.map((opt, optIdx) =>
            optIdx === oIndex ? { ...opt, texto: novoTexto } : opt
        );
        return { ...qp, pergunta: { ...qp.pergunta, opcoes: novasOpcoes } };
    }

    const handleOptionChange = (qIndex: number, oIndex: number, novoTexto: string) => {
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) =>
                index === qIndex
                    ? updateOptionText(qp, oIndex, novoTexto)
                    : qp
            )
        );
    };
    const addOptionToList = (qIndex: number) => {
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
    function getOpcoesRemovendo(qp: QuePerg, oIndex: number) {
        return qp.pergunta.opcoes.filter((_, optIdx) => optIdx !== oIndex);
    }

    const removeOption = (qIndex: number, oIndex: number) => {
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) => {
                if (index === qIndex) {
                    const novasOpcoes = getOpcoesRemovendo(qp, oIndex);
                    return { ...qp, pergunta: { ...qp.pergunta, opcoes: novasOpcoes } };
                }
                return qp;
            })
        );
    };
    const handleAddNewPergunta = () => {
        const novaPerguntaDefault: PerguntaAninhada = {
            tempId: `temp-perg-${Date.now()}`,
            enunciado: "",
            obrigatoria: true,
            tipos: "TEXTO",
            opcoes: []
        };
        const novoQuePerg: QuePerg = {
            questionarioId: questionarioId,
            pergunta: novaPerguntaDefault
        };
        setQuePergs(prevQuePergs => [...prevQuePergs, novoQuePerg]);
    };
    const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const perguntasParaEnviar = quePergs.map((qp, index) => ({
            id: qp.pergunta.id,
            enunciado: qp.pergunta.enunciado,
            tipos: qp.pergunta.tipos,
            obrigatoria: qp.pergunta.obrigatoria,
            ordem: index,
            opcoes: qp.pergunta.tipos === 'MULTIPLA_ESCOLHA'
                ? qp.pergunta.opcoes.map(opt => ({
                    id: opt.id,
                    texto: opt.texto
                }))
                : []
        }));

        const payload = {
            titulo: titulo,
            perguntas: perguntasParaEnviar,
        };

        try {
            await api.patch(`/questionarios/${questionarioId}`, payload);

            const respQuestionario = await api.get<QuestionarioData>(`/questionarios/${questionarioId}`);
            setTitulo(respQuestionario.data.titulo);

            const respQuePerg = await api.get<QuePerg[]>(`/quePerg?questionarioId=${questionarioId}`);
            const sanitizedQuePergs = sanitizeQuePergs(respQuePerg.data);
            setQuePergs(sanitizedQuePergs);

            alert("Questionário salvo com sucesso!");
            router.push('/questionarios');
        } catch (error: any) {
            console.error("Erro ao salvar:", error.response?.data ?? error);
            const errorMessage = error.response?.data?.message ?? 'Ocorreu um problema ao salvar.';
            setError(errorMessage);
            alert(`Erro ao salvar: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

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

        const semestresOrdenados = Object.keys(agrupado).sort((a, b) => {
            const [anoA, periodoA] = a.split('/').map(Number);
            const [anoB, periodoB] = b.split('/').map(Number);
            if (anoA !== anoB) return anoB - anoA;
            return periodoB - periodoA;
        });

        const agrupadoOrdenado: { [semestre: string]: AvaliacaoComDetalhes[] } = {};
        semestresOrdenados.forEach(sem => {
            agrupado[sem].sort((evalA, evalB) => new Date(evalB.created_at).getTime() - new Date(evalA.created_at).getTime());
            agrupadoOrdenado[sem] = agrupado[sem];
        });

        return agrupadoOrdenado;
    }, [viewMode, avaliacoesComRespostas]);

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

    const handleObrigatoriaChange = (qIndex: number, novoEstado: boolean) => {
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) =>
                index === qIndex
                    ? { ...qp, pergunta: { ...qp.pergunta, obrigatoria: novoEstado } }
                    : qp
            )
        );
    };

    const selectedAvaliacaoDetalhes = useMemo(() => {
        if (!selectedAvaliacaoId) return null;
        return avaliacoesComRespostas.find(av => av.id === selectedAvaliacaoId);
    }, [selectedAvaliacaoId, avaliacoesComRespostas]);

    if (isLoading && quePergs.length === 0 && !titulo) {
        return <div className="page-container center-content"><p>Carregando dados do questionário...</p></div>;
    }
    if (error && quePergs.length === 0 && !titulo) {
        return (
            <div className="page-container center-content">
                <p className="error-message">{error}</p>
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
                <button
                    onClick={() => setViewMode('analise')}
                    className={`btn ${viewMode === 'analise' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Análise / Dashboard
                </button>
            </div>

            {viewMode === 'editar' && (
                <form onSubmit={handleSaveChanges} className="editor-form-card">
                    <div className="form-header">
                        <h3>Editando Questionário: {titulo || "..."}</h3>
                        <div className="form-header-actions">
                            <button type="button" onClick={() => router.push("/questionarios")} className="btn btn-secondary" disabled={isLoading}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </div>

                    <div className="display-section">
                        <label htmlFor="titulo-input" className="form-label mb-1">Título do Questionário</label>
                        <input
                            id="titulo-input"
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="input-edit-mode title-input"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="display-section">
                        <label className="form-label mb-1" htmlFor="perguntas-do-questionario">Perguntas do Questionário</label>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={quePergs.map(qp => qp.pergunta.id ?? qp.pergunta.tempId).filter(Boolean) as (string | number)[]} strategy={verticalListSortingStrategy}>
                                {quePergs.map((qp, qIndex) => (
                                    <SortableItem key={qp.pergunta.id ?? qp.pergunta.tempId} id={(qp.pergunta.id ?? qp.pergunta.tempId) as string | number}>
                                        <div className="pergunta-editor-item">
                                            <textarea
                                                value={qp.pergunta.enunciado}
                                                onChange={(e) => handlePerguntaChange(qIndex, e.target.value)}
                                                className="input-edit-mode question-textarea"
                                                rows={2}
                                                placeholder={`Enunciado da Pergunta ${qIndex + 1}`}
                                                required
                                            />
                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                                    <div className="flex items-center gap-x-2">
                                                        <label htmlFor={`tipo-pergunta-${qIndex}`} className="form-label text-sm font-medium whitespace-nowrap mb-0">
                                                            Tipo:
                                                        </label>
                                                        <select
                                                            id={`tipo-pergunta-${qIndex}`}
                                                            value={qp.pergunta.tipos}
                                                            onChange={(e) => handleTipoChange(qIndex, e.target.value as 'TEXTO' | 'MULTIPLA_ESCOLHA')}
                                                            className="input-edit-mode"
                                                            style={{ minWidth: '180px' }}
                                                            disabled={isLoading}
                                                        >
                                                            <option value="TEXTO">Texto</option>
                                                            <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label htmlFor={`obrigatoria-pergunta-${qIndex}`} className="form-label flex items-center gap-2 cursor-pointer whitespace-nowrap mb-0">
                                                            <input
                                                                type="checkbox"
                                                                id={`obrigatoria-pergunta-${qIndex}`}
                                                                checked={qp.pergunta.obrigatoria}
                                                                onChange={(e) => handleObrigatoriaChange(qIndex, e.target.checked)}
                                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                            />
                                                            <span className="text-sm">Resposta Obrigatória</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removePergunta(qIndex)}
                                                        className="btn btn-danger p-2.5"
                                                        title="Remover Pergunta"
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                            {qp.pergunta.tipos === 'MULTIPLA_ESCOLHA' && (
                                                <div className="opcoes-editor-container">
                                                    <label
                                                        className="form-label"
                                                        htmlFor={`opcao-q${qIndex}-o0`}
                                                    >
                                                        Opções de Resposta
                                                    </label>
                                                    {qp.pergunta.opcoes.map((opt, oIndex) => (
                                                        <div key={opt.id ?? opt.tempId ?? `q${qIndex}-o${oIndex}`} className="opcao-editor-item">
                                                            <label htmlFor={`opcao-q${qIndex}-o${oIndex}`} className="sr-only">Opção {oIndex + 1}</label>
                                                            <input
                                                                id={`opcao-q${qIndex}-o${oIndex}`}
                                                                type="text"
                                                                value={opt.texto}
                                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                                placeholder={`Texto da Opção ${oIndex + 1}`}
                                                                className="input-edit-mode"
                                                                disabled={isLoading}
                                                                required={qp.pergunta.tipos === 'MULTIPLA_ESCOLHA'}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(qIndex, oIndex)}
                                                                className="btn-remover-opcao"
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
                                                        className="btn btn-outline btn-sm mt-2 flex items-center self-start"
                                                        disabled={isLoading}
                                                    >
                                                        <PlusIcon size={16} className="mr-1" /> Adicionar Opção
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </SortableItem>
                                ))}
                            </SortableContext>
                        </DndContext>
                        <button type="button" onClick={handleAddNewPergunta} className="btn btn-primary mt-4 flex items-center">
                            <PlusIcon size={20} className="mr-2" /> Adicionar Nova Pergunta
                        </button>
                    </div>
                </form>
            )}

            {viewMode === 'respostas' && (
                <div className="respostas-view-container mt-6">
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

                    {selectedAvaliacaoDetalhes && (
                        <div className="bg-card-background dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-border">
                            <button
                                onClick={() => setSelectedAvaliacaoId(null)}
                                className="btn btn-outline btn-sm mb-6 inline-flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
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
                                            Respondente: {respondente.usuario?.nome ?? respondente.usuario?.email ?? `Anônimo (Sessão: ...${respondente.anonymousSessionId?.slice(-6)})`}
                                        </p>
                                        <p className="text-xs text-text-muted mb-3">
                                            Status: {respondente.status} ({respondente.isFinalizado ? "Finalizado" : "Em Andamento"}) - Em: {new Date(respondente.created_at).toLocaleString('pt-BR')}
                                        </p>
                                        <ul className="space-y-3">
                                            {respondente.respostas.map(resp => (
                                                <li key={resp.id} className="text-sm">
                                                    <strong className="block text-text-muted mb-0.5">{resp.pergunta.enunciado}</strong>
                                                    <span className="text-foreground pl-1">{resp.resposta}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!isLoadingRespostas && Object.keys(avaliacoesAgrupadasPorSemestre).length > 0 && !selectedAvaliacaoId && (
                        <div className="space-y-8">
                            {Object.entries(avaliacoesAgrupadasPorSemestre).map(([semestre, avaliacoesDoSemestre]) => (
                                <div key={semestre} className="bg-card-background dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow border border-border">
                                    <button
                                        type="button"
                                        onClick={() => toggleSemestreExpandido(semestre)}
                                        className="w-full flex justify-between items-center text-left py-2"
                                        aria-expanded={semestresExpandidos.has(semestre) ? "true" : "false"}
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
                                                <button
                                                    key={av.id}
                                                    type="button"
                                                    className="p-3 border border-border rounded-md hover:bg-page-bg dark:hover:bg-gray-700/40 cursor-pointer transition-colors duration-150 w-full text-left"
                                                    onClick={() => setSelectedAvaliacaoId(av.id)}
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
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'analise' && (
                <div className="space-y-8">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Análise do Questionário: <span className="text-primary">{titulo}</span></h3>

                    {isLoadingDashboard && <div className="text-center p-10"><p className="text-text-muted">Carregando análise...</p></div>}
                    {!isLoadingDashboard && (!dashboardData || !dashboardData.kpis || !dashboardData.graficos || !dashboardData.info.textQuestions) && (
                        <div className="text-center p-10">Não há dados para analisar ou os dados estão incompletos.</div>
                    )}

                    {!isLoadingDashboard && dashboardData && dashboardData.kpis && dashboardData.graficos && dashboardData.info.textQuestions && (
                        <>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard title="Total de Avaliações" value={dashboardData.kpis.totalAvaliacoes} icon={FileText} color="text-indigo-500" bgColor="bg-indigo-50 dark:bg-indigo-700/30" />
                                <StatCard title="Total de Respondentes" value={dashboardData.kpis.totalRespondentes} icon={Users} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-700/30" />
                                <StatCard title="Respostas Finalizadas" value={dashboardData.kpis.totalFinalizados} icon={CheckSquare} color="text-green-500" bgColor="bg-green-50 dark:bg-green-700/30" />
                                <StatCard title="Taxa de Conclusão" value={`${dashboardData.kpis.taxaDeConclusao}%`} icon={TrendingUp} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-700/30" />
                            </div>

                            {dashboardData.overallMultiChoiceDistribution && dashboardData.overallMultiChoiceDistribution.length > 0 && (
                                <div className="bg-card-background dark:bg-gray-800 p-4 rounded-lg shadow border border-border">
                                    <h4 className="text-lg font-semibold text-foreground mb-4">Visão Geral das Respostas de Múltipla Escolha</h4>
                                    <QuestionBarChart
                                        title="Distribuição Agregada de Respostas"
                                        data={dashboardData.overallMultiChoiceDistribution}
                                    />
                                </div>
                            )}

                            <div className="form-group flex justify-end items-center gap-4">
                                <label htmlFor="chart-visibility-select" className="form-label text-sm font-medium whitespace-nowrap">Mostrar Gráficos:</label>
                                <select
                                    id="chart-visibility-select"
                                    className="input-edit-mode w-full max-w-xs"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === 'all') {
                                            const newVisibility: { [key: string]: boolean } = {};
                                            dashboardData.graficos.forEach(g => newVisibility[g.perguntaId.toString()] = true);
                                            setChartVisibility(newVisibility);
                                        } else if (value === 'none') {
                                            setChartVisibility({});
                                        } else {
                                            setChartVisibility(prev => ({
                                                ...prev,
                                                [value]: !prev[value]
                                            }));
                                        }
                                    }}
                                    value=""
                                >
                                    <option value="">Selecione para configurar</option>
                                    <option value="all">Mostrar Todas as Perguntas</option>
                                    <option value="none">Esconder Todas as Perguntas</option>
                                    <optgroup label="Perguntas Individuais">
                                        {dashboardData.graficos.map(g => (
                                            <option key={g.perguntaId} value={g.perguntaId.toString()}>
                                                {chartVisibility[g.perguntaId.toString()] ? '✅ ' : '⬜ '} {g.enunciado.substring(0, 50)}...
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {dashboardData.graficos.map(grafico => (
                                    chartVisibility[grafico.perguntaId.toString()] && (
                                        <QuestionBarChart key={grafico.perguntaId} title={grafico.enunciado} data={grafico.respostas} />
                                    )
                                ))}

                                {dashboardData.info.textQuestions.length > 0 && (
                                    <div className="bg-card-background dark:bg-gray-800 p-6 rounded-lg shadow border border-border">
                                        <div className="form-group mb-4">
                                            <label htmlFor="text-question-select-specific" className="form-label">Analisar Pergunta de Texto:</label>
                                            <select
                                                id="text-question-select-specific"
                                                className="input-edit-mode w-full mt-1"
                                                value={selectedTextQuestion}
                                                onChange={e => setSelectedTextQuestion(e.target.value)}
                                                disabled={isLoadingWordCloud || availableTextQuestions.length === 0}
                                            >
                                                <option value="">Selecione uma pergunta</option>
                                                {availableTextQuestions.map(q => (
                                                    <option key={q.id} value={q.id}>
                                                        {q.enunciado}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-full h-80">
                                            {isLoadingWordCloud ? (
                                                <div className="flex justify-center items-center h-full">
                                                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                                                </div>
                                            ) : (
                                                <WordCloud words={wordCloudData} title="" />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}