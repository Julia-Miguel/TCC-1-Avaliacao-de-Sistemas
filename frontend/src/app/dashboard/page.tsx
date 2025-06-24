// frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuestionResponseChart } from '@/components/dashboard/QuestionResponseChart';
import { FileText, ClipboardList, Users } from 'lucide-react';

// Tipagem para os dados que virão da API
interface DashboardStats {
  geral: {
    totalQuestionarios: number;
    totalAvaliacoes: number;
    totalRespostasCompletas: number;
  };
  respostasAgregadas: {
    perguntaId: number;
    enunciado: string;
    dados: { name: string; count: number }[];
  }[];
}

function DashboardPageContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await api.get<DashboardStats>('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        setError('Não foi possível carregar os dados do dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Carregando dashboard...</div>;
  }

  if (error || !stats) {
    return <div className="text-center py-20 text-red-500">{error || 'Dados não encontrados.'}</div>;
  }

  return (
    <div className="page-container p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">Dashboard Geral</h1>

      {/* Seção de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total de Questionários" value={stats.geral.totalQuestionarios} Icon={FileText} />
        <StatCard title="Total de Avaliações" value={stats.geral.totalAvaliacoes} Icon={ClipboardList} />
        <StatCard title="Respostas Finalizadas" value={stats.geral.totalRespostasCompletas} Icon={Users} />
      </div>

      {/* Seção de Gráficos */}
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Distribuição de Respostas</h2>
      
      {stats.respostasAgregadas.length === 0 ? (
        <div className="text-center py-10 px-4 bg-card-background dark:bg-gray-800 rounded-lg shadow border border-border">
          <p className="text-text-muted">Nenhuma resposta para perguntas de múltipla escolha ou escala foi encontrada para gerar gráficos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {stats.respostasAgregadas.map((item) => (
            <QuestionResponseChart
              key={item.perguntaId}
              title={item.enunciado}
              data={item.dados}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AdminAuthGuard>
      <DashboardPageContent />
    </AdminAuthGuard>
  );
}