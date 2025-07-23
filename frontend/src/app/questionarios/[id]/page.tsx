'use client';

import { useEffect, useState, Suspense, useMemo } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "../../globals.css"; // Estilos globais
import "../../questionario.css"; // Estilos específicos da página
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import { PlusIcon, Trash2, ChevronDown, ChevronUp, CalendarDays, ListChecks, TrendingUp, FileText, CheckSquare, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuestionBarChart } from "@/components/dashboard/QuestionBarChart";
import { WordCloud } from "@/components/dashboard/WordCloud";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
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

// --- Interfaces ---
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

// Componente da Página
export default function EditQuestionarioPage() {
    return (
        <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
            <AdminAuthGuard>
                <EditQuestionarioFormContent />
            </AdminAuthGuard>
        </Suspense>
    );
}

// Conteúdo Principal
function EditQuestionarioFormContent() {
    const router = useRouter();
    const params = useParams();
    const questionarioId = Number(params.id);

    // --- Estados ---
    const [titulo, setTitulo] = useState("");
    const [quePergs, setQuePergs] = useState<QuePerg[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'editar' | 'respostas' | 'analise'>('editar');
    const [avaliacoesComRespostas, setAvaliacoesComRespostas] = useState<AvaliacaoComDetalhes[]>([]);
    const [isLoadingRespostas, setIsLoadingRespostas] = useState(false);
    const [selectedAvaliacoId, setSelectedAvaliacaoId] = useState<number | null>(null);
    const [dashboardData, setDashboardData] = useState<SpecificQuestionnaireDashboardData | null>(null);
    const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
    const [selectedTextQuestion, setSelectedTextQuestion] = useState('');
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
    const [isLoadingWordCloud, setIsLoadingWordCloud] = useState(false);
    const [semestresExpandidos, setSemestresExpandidos] = useState<Set<string>>(new Set());
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 5 } }));

    // --- Funções de Manipulação do Formulário e DnD ---
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = quePergs.findIndex(q => (q.pergunta.id ?? q.pergunta.tempId) === active.id);
        const newIndex = quePergs.findIndex(q => (q.pergunta.id ?? q.pergunta.tempId) === over.id);
        setQuePergs(arrayMove(quePergs, oldIndex, newIndex));
    };

    // ... (outras funções como handlePerguntaChange, removePergunta, etc. permanecem aqui)

    // --- Hooks de Efeito (Carregamento de Dados) ---
    useEffect(() => {
        if (!questionarioId) return;
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const respQuestionario = await api.get<QuestionarioData>(`/questionarios/${questionarioId}`);
                setTitulo(respQuestionario.data.titulo);
                const respQuePerg = await api.get<QuePerg[]>(`/quePerg?questionarioId=${questionarioId}`);
                setQuePergs(respQuePerg.data);
            } catch (err) {
                setError("Não foi possível carregar os dados do questionário.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [questionarioId]);

    useEffect(() => {
        if (viewMode === 'respostas' && questionarioId) {
            setIsLoadingRespostas(true);
            api.get<AvaliacaoComDetalhes[]>(`/questionarios/${questionarioId}/avaliacoes-com-respostas`)
                .then(response => {
                    setAvaliacoesComRespostas(response.data);
                    // Expande o primeiro semestre por padrão
                    if (response.data.length > 0) {
                        const primeiroSemestre = response.data.sort((a,b) => b.semestre.localeCompare(a.semestre))[0].semestre;
                        setSemestresExpandidos(new Set([primeiroSemestre]));
                    }
                })
                .catch(err => {
                    setError("Erro ao buscar dados das respostas.");
                    console.error(err);
                })
                .finally(() => setIsLoadingRespostas(false));
        }
    }, [viewMode, questionarioId]);

    useEffect(() => {
        if (viewMode === 'analise' && questionarioId) {
            setIsLoadingDashboard(true);
            api.get(`/dashboard?questionarioId=${questionarioId}`)
                .then(response => {
                    const data = response.data.latestQuestionnaire;
                    if (data && data.info.id === questionarioId) {
                        setDashboardData(data);
                        if (data.info.textQuestions.length > 0) {
                            const firstTextQuestion = data.info.textQuestions.find((q: any) => q.tipos === 'TEXTO');
                            if (firstTextQuestion) {
                                setSelectedTextQuestion(firstTextQuestion.id.toString());
                            }
                        }
                    } else {
                        setDashboardData(null);
                    }
                })
                .catch(err => {
                    setError("Erro ao carregar dados de análise.");
                    console.error(err);
                })
                .finally(() => setIsLoadingDashboard(false));
        }
    }, [viewMode, questionarioId]);
    
    useEffect(() => {
        if (viewMode === 'analise' && selectedTextQuestion && questionarioId) {
            setIsLoadingWordCloud(true);
            api.get(`/analise-texto?perguntaId=${selectedTextQuestion}&questionarioId=${questionarioId}`)
                .then(response => setWordCloudData(response.data.wordCloud))
                .catch(error => {
                    console.error("Erro ao carregar nuvem de palavras:", error);
                    setWordCloudData([]);
                })
                .finally(() => setIsLoadingWordCloud(false));
        }
    }, [viewMode, selectedTextQuestion, questionarioId]);

    const avaliacoesAgrupadasPorSemestre = useMemo(() => {
        if (viewMode !== 'respostas') return {};
        const agrupado: { [semestre: string]: AvaliacaoComDetalhes[] } = {};
        avaliacoesComRespostas.forEach(av => {
            if (!agrupado[av.semestre]) agrupado[av.semestre] = [];
            agrupado[av.semestre].push(av);
        });
        const semestresOrdenados = Object.keys(agrupado).sort((a, b) => b.localeCompare(a));
        const agrupadoOrdenado: { [semestre: string]: AvaliacaoComDetalhes[] } = {};
        semestresOrdenados.forEach(sem => {
            agrupado[sem].sort((evalA, evalB) => new Date(evalB.created_at).getTime() - new Date(evalA.created_at).getTime());
            agrupadoOrdenado[sem] = agrupado[sem];
        });
        return agrupadoOrdenado;
    }, [viewMode, avaliacoesComRespostas]);
    
    const selectedAvaliacaoDetalhes = useMemo(() => {
        return avaliacoesComRespostas.find(av => av.id === selectedAvaliacoId) ?? null;
    }, [selectedAvaliacoId, avaliacoesComRespostas]);

    const toggleSemestreExpandido = (semestre: string) => {
        setSemestresExpandidos(prev => {
            const novoSet = new Set(prev);
            novoSet.has(semestre) ? novoSet.delete(semestre) : novoSet.add(semestre);
            return novoSet;
        });
    };

    if (isLoading) {
        return <div className="page-container center-content"><p>Carregando...</p></div>;
    }

    if (error) {
        return <div className="page-container center-content"><p className="error-message">{error}</p></div>;
    }

    // --- Renderização Principal ---
    return (
        <div className="page-container">
            <div className="mb-6 flex space-x-2 border-b border-border pb-2">
                <button onClick={() => setViewMode('editar')} className={`btn ${viewMode === 'editar' ? 'btn-primary' : 'btn-outline'}`}>Configurar Perguntas</button>
                <button onClick={() => setViewMode('respostas')} className={`btn ${viewMode === 'respostas' ? 'btn-primary' : 'btn-outline'}`}>Visualizar Respostas</button>
                <button onClick={() => setViewMode('analise')} className={`btn ${viewMode === 'analise' ? 'btn-primary' : 'btn-outline'}`}>Análise / Dashboard</button>
            </div>

            {/* --- ABA DE EDIÇÃO --- */}
            {viewMode === 'editar' && (
                <div>Seu formulário de edição de perguntas aqui...</div>
            )}

            {/* --- ABA DE RESPOSTAS --- */}
            {viewMode === 'respostas' && (
                <div className="respostas-view-container">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">Respostas para: <span className="text-primary">{titulo}</span></h3>
                    {isLoadingRespostas ? <div className="text-center py-10"><p>Carregando...</p></div> :
                        selectedAvaliacaoDetalhes ? (
                            <div className="avaliacao-detalhes-card">
                                <button onClick={() => setSelectedAvaliacaoId(null)} className="btn btn-outline btn-sm mb-6 inline-flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                                    Voltar
                                </button>
                                <h4 className="text-xl font-semibold text-primary mb-1">{selectedAvaliacaoDetalhes.semestre}</h4>
                                <p className="text-sm text-text-muted mb-4">ID: {selectedAvaliacaoDetalhes.id}</p>
                                <div className="space-y-6">
                                    {selectedAvaliacaoDetalhes.usuarios.map(respondente => (
                                        <div key={respondente.id} className="respondente-card">
                                            <p className="font-medium text-foreground">{respondente.usuario?.nome ?? respondente.usuario?.email ?? `Anônimo`}</p>
                                            <p className="text-xs text-text-muted mb-3">{new Date(respondente.created_at).toLocaleString('pt-BR')}</p>
                                            <ul className="space-y-3 pt-3 border-t border-border">
                                                {respondente.respostas.map(resp => (
                                                    <li key={resp.id} className="text-sm">
                                                        <strong className="block text-text-muted mb-0.5">{resp.pergunta.enunciado}</strong>
                                                        <p className="text-foreground pl-1 m-0">{resp.resposta}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(avaliacoesAgrupadasPorSemestre).map(([semestre, avaliacoes]) => (
                                    <div key={semestre} className="semestre-card">
                                        <button onClick={() => toggleSemestreExpandido(semestre)} className="semestre-header">
                                            <h4 className="semestre-title"><CalendarDays size={20} /> Semestre: {semestre}</h4>
                                            {semestresExpandidos.has(semestre) ? <ChevronUp /> : <ChevronDown />}
                                        </button>
                                        {semestresExpandidos.has(semestre) && (
                                            <div className="semestre-body">
                                                <div className="space-y-3">
                                                    {avaliacoes.map(av => (
                                                        <button key={av.id} onClick={() => setSelectedAvaliacaoId(av.id)} className="avaliacao-item-card">
                                                            <p className="font-medium text-foreground">Avaliação ID: {av.id}</p>
                                                            <div className="text-sm text-text-muted flex items-center mt-1"><Users size={14} className="mr-1.5" />{av._count?.usuarios ?? 0} respondente(s)</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>
            )}

            {/* --- ABA DE ANÁLISE --- */}
            {viewMode === 'analise' && (
                <div className="space-y-8">
                    {isLoadingDashboard ? <div className="text-center p-10">Carregando análise...</div> :
                        !dashboardData ? <div className="text-center p-10">Não há dados para analisar.</div> :
                        (
                            <>
                                <h3 className="text-xl sm:text-2xl font-semibold">Análise: <span className="text-primary">{titulo}</span></h3>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                    <StatCard title="Avaliações" value={dashboardData.kpis.totalAvaliacoes} icon={FileText} color={""} bgColor={""} />
                                    <StatCard title="Respondentes" value={dashboardData.kpis.totalRespondentes} icon={Users} color={""} bgColor={""} />
                                    <StatCard title="Finalizadas" value={dashboardData.kpis.totalFinalizados} icon={CheckSquare} color={""} bgColor={""} />
                                    <StatCard title="Taxa de Conclusão" value={`${dashboardData.kpis.taxaDeConclusao}%`} icon={TrendingUp} color={""} bgColor={""} />
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                    {dashboardData.graficos.map(g => <QuestionBarChart key={g.perguntaId} title={g.enunciado} data={g.respostas} />)}
                                    {dashboardData.info.textQuestions.some(q => q.tipos === 'TEXTO') && (
                                        <ChartContainer title="Análise de Respostas Abertas">
                                            <div className="flex flex-col h-full">
                                                <div className="form-group mb-4">
                                                    <select
                                                        value={selectedTextQuestion}
                                                        onChange={e => setSelectedTextQuestion(e.target.value)}
                                                        className="input-edit-mode w-full text-sm"
                                                    >
                                                        {dashboardData.info.textQuestions.filter(q => q.tipos === 'TEXTO').map(q => (
                                                            <option key={q.id} value={q.id}>{q.enunciado}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex-grow w-full h-full">
                                                    {isLoadingWordCloud ? <p>Analisando...</p> : <WordCloud words={wordCloudData} title={""} />}
                                                </div>
                                            </div>
                                        </ChartContainer>
                                    )}
                                </div>
                            </>
                        )
                    }
                </div>
            )}
        </div>
    );
}