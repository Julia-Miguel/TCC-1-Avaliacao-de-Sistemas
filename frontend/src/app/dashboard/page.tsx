// frontend/src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import {
  TrendingUp,
  ClipboardList,
  Users,
  LayoutList,
  CheckSquare,
  Loader2,
  MessageSquare,
  Plus,
} from 'lucide-react';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import Link from 'next/link';

interface KpiData {
  totalAvaliacoes: number;
  totalRespondentes: number;
  totalFinalizados: number;
  taxaDeConclusao: number;
  totalQuestionarios: number;
}

interface LastQuestionnaireInfo {
  id: number;
  title: string;
  totalQuestions: number;
  totalRespondents: number;
  totalEvaluations: number;
  completionRate: string;
  estimatedTime: string;
  updated_at: string;
}

interface DashboardResponse {
  kpis: KpiData;
  lastQuestionnaire: LastQuestionnaireInfo | null;
}

const LatestQuestionnaireSummary = ({ data }: { data: LastQuestionnaireInfo }) => {
  return (
    <Link
      href={`/questionarios/${data.id}`}
      className="questionnaire-card cursor-pointer transition-all duration-300 ease-in-out no-underline hover:no-underline block"
    >
      <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-center">
        {/* Esquerda: Título e meta-info */}
        <div className="md:w-[30%] w-full px-4 md:px-6 border-b md:border-b-0 md:border-r border-border mb-4 md:mb-0 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">{data.title}</h2>
          <p className="text-sm text-text-muted mb-1">
            <span className="font-semibold text-foreground">Perguntas:</span> {data.totalQuestions}
          </p>
          <p className="text-sm text-text-muted mb-1">
            <span className="font-semibold text-foreground">Respondentes:</span> {data.totalRespondents}
          </p>
          <p className="text-xs text-text-muted mt-2">
            Atualizado em: {new Date(data.updated_at).toLocaleString('pt-BR')}
          </p>
        </div>

        {/* Direita: KPIs */}
        <div className="md:w-[70%] w-full px-4 md:px-6 flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <div className="flex flex-col items-center space-y-1">
              <CheckSquare className="text-amber-500" size={24} />
              <p className="text-sm text-text-muted font-medium">Conclusão</p>
              <p className="text-lg text-foreground">{data.completionRate}</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <ClipboardList className="text-blue-500" size={24} />
              <p className="text-sm text-text-muted font-medium">Avaliações</p>
              <p className="text-lg text-foreground">{data.totalEvaluations}</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <TrendingUp className="text-purple-500" size={24} />
              <p className="text-sm text-text-muted font-medium">Tempo Estimado</p>
              <p className="text-lg text-foreground">{data.estimatedTime}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

function DashboardPageContent() {
  const { loggedInAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!loggedInAdmin || loggedInAdmin.tipo !== 'ADMIN_EMPRESA') {
        router.push('/empresas/login');
        return;
      }
      (async () => {
        try {
          setIsLoading(true);
          setError(null);
          const { data } = await api.get<DashboardResponse>('/dashboard');
          setDashboardData(data);
        } catch (err: any) {
          console.error(err);
          setError('Falha ao carregar os dados do dashboard. Tente novamente.');
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [authLoading, loggedInAdmin, router]);

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen min-h-[calc(100vh-8rem)]">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
        <p className="ml-4 text-xl font-semibold text-text-muted">Carregando Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] bg-page-bg">
        <p className="text-red-500 text-lg">Erro: {error}</p>
      </div>
    );
  }

  if (!dashboardData || !loggedInAdmin) return null;

  const { kpis, lastQuestionnaire } = dashboardData;

  return (
    <div className="page-container space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Dashboard Administrativo</h1>

      {/* KPI Cards com estilização do LatestQuestionnaireSummary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="questionnaire-card cursor-pointer transition-all duration-300 ease-in-out bg-indigo-50 dark:bg-indigo-700/30 p-6 rounded-xl shadow-lg border border-main-border flex items-center space-x-4"
        >
          <LayoutList className="h-10 w-10 text-indigo-500" />
          <div>
            <p className="text-sm text-text

-muted font-medium">Total de Questionários</p>
            <p className="text-2xl font-bold text-foreground">{kpis.totalQuestionarios}</p>
          </div>
        </div>
        <div
          className="questionnaire-card cursor-pointer transition-all duration-300 ease-in-out bg-blue-50 dark:bg-blue-700/30 p-6 rounded-xl shadow-lg border border-main-border flex items-center space-x-4"
        >
          <ClipboardList className="h-10 w-10 text-blue-500" />
          <div>
            <p className="text-sm text-text-muted font-medium">Total de Avaliações</p>
            <p className="text-2xl font-bold text-foreground">{kpis.totalAvaliacoes}</p>
          </div>
        </div>
        <div
          className="questionnaire-card cursor-pointer transition-all duration-300 ease-in-out bg-green-50 dark:bg-green-700/30 p-6 rounded-xl shadow-lg border border-main-border flex items-center space-x-4"
        >
          <Users className="h-10 w-10 text-green-500" />
          <div>
            <p className="text-sm text-text-muted font-medium">Total de Respondentes</p>
            <p className="text-2xl font-bold text-foreground">{kpis.totalRespondentes}</p>
          </div>
        </div>
        <div
          className="questionnaire-card cursor-pointer transition-all duration-300 ease-in-out bg-amber-50 dark:bg-amber-700/30 p-6 rounded-xl shadow-lg border border-main-border flex items-center space-x-4"
        >
          <TrendingUp className="h-10 w-10 text-amber-500" />
          <div>
            <p className="text-sm text-text-muted font-medium">Taxa de Conclusão Global</p>
            <p className="text-2xl font-bold text-foreground">{kpis.taxaDeConclusao}%</p>
          </div>
        </div>
      </div>

      {/* Último Questionário */}
      {lastQuestionnaire ? (
        <LatestQuestionnaireSummary data={lastQuestionnaire} />
      ) : (
        <div className="questionnaire-card cursor-pointer transition-all duration-300 ease-in-out bg-element-bg p-6 rounded-xl shadow-lg border border-main-border text-center">
          <MessageSquare className="mx-auto h-16 w-16 text-text-muted mb-4" />
          <p className="text-text-muted text-lg mb-4">Nenhum questionário encontrado.</p>
          <Link
            href="/questionarios/create"
            className="btn btn-primary inline-flex items-center questionnaire-card cursor-pointer transition-all duration-300 ease-in-out no-underline hover:no-underline block"
          >
            <Plus size={18} className="mr-2" /> Criar Questionário
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <AdminAuthGuard>
      <DashboardPageContent />
    </AdminAuthGuard>
  );
}