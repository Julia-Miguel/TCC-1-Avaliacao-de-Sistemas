'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { CheckSquare } from 'lucide-react';
import "../../globals.css";

// --- INTERFACES ---
interface OpcaoResposta {
    id: number;
    texto: string;
}

interface PerguntaParaResponder {
    id: number;
    enunciado: string;
    obrigatoria: boolean;
    // CORREÇÃO DEFINITIVA: O nome do campo é 'tipo' (singular) para corresponder ao backend.
    tipo: 'TEXTO' | 'MULTIPLA_ESCOLHA'; 
    opcoes: OpcaoResposta[];
}

interface AvaliacaoParaResponder {
    avaliacaoId: number;
    semestreAvaliacao: string;
    requerLoginCliente: boolean;
    nomeEmpresa: string;
    tituloQuestionario: string;
    perguntas: PerguntaParaResponder[];
}

interface RespostasState {
    [perguntaId: number]: string;
}

interface ClienteUser {
    id: number;
    nome?: string | null;
    email: string;
    tipo: 'CLIENTE_PLATAFORMA';
}

// --- FUNÇÕES UTILITÁRIAS ---
function getAnonymousSessionId() {
    if (typeof window === "undefined") return null;
    let sessionId = localStorage.getItem('anonymousSessionId');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('anonymousSessionId', sessionId);
    }
    return sessionId;
}

