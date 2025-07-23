// frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuestionBarChart } from "@/components/dashboard/QuestionBarChart";
import { WordCloud } from "@/components/dashboard/WordCloud";
import { TrendingUp, FileText, CheckSquare, Users, Loader2, ClipboardList } from "lucide-react";

// --- Interfaces para os dados ---
interface KpiData {
    totalAvaliacoes: number;
    totalRespondentes: number;
    totalFinalizados: number;
    taxaDeConclusao: number;
    totalQuestionarios: number;
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
// --- Fim das Interfaces ---

function DashboardPageContent() {
    const [kpis, setKpis] = useState<KpiData | null>(null);
    const [graficos, setGraficos] = useState<GraficoData[]>([]);
    const [wordCloudData, setWordCloudData] = useState<{ text: string; value: number }[]>([]);
    const [textQuestions, setTextQuestions] = useState<TextQuestion[]>([]);
    const [selectedTextQuestion, setSelectedTextQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingWordCloud, setIsLoadingWordCloud] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/dashboard');
                setKpis(response.data.kpis);
                setGraficos(response.data.graficos);
                setTextQuestions(response.data.textQuestions);
                if (response.data.textQuestions.length > 0) {
                    setSelectedTextQuestion(response.data.textQuestions[0].id.toString());
                }
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
                setError("Falha ao carregar os dados do dashboard.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedTextQuestion) {
            const fetchWordCloud = async () => {
                try {
                    setIsLoadingWordCloud(true);
                    const response = await api.get(`/analise-texto?perguntaId=${selectedTextQuestion}`);
                    setWordCloudData(response.data.wordCloud);
                } catch (error) {
                    console.error("Erro ao carregar nuvem de palavras:", error);
                    setWordCloudData([]);
                } finally {
                    setIsLoadingWordCloud(false);
                }
            };
            fetchWordCloud();
        }
    }, [selectedTextQuestion]);
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
    }
    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Geral</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total de Questionários" value={kpis?.totalQuestionarios ?? 0} icon={FileText} color="text-indigo-500" bgColor="bg-indigo-50 dark:bg-indigo-700/30" />
                <StatCard title="Total de Avaliações" value={kpis?.totalAvaliacoes ?? 0} icon={ClipboardList} color="text-blue-500" bgColor="bg-blue-50 dark:bg-blue-700/30" />
                <StatCard title="Respostas Finalizadas" value={kpis?.totalFinalizados ?? 0} icon={CheckSquare} color="text-green-500" bgColor="bg-green-50 dark:bg-green-700/30" />
                <StatCard title="Taxa de Conclusão" value={`${kpis?.taxaDeConclusao ?? 0}%`} icon={TrendingUp} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-700/30" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-foreground pt-4">Análise de Respostas</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {graficos.map(grafico => (
                    <QuestionBarChart key={grafico.perguntaId} title={grafico.enunciado} data={grafico.respostas} />
                ))}

                {textQuestions.length > 0 && (
                    <div className="bg-card-bg dark:bg-gray-800 p-6 rounded-lg shadow border border-border lg:col-span-2">
                        <div className="form-group mb-4">
                            <label htmlFor="text-question-select" className="form-label">Analisar Respostas de Texto:</label>
                            <select 
                                id="text-question-select" 
                                className="input-edit-mode w-full mt-1"
                                value={selectedTextQuestion}
                                onChange={e => setSelectedTextQuestion(e.target.value)}
                            >
                                {textQuestions.map(q => <option key={q.id} value={q.id}>{q.enunciado}</option>)}
                            </select>
                        </div>
                        <div className="w-full h-80">
                           {isLoadingWordCloud ? <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div> : <WordCloud words={wordCloudData} title={""} />}
                        </div>
                    </div>
                )}
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