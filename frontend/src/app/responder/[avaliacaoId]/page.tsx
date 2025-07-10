'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { CheckSquare } from 'lucide-react';
import "../../globals.css";

interface OpcaoResposta {
    id: number;
    texto: string;
}
interface PerguntaParaResponder {
    id: number;
    enunciado: string;
    obrigatoria: boolean;
    tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA';
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

function generateSimpleUUID() {
    let d = new Date().getTime();
    let d2 = (typeof performance !== 'undefined' && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;
        if (d > 0) { r = (d + r) % 16 | 0; d = Math.floor(d / 16); }
        else { r = (d2 + r) % 16 | 0; d2 = Math.floor(d2 / 16); }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
function getAnonymousSessionId() {
    if (typeof window === "undefined") return null;
    let sessionId = localStorage.getItem('anonymousSessionId');
    if (!sessionId) {
        sessionId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : generateSimpleUUID();
        localStorage.setItem('anonymousSessionId', sessionId);
    }
    return sessionId;
}
function ResponderAvaliacaoContent() {
    const params = useParams();
    const router = useRouter();
    const avaliacaoId = params.avaliacaoId ? parseInt(params.avaliacaoId as string) : null;

    const [avaliacaoData, setAvaliacaoData] = useState<AvaliacaoParaResponder | null>(null);
    const [respostas, setRespostas] = useState<RespostasState>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
    const [anonymousSessionId, setAnonymousSessionId] = useState<string | null>(null);
    const [loggedInCliente, setLoggedInCliente] = useState<ClienteUser | null>(null);

    // ✅ LÓGICA DE CARREGAMENTO E INICIALIZAÇÃO ATUALIZADA
    useEffect(() => {
        if (!avaliacaoId) {
            setError("ID da Avaliação não fornecido.");
            setIsLoading(false);
            return;
        }

        // Função para registrar o início da avaliação
        const startEvaluationSession = async (userId?: number, sessionId?: string) => {
            const payload = userId ? { usuarioId: userId } : { anonymousSessionId: sessionId };
            if (!payload.usuarioId && !payload.anonymousSessionId) return;

            try {
                // Chamada "fire-and-forget" para o novo endpoint
                await api.post(`/public/avaliacoes/${avaliacaoId}/iniciar`, payload);
                console.log("Sessão de avaliação iniciada com sucesso.");
            } catch (err) {
                // Não bloqueamos o usuário por isso, apenas logamos o erro.
                console.error("Falha ao registrar o início da avaliação:", err);
            }
        };

        const initializePage = async () => {
            setIsLoading(true);

            // Identifica o usuário primeiro
            let cliente: ClienteUser | null = null;
            let anonId: string | null = null;
            if (typeof window !== "undefined") {
                const clienteUserString = localStorage.getItem('clienteUser');
                if (clienteUserString) {
                    try {
                        cliente = JSON.parse(clienteUserString);
                        setLoggedInCliente(cliente);
                    } catch (e) { console.error("Erro ao parsear clienteUser:", e); }
                }
                anonId = getAnonymousSessionId();
                setAnonymousSessionId(anonId);
            }

            // Agora, registra o início da sessão
            await startEvaluationSession(cliente?.id, anonId ?? undefined);

            // Finalmente, carrega os dados da avaliação
            try {
                const response = await api.get<AvaliacaoParaResponder>(`/public/avaliacoes/${avaliacaoId}`);
                setAvaliacaoData(response.data);
                const initialRespostas: RespostasState = {};
                response.data.perguntas.forEach(p => {
                    initialRespostas[p.id] = '';
                });
                setRespostas(initialRespostas);
            } catch (err: any) {
                setError(err.response?.data?.message ?? "Não foi possível carregar a avaliação.");
            } finally {
                setIsLoading(false);
            }
        };

        initializePage();
    }, [avaliacaoId]);

    const handleInputChange = (perguntaId: number, valor: string) => {
        setRespostas(prev => ({ ...prev, [perguntaId]: valor }));
    };

    // ✅ FUNÇÃO DE SUBMISSÃO CORRIGIDA
    const handleSubmitRespostas = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!avaliacaoData) {
            setError("Dados da avaliação não carregados.");
            return;
        }

        // Validação JS: Apenas para perguntas obrigatórias
        for (const pergunta of avaliacaoData.perguntas) {
            if (pergunta.obrigatoria) {
                const resposta = respostas[pergunta.id];
                if (!resposta || resposta.trim() === '') {
                    alert(`A pergunta "${pergunta.enunciado}" é obrigatória.`);
                    return; // Para a submissão
                }
            }
        }

        setIsSubmitting(true);
        setError(null);
        setSubmissionMessage(null);

        const payload: {
            respostas: { perguntaId: number, respostaTexto: string }[];
            usuarioId?: number;
            anonymousSessionId?: string;
        } = {
            respostas: Object.entries(respostas).map(([pId, respTexto]) => ({
                perguntaId: parseInt(pId),
                respostaTexto: respTexto
            })),
        };

        if (loggedInCliente) {
            payload.usuarioId = loggedInCliente.id;
        } else if (anonymousSessionId) {
            payload.anonymousSessionId = anonymousSessionId;
        } else {
            setError("Não foi possível identificar sua sessão.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.post(`/public/avaliacoes/${avaliacaoId}/respostas`, payload);
            setSubmissionMessage(response.data.message ?? "Respostas enviadas com sucesso!");
        } catch (err: any) {
            console.error("Erro ao enviar respostas:", err.response?.data ?? err.message);
            setError(err.response?.data?.message ?? "Erro ao enviar suas respostas.");
        } finally {
            setIsSubmitting(false);
        }
    }; // A CHAVE `}` ESTAVA NO LUGAR ERRADO. AQUI É O FIM CORRETO DA FUNÇÃO.

    // --- Lógica de Renderização (sem alterações, exceto pela remoção do 'required') ---

    if (isLoading) {
        return <div className="page-container center-content"><p>Carregando...</p></div>;
    }

    if (error && !submissionMessage) {
        return (
            <div className="page-container center-content">
                <p className="text-red-500">{error}</p>
                <Link href="/" className="btn btn-secondary mt-4">Voltar</Link>
            </div>
        );
    }

    if (avaliacaoData?.requerLoginCliente && !loggedInCliente) {
        if (typeof window !== "undefined") {
            router.push(`/clientes/login?redirectTo=/responder/${avaliacaoId}`);
        }
        return <div className="page-container center-content"><p>Redirecionando para login...</p></div>;
    }

    if (submissionMessage) {
        return (
            <div className="page-container center-content text-center py-10">
                <CheckSquare size={64} className="text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-semibold mb-3">Obrigado!</h2>
                <p className="text-lg text-text-muted">{submissionMessage}</p>
                <Link href="/" className="btn btn-primary mt-8">Voltar para a Página Inicial</Link>
            </div>
        );
    }

    if (!avaliacaoData) {
        return <div className="page-container center-content"><p>Avaliação não encontrada.</p></div>;
    }

    return (
        <div className="page-container max-w-3xl mx-auto py-8 px-4">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-foreground">{avaliacaoData.tituloQuestionario}</h1>
                <p className="mt-2 text-lg text-text-muted">Avaliação de: {avaliacaoData.nomeEmpresa}</p>
                {avaliacaoData.semestreAvaliacao && <p className="mt-1 text-md text-text-muted">Referente a: {avaliacaoData.semestreAvaliacao}</p>}
            </header>

            <form onSubmit={handleSubmitRespostas} className="space-y-8">
                {avaliacaoData.perguntas.map((pergunta, index) => (
                    <div key={pergunta.id} className="p-6 bg-card-background dark:bg-gray-800 shadow-lg rounded-xl border border-border">
                        <label className="form-label text-lg font-semibold text-foreground">
                            {index + 1}. {pergunta.enunciado}
                            {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {pergunta.tipos === 'TEXTO' && (
                            <textarea
                                id={`pergunta-${pergunta.id}`}
                                rows={5}
                                className="input-edit-mode w-full mt-3"
                                value={respostas[pergunta.id] || ''}
                                onChange={(e) => handleInputChange(pergunta.id, e.target.value)}
                                placeholder="Digite sua resposta aqui..."
                                disabled={isSubmitting}
                            // ✅ ATRIBUTO 'required' REMOVIDO
                            />
                        )}

                        {pergunta.tipos === 'MULTIPLA_ESCOLHA' && (
                            <div className="mt-4 space-y-3">
                                {pergunta.opcoes.map(opcao => (
                                    <div key={opcao.id} className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <input
                                            id={`opcao-${opcao.id}-pergunta-${pergunta.id}`}
                                            name={`pergunta-${pergunta.id}`}
                                            type="radio"
                                            value={opcao.texto}
                                            checked={respostas[pergunta.id] === opcao.texto}
                                            onChange={(e) => handleInputChange(pergunta.id, e.target.value)}
                                            className="h-5 w-5 text-primary focus:ring-primary"
                                            disabled={isSubmitting}
                                        // ✅ ATRIBUTO 'required' REMOVIDO
                                        />
                                        <label htmlFor={`opcao-${opcao.id}-pergunta-${pergunta.id}`} className="ml-3 block text-md text-foreground cursor-pointer">
                                            {opcao.texto}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

                <div className="pt-8 flex justify-end">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting || isLoading}>
                        {isSubmitting ? "Enviando..." : "Enviar Minhas Respostas"}
                    </button>
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
