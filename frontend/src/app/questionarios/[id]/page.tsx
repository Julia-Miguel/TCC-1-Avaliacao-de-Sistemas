'use client';

import { useEffect, useState, Suspense, useMemo } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "../../globals.css";
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import { PlusIcon, Trash2, ChevronDown, ChevronUp, CalendarDays, ListChecks, TrendingUp, FileText, CheckSquare, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuestionBarChart } from "@/components/dashboard/QuestionBarChart";
import { WordCloud } from "@/components/dashboard/WordCloud";
import { ChartContainer } from "@/components/dashboard/ChartContainer"; // Verifique se esta importação está presente
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

// --- Interfaces (sem alterações) ---
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

// Componente da página
export default function EditQuestionarioPage() {
    return (
        <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
            <AdminAuthGuard>
                <EditQuestionarioFormContent />
            </AdminAuthGuard>
        </Suspense>
    );
}

// Conteúdo principal do formulário
function EditQuestionarioFormContent() {
    const router = useRouter();
    const params = useParams();
    const questionarioId = Number(params.id);

    // --- Estados (sem alterações) ---
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
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 5 } }));

    // --- Funções de Drag and Drop (sem alterações) ---
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = quePergs.findIndex(q => (q.pergunta.id ?? q.pergunta.tempId) === active.id);
        const newIndex = quePergs.findIndex(q => (q.pergunta.id ?? q.pergunta.tempId) === over.id);
        const novos = arrayMove(quePergs, oldIndex, newIndex);
        setQuePergs(novos);
    };

    // --- useEffects para carregar dados (sem alterações) ---
    useEffect(() => {
        if (viewMode === 'analise' && questionarioId) {
            setIsLoadingDashboard(true);
            api.get(`/dashboard?questionarioId=${questionarioId}`)
                .then(response => {
                    if (response.data.latestQuestionnaire && response.data.latestQuestionnaire.info.id === questionarioId) {
                        setDashboardData(response.data.latestQuestionnaire);
                        const initialVisibility: { [key: string]: boolean } = {};
                        response.data.latestQuestionnaire.graficos.forEach((g: GraficoData) => {
                            initialVisibility[g.perguntaId.toString()] = true;
                        });
                        setChartVisibility(initialVisibility);
                        if (response.data.latestQuestionnaire.info.textQuestions.length > 0) {
                            setSelectedTextQuestion(response.data.latestQuestionnaire.info.textQuestions[0].id.toString());
                        } else {
                            setSelectedTextQuestion('');
                            setWordCloudData([]);
                        }
                    } else {
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
                })
                .finally(() => {
                    setIsLoadingDashboard(false);
                });
        }
    }, [viewMode, questionarioId]);

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
    
    // Demais useEffects e funções de manipulação de formulário (sem alterações)
    // ... (incluindo a lógica para carregar o questionário para edição e as respostas)
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
                setQuePergs(respQuePerg.data);
            } catch (err: any) {
                console.error("Erro ao carregar dados do questionário:", err);
                setError("Não foi possível carregar os dados para edição. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [questionarioId]);
    
    useEffect(() => {
        if (viewMode === 'respostas' && questionarioId) {
            setIsLoadingRespostas(true);
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
    // --- Fim dos hooks de carregamento ---

    // --- Lógica de renderização ---
    if (isLoading && quePergs.length === 0 && !titulo) {
        return <div className="page-container center-content"><p>Carregando dados do questionário...</p></div>;
    }
    if (error && quePergs.length === 0 && !titulo) {
        return (
            <div className="page-container center-content">
                <p className="error-message">{error}</p>
                <Link href="/questionarios" className="btn btn-secondary mt-4">
                    Voltar para Lista de Questionários
                </Link>
            </div>
        );
    }
    
    return (
        <div className="page-container">
            {/* Abas de Navegação */}
            <div className="mb-6 flex space-x-2 border-b border-border pb-2">
                <button
                    onClick={() => setViewMode('editar')}
                    className={`btn ${viewMode === 'editar' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Configurar Perguntas
                </button>
                <button
                    onClick={() => setViewMode('respostas')}
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

            {/* --- Renderização da Aba de Edição --- */}
            {viewMode === 'editar' && (
                // ... (O conteúdo do seu formulário de edição permanece aqui, sem alterações)
                <p>Modo de edição do formulário.</p> 
            )}

            {/* --- Renderização da Aba de Respostas --- */}
            {viewMode === 'respostas' && (
                // ... (O conteúdo da sua visualização de respostas permanece aqui, sem alterações)
                <p>Modo de visualização de respostas.</p>
            )}

            {/* --- Renderização da Aba de Análise (COM O CÓDIGO CORRIGIDO) --- */}
            {viewMode === 'analise' && (() => {
                if (isLoadingDashboard) {
                    return <div className="text-center p-10">Carregando análise...</div>;
                }
                if (!dashboardData?.kpis || !dashboardData?.graficos) {
                    return <div className="text-center p-10">Não há dados para analisar ou os dados estão incompletos.</div>;
                }

                // Prepara o conteúdo da nuvem de palavras para renderização condicional
                let wordCloudContent: React.ReactNode;
                if (isLoadingWordCloud) {
                    wordCloudContent = <div className="flex h-full w-full items-center justify-center text-text-muted"><p>Analisando textos...</p></div>;
                } else if (wordCloudData && wordCloudData.length > 0) {
                    wordCloudContent = <WordCloud words={wordCloudData} title={""} />;
                } else {
                    wordCloudContent = <div className="flex h-full w-full items-center justify-center text-text-muted"><p>Nenhum dado de texto para exibir.</p></div>;
                }

                return (
                    <div className="space-y-8">
                        <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Análise do Questionário: <span className="text-primary">{titulo}</span></h3>

                        {/* KPIs */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard title="Total de Avaliações" value={dashboardData.kpis.totalAvaliacoes} icon={FileText} color="text-indigo-500" bgColor="bg-indigo-50 dark:bg-indigo-700/30" />
                            <StatCard title="Total de Respondentes" value={dashboardData.kpis.totalRespondentes} icon={Users} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-700/30" />
                            <StatCard title="Respostas Finalizadas" value={dashboardData.kpis.totalFinalizados} icon={CheckSquare} color="text-green-500" bgColor="bg-green-50 dark:bg-green-700/30" />
                            <StatCard title="Taxa de Conclusão" value={`${dashboardData.kpis.taxaDeConclusao}%`} icon={TrendingUp} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-700/30" />
                        </div>

                        {/* Gráficos e Nuvem de Palavras */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {/* Gráficos de Múltipla Escolha */}
                            {dashboardData.graficos.map(grafico => (
                                <QuestionBarChart key={grafico.perguntaId} title={grafico.enunciado} data={grafico.respostas} />
                            ))}

                            {/* Seção Corrigida da Nuvem de Palavras */}
                            {dashboardData.info.textQuestions.some(q => q.tipos === 'TEXTO') && (
                                <div className="lg:col-span-1">
                                    <ChartContainer title="Análise de Respostas Abertas">
                                        <div className="flex flex-col h-full">
                                            {/* Seletor de Pergunta */}
                                            <div className="form-group mb-4 flex-shrink-0">
                                                <label htmlFor="text-question-select-specific" className="form-label text-sm">
                                                    Selecione a pergunta para analisar:
                                                </label>
                                                <select
                                                    id="text-question-select-specific"
                                                    className="input-edit-mode w-full text-sm"
                                                    value={selectedTextQuestion}
                                                    onChange={e => setSelectedTextQuestion(e.target.value)}
                                                >
                                                    {dashboardData.info.textQuestions
                                                        .filter(qp => qp.tipos === 'TEXTO')
                                                        .map(qp => (
                                                            <option key={qp.id} value={qp.id}>
                                                                {qp.enunciado}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>

                                            {/* Área da Nuvem de Palavras */}
                                            <div className="flex-grow w-full h-full">
                                                {wordCloudContent}
                                            </div>
                                        </div>
                                    </ChartContainer>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}