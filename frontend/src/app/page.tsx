// frontend/src/app/page.tsx
'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, Users, FileText, TrendingUp, AlertCircle, Loader2, CalendarDays, BarChart as BarChartIcon, Plus } from 'lucide-react';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import api from '@/services/api';
import "./globals.css";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuestionBarChart } from "@/components/dashboard/QuestionBarChart"; // Assuming this component exists
import { WordCloud } from "@/components/dashboard/WordCloud"; // Assuming this component exists

// Interfaces for data received from backend
interface GlobalKpiData {
    totalAvaliacoes: number;
    totalRespondentes: number;
    totalFinalizados: number;
    taxaDeConclusao: number;
    totalQuestionarios: number;
}

interface LatestQuestionnaireInfo {
    id: number;
    titulo: string;
    avaliacoesCount: number;
    updated_at: string;
    textQuestions: { id: number; enunciado: string; tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA' }[];
}

interface SpecificKpiData {
    totalAvaliacoes: number;
    totalRespondentes: number;
    totalFinalizados: number;
    taxaDeConclusao: number;
}

interface SpecificChartData {
    perguntaId: number;
    enunciado: string;
    respostas: { name: string; value: number }[];
}

interface DashboardResponse {
    globalKpis: GlobalKpiData;
    latestQuestionnaire: {
        info: LatestQuestionnaireInfo;
        kpis: SpecificKpiData;
        graficos: SpecificChartData[];
    } | null;
}

function HomePageDashboardContent() {
    const [globalStats, setGlobalStats] = useState<GlobalKpiData | null>(null);
    const [latestQuestionnaireData, setLatestQuestionnaireData] = useState<LatestQuestionnaireInfo | null>(null);
    const [latestQuestionnaireKpis, setLatestQuestionnaireKpis] = useState<SpecificKpiData | null>(null);
    const [latestQuestionnaireCharts, setLatestQuestionnaireCharts] = useState<SpecificChartData[]>([]);
    const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
    const [selectedTextQuestionId, setSelectedTextQuestionId] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<DashboardResponse>('/dashboard');
                setGlobalStats(response.data.globalKpis);
                
                if (response.data.latestQuestionnaire) {
                    setLatestQuestionnaireData(response.data.latestQuestionnaire.info);
                    setLatestQuestionnaireKpis(response.data.latestQuestionnaire.kpis);
                    setLatestQuestionnaireCharts(response.data.latestQuestionnaire.graficos);

                    // Optionally, set the first text question as default for word cloud
                    if (response.data.latestQuestionnaire.info.textQuestions.length > 0) {
                        setSelectedTextQuestionId(response.data.latestQuestionnaire.info.textQuestions[0].id);
                    } else {
                        setSelectedTextQuestionId(null);
                        setWordCloudData([]); // Clear word cloud if no text questions
                    }
                } else {
                    setLatestQuestionnaireData(null);
                    setLatestQuestionnaireKpis(null);
                    setLatestQuestionnaireCharts([]);
                    setSelectedTextQuestionId(null);
                    setWordCloudData([]);
                }

            } catch (err: any) {
                console.error("Erro ao buscar dados do dashboard:", err.response?.data ?? err.message);
                setError("Não foi possível carregar os dados do dashboard.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Effect to fetch Word Cloud data when selectedTextQuestionId changes
    useEffect(() => {
        if (selectedTextQuestionId && latestQuestionnaireData?.id) {
            const fetchWordCloud = async () => {
                try {
                    setWordCloudData([]); // Clear previous data
                    // Pass both questionId and questionnaireId to the backend
                    const response = await api.get(`/analise-texto?perguntaId=${selectedTextQuestionId}&questionarioId=${latestQuestionnaireData.id}`);
                    setWordCloudData(response.data.wordCloud);
                } catch (error) {
                    console.error("Erro ao carregar nuvem de palavras:", error);
                    setWordCloudData([]); // Clear on error
                }
            };
            fetchWordCloud();
        } else {
            setWordCloudData([]);
        }
    }, [selectedTextQuestionId, latestQuestionnaireData?.id]);


    // Data for overall summary cards (using globalKpis)
    const overallSummaryCards = globalStats ? [
        {
            title: "Avaliações Concluídas (Total)",
            value: globalStats.totalFinalizados,
            icon: CheckSquare,
            color: "text-green-500 dark:text-green-400",
            bgColor: "bg-green-50 dark:bg-green-700/30",
            detailsLink: "/avaliacao?status=concluido",
        },
        {
            title: "Respondentes Totais (Todas Avaliações)",
            value: globalStats.totalRespondentes,
            icon: Users,
            color: "text-blue-500 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-700/30",
            detailsLink: "/usuAval", // Link para a lista de UsuAval
        },
        {
            title: "Questionários Disponíveis",
            value: globalStats.totalQuestionarios,
            icon: FileText,
            color: "text-indigo-500 dark:text-indigo-400",
            bgColor: "bg-indigo-50 dark:bg-indigo-700/30",
            detailsLink: "/questionarios",
        },
        {
            title: "Taxa de Conclusão Média",
            value: `${globalStats.taxaDeConclusao}%`,
            icon: TrendingUp,
            color: "text-amber-500 dark:text-amber-400",
            bgColor: "bg-amber-50 dark:bg-amber-700/30",
            detailsLink: "#",
        },
    ] : [];

    if (isLoading) {
        return (
            <div className="page-container flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 size={48} className="text-primary animate-spin mb-4" />
                <p className="text-text-muted">Carregando dados do dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container center-content">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Cabeçalho da Página do Dashboard */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard de Avaliações</h1>
                <p className="text-text-muted mt-1">
                    Visão geral do sistema de avaliações e desempenho.
                </p>
            </div>

            {/* Seção de Sumário Geral com Cards */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold text-foreground mb-4">Estatísticas Gerais da Empresa</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {overallSummaryCards.map((card) => (
                        <Link href={card.detailsLink || "#"} key={card.title} className="block group">
                            <StatCard
                                title={card.title}
                                value={card.value}
                                icon={card.icon}
                                color={card.color}
                                bgColor={card.bgColor}
                            />
                        </Link>
                    ))}
                </div>
            </section>

            {/* Seção do Questionário Mais Recente e suas Estatísticas */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold text-foreground mb-4">Visão do Questionário Mais Recente</h2>
                {latestQuestionnaireData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Card do Questionário Mais Recente (Esquerda) */}
                        <div className="lg:col-span-1 bg-element-bg p-6 rounded-xl shadow-md border border-main-border flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-primary mb-2 truncate" title={latestQuestionnaireData.titulo}>
                                    {latestQuestionnaireData.titulo}
                                </h3>
                                <p className="text-sm text-text-muted">
                                    Última Modificação: {new Date(latestQuestionnaireData.updated_at).toLocaleString('pt-BR')}
                                </p>
                                <p className="text-sm text-text-muted mt-1">
                                    Utilizado em {latestQuestionnaireData.avaliacoesCount} avaliação(ões).
                                </p>
                            </div>
                            <div className="mt-6 flex flex-col space-y-3">
                                <Link href={`/questionarios/${latestQuestionnaireData.id}`} className="btn btn-primary w-full text-center">
                                    Ver Detalhes do Questionário
                                </Link>
                                <Link href={`/questionarios/${latestQuestionnaireData.id}?view=respostas`} className="btn btn-outline w-full text-center">
                                    Ver Respostas Detalhadas
                                </Link>
                            </div>
                        </div>

                        {/* Estatísticas e Gráficos do Questionário Mais Recente (Centro e Direita) */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* KPIs do Questionário Recente */}
                            {latestQuestionnaireKpis && (
                                <>
                                    <StatCard
                                        title="Avaliações Agendadas"
                                        value={latestQuestionnaireKpis.totalAvaliacoes}
                                        icon={FileText}
                                        color="text-yellow-600 dark:text-yellow-400"
                                        bgColor="bg-yellow-50 dark:bg-yellow-700/30"
                                    />
                                     <StatCard
                                        title="Respondentes"
                                        value={latestQuestionnaireKpis.totalRespondentes}
                                        icon={Users}
                                        color="text-cyan-600 dark:text-cyan-400"
                                        bgColor="bg-cyan-50 dark:bg-cyan-700/30"
                                    />
                                     <StatCard
                                        title="Concluídas"
                                        value={latestQuestionnaireKpis.totalFinalizados}
                                        icon={CheckSquare}
                                        color="text-emerald-600 dark:text-emerald-400"
                                        bgColor="bg-emerald-50 dark:bg-emerald-700/30"
                                    />
                                     <StatCard
                                        title="Taxa de Conclusão"
                                        value={`${latestQuestionnaireKpis.taxaDeConclusao}%`}
                                        icon={TrendingUp}
                                        color="text-purple-600 dark:text-purple-400"
                                        bgColor="bg-purple-50 dark:bg-purple-700/30"
                                    />
                                </>
                            )}
                            
                            {/* Gráficos de Múltipla Escolha do Questionário Recente */}
                            {latestQuestionnaireCharts.length > 0 && latestQuestionnaireCharts.map(chart => (
                                <div key={chart.perguntaId} className="sm:col-span-2"> {/* Chart spans 2 columns on small screens */}
                                     <QuestionBarChart title={chart.enunciado} data={chart.respostas} />
                                </div>
                            ))}

                            {/* Nuvem de Palavras para Perguntas de Texto do Questionário Recente */}
                            {latestQuestionnaireData.textQuestions.length > 0 && (
                                <div className="sm:col-span-2 bg-element-bg p-6 rounded-xl shadow-md border border-main-border">
                                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                        <BarChartIcon size={20} className="mr-2 text-text-muted" /> Análise de Texto
                                    </h3>
                                    <div className="form-group">
                                        <label htmlFor="text-question-select-homepage" className="form-label">Selecione uma Pergunta de Texto:</label>
                                        <select
                                            id="text-question-select-homepage"
                                            className="input-edit-mode"
                                            value={selectedTextQuestionId || ''}
                                            onChange={e => setSelectedTextQuestionId(Number(e.target.value))}
                                            disabled={!latestQuestionnaireData.textQuestions.length}
                                        >
                                            <option value="">Nenhuma</option>
                                            {latestQuestionnaireData.textQuestions.map(q => (
                                                <option key={q.id} value={q.id}>{q.enunciado}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-4">
                                        <WordCloud words={wordCloudData} />
                                    </div>
                                </div>
                            )}

                             {latestQuestionnaireCharts.length === 0 && latestQuestionnaireData.textQuestions.length === 0 && (
                                <div className="sm:col-span-2 text-center py-6">
                                    <p className="text-text-muted">Não há dados de múltipla escolha ou texto para exibir gráficos para este questionário.</p>
                                </div>
                            )}

                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 px-4 bg-card-background dark:bg-gray-800 rounded-lg shadow-md border border-border">
                        <AlertCircle className="mx-auto h-12 w-12 text-text-muted" strokeWidth={1.5} />
                        <h3 className="mt-4 text-md font-medium text-foreground">Nenhum questionário encontrado</h3>
                        <p className="mt-1 text-sm text-text-muted">Crie seu primeiro questionário para ver suas estatísticas aqui.</p>
                        <div className="mt-6">
                            <Link href="/questionarios/create" className="btn btn-primary inline-flex items-center">
                                <Plus size={18} className="mr-2" />
                                Criar Questionário
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

// Componente principal que exportamos, aplicando a proteção
export default function ProtectedHomePageDashboard() {
    return (
        <AdminAuthGuard>
            <HomePageDashboardContent />
        </AdminAuthGuard>
    );
}