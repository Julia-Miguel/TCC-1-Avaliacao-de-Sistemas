// frontend/src/app/page.tsx (NOVA VERSÃO - DASHBOARD)
'use client';

import Link from "next/link";
import { CheckSquare, Users, FileText, TrendingUp, AlertCircle, PlusIcon as LucidePlusIcon } from 'lucide-react'; // Ícones para os cards
import AdminAuthGuard from '@/components/auth/AdminAuthGuard'; // Ajuste o caminho se necessário
// Se você tiver dados reais para o dashboard, importe o useAuth para pegar o empresaId/usuarioId se necessário para as API calls.
// import { useAuth } from "@/contexts/AuthContext"; 
import "./globals.css"; // Já deve estar no RootLayout
// Se houver um CSS específico para o dashboard, importe aqui também.

// Dados mock para os cards de sumário (substitua por dados reais/API calls no futuro)
const summaryCardsData = [
  {
    title: "Avaliações Concluídas",
    value: "152",
    change: "+15%",
    changeType: "positive" as "positive" | "negative", // Tipo para estilização condicional
    icon: CheckSquare,
    color: "text-green-500 dark:text-green-400", // Cor do ícone e texto de mudança
    bgColor: "bg-green-50 dark:bg-green-700/30", // Fundo do ícone
    detailsLink: "/avaliacao?status=concluido",
  },
  {
    title: "Usuários Ativos",
    value: "48",
    change: "+3",
    changeType: "positive" as "positive" | "negative",
    icon: Users,
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-700/30",
    detailsLink: "/usuario",
  },
  {
    title: "Questionários Disponíveis",
    value: "12",
    change: "", // Sem mudança
    changeType: "neutral" as "positive" | "negative" | "neutral",
    icon: FileText,
    color: "text-indigo-500 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-700/30",
    detailsLink: "/questionarios",
  },
  {
    title: "Engajamento Médio",
    value: "85%",
    change: "-2%",
    changeType: "negative" as "positive" | "negative",
    icon: TrendingUp, // Poderia ser um ícone de alerta se a queda for preocupante
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-700/30",
    detailsLink: "#", // Link para relatório de engajamento
  },
];

// Componente de conteúdo do Dashboard
function HomePageDashboardContent() {
  // const { loggedInAdmin } = useAuth(); // Para pegar empresaId e fazer chamadas API
  // const [dashboardData, setDashboardData] = useState(summaryCardsData); // Para dados dinâmicos
  // const [recentAvaliacoes, setRecentAvaliacoes] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   if (loggedInAdmin) {
  //     // Exemplo de como buscar dados para o dashboard:
  //     // const fetchDashboardStats = async () => {
  //     //   try {
  //     //     setIsLoading(true);
  //     //     // const statsResponse = await api.get(`/dashboard/stats?empresaId=${loggedInAdmin.empresaId}`);
  //     //     // const avaliacoesResponse = await api.get(`/avaliacao?empresaId=${loggedInAdmin.empresaId}&limit=5&status=recente`);
  //     //     // Mapear statsResponse.data para atualizar summaryCardsData
  //     //     // setRecentAvaliacoes(avaliacoesResponse.data);
  //     //   } catch (error) {
  //     //     console.error("Erro ao buscar dados do dashboard:", error);
  //     //   } finally {
  //     //     setIsLoading(false);
  //     //   }
  //     // };
  //     // fetchDashboardStats();
  //   }
  // }, [loggedInAdmin]);

  // if (isLoading) {
  //   return <div className="page-container center-content"><p>Carregando dashboard...</p></div>;
  // }

} // close HomePageDashboardContent

export default function HomePageDashboard() {
  return (
    <div className="page-container"> {/* Usa a classe do globals.css para padding e max-width */}
      
      {/* Cabeçalho da Página do Dashboard */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard de Avaliações</h1>
        <p className="text-text-muted mt-1">
          Visão geral do sistema de avaliações e desempenho.
        </p>
      </div>

      {/* Seção de Sumário com Cards */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">Sumário Rápido</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCardsData.map((card, index) => (
            <Link href={card.detailsLink || "#"} key={index} className="block group">
              <div className="bg-element-bg p-5 rounded-xl shadow-md border border-main-border hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon size={24} className={card.color} strokeWidth={1.5} />
                  </div>
                  {/* Pode adicionar um menu de opções para o card aqui se necessário */}
                </div>
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-text-base">{card.value}</h3>
                  <p className="text-sm text-text-muted mt-1">{card.title}</p>
                </div>
                {card.change && (
                  <div className="mt-auto pt-3 text-xs"> {/* mt-auto empurra para baixo */}
                    <span className={`font-medium ${
                      card.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                      card.changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
                      'text-text-muted'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-text-muted"> em relação ao período anterior</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Seção Placeholder para "Todas as Avaliações" (similar à referência) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Avaliações Recentes</h2>
          <Link href="/avaliacao" className="btn btn-primary btn-sm">
            Ver Todas
          </Link>
        </div>
        <div className="bg-element-bg p-5 rounded-xl shadow-md border border-main-border">
          <div className="text-center py-8">
            <AlertCircle size={40} className="text-text-muted mx-auto" strokeWidth={1.5}/>
            <p className="mt-4 text-text-muted">
              Área para exibir uma tabela ou lista de avaliações recentes.
            </p>
            <p className="text-sm text-text-muted">
              (Implementação da tabela de avaliações pode ser feita aqui)
            </p>
          </div>
        </div>
      </section>

      {/* Outras seções do dashboard podem ser adicionadas aqui, como gráficos, etc. */}

    </div>
  );
}