// --- COMPONENTE PRINCIPAL ---
function ResponderAvaliacaoContent() {
    const params = useParams();
    const router = useRouter();
    const avaliacaoIdParam = params.avaliacaoId as string;

    const [avaliacaoData, setAvaliacaoData] = useState<AvaliacaoParaResponder | null>(null);
    const [respostas, setRespostas] = useState<RespostasState>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!avaliacaoIdParam) {
            return;
        }

        const avaliacaoId = parseInt(avaliacaoIdParam, 10);
        if (isNaN(avaliacaoId)) {
            setError("O ID da avaliação na URL é inválido.");
            setIsLoading(false);
            return;
        }

        const initializePage = async () => {
            setIsLoading(true);

            const clienteUserString = localStorage.getItem('clienteUser');
            const cliente: ClienteUser | null = clienteUserString ? JSON.parse(clienteUserString) : null;
            const anonId = getAnonymousSessionId();
            
            try {
                const payload = cliente ? { usuarioId: cliente.id } : { anonymousSessionId: anonId };
                // A chamada única ao backend continua correta.
                const response = await api.post<AvaliacaoParaResponder>(`/public/avaliacoes/${avaliacaoId}/iniciar`, payload);

                if (response.data && Array.isArray(response.data.perguntas)) {
                    setAvaliacaoData(response.data);
                    const initialRespostas: RespostasState = {};
                    response.data.perguntas.forEach(p => {
                        initialRespostas[p.id] = '';
                    });
                    setRespostas(initialRespostas);
                } else {
                    console.error("Payload da API inválido:", response.data);
                    setError("Recebemos uma resposta inesperada do servidor.");
                }

            } catch (err: any) {
                console.error("Erro na inicialização da página:", JSON.stringify(err.response?.data || err.message, null, 2));
                setError(err.response?.data?.message ?? "Não foi possível carregar a avaliação.");
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, [avaliacaoIdParam]);

    const handleInputChange = (perguntaId: number, valor: string) => {
        setRespostas(prev => ({ ...prev, [perguntaId]: valor }));
    };

    const handleSubmitRespostas = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const avaliacaoId = parseInt(avaliacaoIdParam, 10);

        if (!avaliacaoData) return;

        for (const pergunta of avaliacaoData.perguntas) {
            if (pergunta.obrigatoria && !respostas[pergunta.id]?.trim()) {
                alert(`A pergunta "${pergunta.enunciado}" é obrigatória.`);
                return;
            }
        }

        setIsSubmitting(true);
        setError(null);
        
        const clienteUserString = localStorage.getItem('clienteUser');
        const cliente: ClienteUser | null = clienteUserString ? JSON.parse(clienteUserString) : null;

        const payload = {
            respostas: Object.entries(respostas).map(([pId, respTexto]) => ({
                perguntaId: parseInt(pId),
                respostaTexto: respTexto
            })),
            ...(cliente ? { usuarioId: cliente.id } : { anonymousSessionId: getAnonymousSessionId() })
        };

        try {
            const response = await api.post(`/public/avaliacoes/${avaliacaoId}/respostas`, payload);
            setSubmissionMessage(response.data.message ?? "Respostas enviadas com sucesso!");
        } catch (err: any) {
            setError(err.response?.data?.message ?? "Erro ao enviar suas respostas.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) return <div className="page-container center-content"><p>Carregando...</p></div>;
    if (error) return <div className="page-container center-content"><p className="text-red-500">{error}</p><Link href="/" className="btn btn-secondary mt-4">Voltar</Link></div>;
    if (submissionMessage) return <div className="page-container center-content text-center py-10"><CheckSquare size={64} className="text-green-500 mx-auto mb-6" /><h2 className="text-3xl font-semibold mb-3">Obrigado!</h2><p className="text-lg text-text-muted">{submissionMessage}</p><Link href="/" className="btn btn-primary mt-8">Voltar para a Página Inicial</Link></div>;
    if (!avaliacaoData) return <div className="page-container center-content"><p>Não foi possível carregar os dados da avaliação.</p></div>;

    return (
        <div className="page-container max-w-3xl mx-auto py-8 px-4">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-foreground">{avaliacaoData.tituloQuestionario}</h1>
                <p className="mt-2 text-lg text-text-muted">Avaliação de: {avaliacaoData.nomeEmpresa}</p>
            </header>
            <form onSubmit={handleSubmitRespostas} className="space-y-8">
                {avaliacaoData.perguntas.map((pergunta, index) => (
                    <div key={pergunta.id} className="p-6 bg-card-background dark:bg-gray-800 shadow-lg rounded-xl border border-border">
                        <label className="form-label text-lg font-semibold text-foreground">
                            {index + 1}. {pergunta.enunciado}
                            {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        
                        {/* --- INÍCIO DA CORREÇÃO --- */}
                        {/* A lógica agora usa 'tipo' (singular) e é robusta a maiúsculas/minúsculas. */}

                        {pergunta.tipo?.toUpperCase() === 'TEXTO' && (
                            <textarea
                                id={`pergunta-${pergunta.id}`}
                                rows={5}
                                className="input-edit-mode w-full mt-3"
                                value={respostas[pergunta.id] || ''}
                                onChange={(e) => handleInputChange(pergunta.id, e.target.value)}
                                placeholder="Digite sua resposta aqui..."
                                disabled={isSubmitting}
                            />
                        )}

                        {pergunta.tipo?.toUpperCase() === 'MULTIPLA_ESCOLHA' && (
                            <div className="mt-4 space-y-3">
                                {pergunta.opcoes.map(opcao => (
                                    <div key={opcao.id} className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <input
                                            id={`pergunta-${pergunta.id}-opcao-${opcao.id}`}
                                            name={`pergunta-${pergunta.id}`}
                                            type="radio"
                                            value={opcao.texto}
                                            checked={respostas[pergunta.id] === opcao.texto}
                                            onChange={(e) => handleInputChange(pergunta.id, e.target.value)}
                                            className="h-5 w-5 text-primary focus:ring-primary"
                                            disabled={isSubmitting}
                                        />
                                        <label 
                                            htmlFor={`pergunta-${pergunta.id}-opcao-${opcao.id}`} 
                                            className="ml-3 block text-md text-foreground cursor-pointer"
                                        >
                                            {opcao.texto}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* --- FIM DA CORREÇÃO --- */}

                    </div>
                ))}
                <div className="pt-8 flex justify-end">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting || isLoading}>{isSubmitting ? "Enviando..." : "Enviar Respostas"}</button>
                </div>
            </form>
        </div>
    );
}

export default function ResponderAvaliacaoPage() {
    return (
        <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
            <ResponderAvaliacaoContent />
        </Suspense>
    );
}