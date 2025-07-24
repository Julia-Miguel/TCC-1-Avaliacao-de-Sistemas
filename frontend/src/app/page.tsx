'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, Users, FileText, TrendingUp, Loader2, Plus, ArrowRight, Inbox, LayoutList } from 'lucide-react';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import api from '@/services/api';
import "./globals.css";
import { StatCard } from "@/components/dashboard/StatCard";

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
    perguntasCount: number;
    updated_at: string;
}
interface SpecificKpiData {
    totalAvaliacoes: number;
    totalRespondentes: number;
    totalFinalizados: number;
    taxaDeConclusao: number;
}

interface DashboardResponse {
    globalKpis: GlobalKpiData;
    latestQuestionnaire: {
        info: LatestQuestionnaireInfo;
        kpis: SpecificKpiData;
    } | null;
}

const CompactStat = ({ icon: Icon, title, value, color }: { icon: React.ElementType, title: string, value: string | number, color: string }) => (
    <div className="flex flex-col items-center p-5 bg-card-background rounded-lg shadow-sm border border-border">
        <Icon className={`h-10 w-10 ${color} mb-3`} />
        <p className="text-md text-text-muted">{title}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {title === "Taxa de Conclusão" && (
            <div className="w-full bg-border rounded-full h-4 mt-3">
                <div
                    className="h-4 rounded-full"
                    style={{ width: `${value}%`, backgroundColor: 'var(--color-primary)' }}
                />
            </div>
        )}
    </div>
);

const LatestQuestionnaireSummary = ({ data }: { data: DashboardResponse['latestQuestionnaire'] }) => {
    if (!data) {
        return (
            <div className="text-center py-16 px-8 bg-card-background rounded-2xl shadow-lg border border-border">
                <Inbox className="mx-auto h-20 w-20 text-text-muted" strokeWidth={1.5} />
                <h3 className="mt-6 text-2xl font-bold text-foreground">Nenhum questionário encontrado</h3>
                <p className="mt-3 max-w-md mx-auto text-lg text-text-muted">
                    Parece que você ainda não criou nenhum questionário. Crie o primeiro para começar a coletar dados e ver o resumo aqui.
                </p>
                <div className="mt-8">
                    <Link href="/questionarios/create" className="btn btn-primary inline-flex items-center px-6 py-3 text-lg">
                        <Plus size={20} className="mr-2" strokeWidth={1.5} />
                        Criar Primeiro Questionário
                    </Link>
                </div>
            </div>
        );
    }

    const { info, kpis } = data;

    return (
        <div className="questionnaire-card">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-[30%] flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2 truncate" title={info.titulo}>
                            {info.titulo}
                        </h3>
                        <p className="text-md text-text-muted">
                            {info.perguntasCount} {info.perguntasCount === 1 ? 'pergunta' : 'perguntas'}
                        </p>
                        <p className="text-sm text-text-muted mt-4">
                            Última modificação: {new Date(info.updated_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                    </div>
                    <Link href={`/questionarios/${info.id}`} className="btn btn-primary w-full mt-6">
                        Analisar Questionário
                        <ArrowRight className="h-5 w-5 ml-2" strokeWidth={1.5} />
                    </Link>
                </div>

                <div className="lg:flex-1 stats-grid">
                    <CompactStat title="Avaliações" value={kpis.totalAvaliacoes} icon={FileText} color="text-yellow-500 dark:text-yellow-400" />
                    <CompactStat title="Respondentes" value={kpis.totalRespondentes} icon={Users} color="text-cyan-500 dark:text-cyan-400" />
                    <CompactStat title="Finalizados" value={kpis.totalFinalizados} icon={CheckSquare} color="text-emerald-500 dark:text-emerald-400" />
                    <CompactStat title="Taxa de Conclusão" value={`${kpis.taxaDeConclusao}%`} icon={TrendingUp} color="text-purple-500 dark:text-purple-400" />
                </div>
            </div>
        </div>
    );
};

function HomePageDashboardContent() {
    const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<DashboardResponse>('/dashboard');
                setDashboardData(response.data);
                setError(null);
            } catch (err: any) {
                console.error("Erro ao buscar dados do dashboard:", err.response?.data ?? err.message);
                setError("Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const globalStats = dashboardData?.globalKpis;
    const overallSummaryCards = globalStats ? [
        { title: "Avaliações Concluídas", value: globalStats.totalFinalizados, icon: CheckSquare, color: "text-green-500 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/70" },
        { title: "Total de Respondentes", value: globalStats.totalRespondentes, icon: Users, color: "text-blue-500 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-900/70" },
        { title: "Questionários Disponíveis", value: globalStats.totalQuestionarios, icon: LayoutList, color: "text-indigo-500 dark:text-indigo-400", bgColor: "bg-indigo-50 dark:bg-indigo-900/70" },
        { title: "Taxa de Conclusão Média", value: `${globalStats.taxaDeConclusao}%`, icon: TrendingUp, color: "text-amber-500 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-900/70" },
    ] : [];

    if (isLoading) {
        return (
            <div className="page-container flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 size={48} className="text-primary animate-spin" strokeWidth={1.5} />
            </div>
        );
    }
    if (error) {
        return (
            <div className="page-container flex flex-col items-center justify-center text-center min-h-[calc(100vh-8rem)]">
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Ocorreu um Erro</h2>
                <p className="mt-2 text-text-muted">{error}</p>
            </div>
        );
    }

    return (
        <div className="page-container space-y-8 md:space-y-10">
            <header>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-text-muted mt-1">Visão geral e consolidada do sistema de avaliações.</p>
            </header>
            <section aria-labelledby="general-stats-title">
                <h2 id="general-stats-title" className="text-xl font-semibold text-foreground mb-4">Estatísticas Gerais</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {overallSummaryCards.map((card) => (
                        <StatCard key={card.title} {...card} icon={card.icon} />
                    ))}
                </div>
            </section>
            <section aria-labelledby="latest-questionnaire-title">
                <h2 id="latest-questionnaire-title" className="text-xl font-semibold text-foreground mb-4">Resumo do Último Questionário</h2>
                <LatestQuestionnaireSummary data={dashboardData?.latestQuestionnaire ?? null} />
            </section>
        </div>
    );
}

export default function ProtectedHomePageDashboard() {
    console.log('ProtectedHomePageDashboard está sendo renderizado.'); // ADICIONE ESTA LINHA
    return (
        <AdminAuthGuard>
            <HomePageDashboardContent />
        </AdminAuthGuard>
    );
}