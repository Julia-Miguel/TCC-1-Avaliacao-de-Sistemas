// frontend/src/app/dashboard/page.tsx
'use client';
import { useEffect, useState } from "react";
import api from "@/services/api";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuestionBarChart } from "@/components/dashboard/QuestionBarChart";
import { WordCloud } from "@/components/dashboard/WordCloud";
import { TrendingUp, FileText, CheckSquare, Users } from "lucide-react";

// Interfaces para os dados
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
interface TextQuestion {
    id: number;
    enunciado: string;
}

function DashboardPageContent() {
    const [kpis, setKpis] = useState<KpiData | null>(null);
    const [graficos, setGraficos] = useState<GraficoData[]>([]);
    const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
    const [textQuestions, setTextQuestions] = useState<TextQuestion[]>([]);
    const [selectedTextQuestion, setSelectedTextQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingWordCloud, setIsLoadingWordCloud] = useState(false);

    // Carrega dados gerais do dashboard
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/dashboard');
                setKpis(response.data.kpis);
                setGraficos(response.data.graficos);
                // Busca também as perguntas de texto para o select
                const perguntasResponse = await api.get('/perguntas');
                setTextQuestions(perguntasResponse.data.filter((p: any) => p.tipos === 'TEXTO'));
            } catch (error) {
                console.error("Erro ao carregar dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Carrega dados da nuvem de palavras quando uma pergunta é selecionada
    useEffect(() => {
        if (selectedTextQuestion) {
            const fetchWordCloud = async () => {
                try {
                    setIsLoadingWordCloud(true);
                    const response = await api.get(`/analise-texto?perguntaId=${selectedTextQuestion}`);
                    setWordCloudData(response.data.wordCloud);
                } catch (error) {
                    console.error("Erro ao carregar nuvem de palavras:", error);
                } finally {
                    setIsLoadingWordCloud(false);
                }
            };
            fetchWordCloud();
        }
    }, [selectedTextQuestion]);

    if (isLoading) {
        return <div className="text-center p-10">Carregando dados do dashboard...</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Geral da Empresa</h1>

            {/* Seção de KPIs */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total de Avaliações" value={kpis?.totalAvaliacoes ?? 0} icon={FileText} color="text-indigo-500" bgColor="bg-indigo-50 dark:bg-indigo-700/30" />
                <StatCard title="Total de Respondentes" value={kpis?.totalRespondentes ?? 0} icon={Users} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-700/30" />
                <StatCard title="Respostas Finalizadas" value={kpis?.totalFinalizados ?? 0} icon={CheckSquare} color="text-green-500" bgColor="bg-green-50 dark:bg-green-700/30" />
                <StatCard title="Taxa de Conclusão" value={`${kpis?.taxaDeConclusao ?? 0}%`} icon={TrendingUp} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-700/30" />
            </div>

            {/* Seção de Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {graficos.map(grafico => (
                    <QuestionBarChart key={grafico.perguntaId} title={grafico.enunciado} data={grafico.respostas} />
                ))}

                {/* Word Cloud Section */}
                <div>
                    <div className="form-group">
                        <label htmlFor="text-question-select" className="form-label">Analisar Pergunta de Texto:</label>
                        <select
                            id="text-question-select"
                            className="input-edit-mode"
                            value={selectedTextQuestion}
                            onChange={e => setSelectedTextQuestion(e.target.value)}
                        >
                            <option value="">Selecione uma pergunta</option>
                            {textQuestions.map(q => <option key={q.id} value={q.id}>{q.enunciado}</option>)}
                        </select>
                    </div>
                    {isLoadingWordCloud ? <div className="text-center p-10">Analisando textos...</div> : <WordCloud words={wordCloudData} title="" />}                </div>
            </div>
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