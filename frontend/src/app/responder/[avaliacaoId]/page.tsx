// frontend/src/app/responder/[avaliacaoId]/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { CheckSquare } from 'lucide-react'; // Assumindo que você tem lucide-react
import "../../globals.css"; // Ajuste o caminho para seu globals.css

// --- Interfaces (mantidas como na sua versão) ---
interface OpcaoResposta {
  id: number;
  texto: string;
}
interface PerguntaParaResponder {
  id: number;
  enunciado: string;
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
// --- Fim das Interfaces ---

// Função helper para gerar UUID simples (fallback)
function generateSimpleUUID() {
  let d = new Date().getTime();
  let d2 = (typeof performance !== 'undefined' && performance.now && (performance.now()*1000)) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16;
      if(d > 0){ r = (d + r)%16 | 0; d = Math.floor(d/16); } 
      else { r = (d2 + r)%16 | 0; d2 = Math.floor(d2/16); }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function ResponderAvaliacaoContent() {
    const params = useParams();
    const router = useRouter();
    // useSearchParams é útil para pegar o redirectTo caso o usuário venha da página de login, mas não é usado neste fluxo.
    // Manter ele aqui não causa problemas.
    const searchParams = useSearchParams(); 
    const avaliacaoId = params.avaliacaoId ? parseInt(params.avaliacaoId as string) : null;

    // --- Estados (sem alteração) ---
    const [avaliacaoData, setAvaliacaoData] = useState<AvaliacaoParaResponder | null>(null);
    const [respostas, setRespostas] = useState<RespostasState>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
    const [anonymousSessionId, setAnonymousSessionId] = useState<string | null>(null);
    const [loggedInCliente, setLoggedInCliente] = useState<ClienteUser | null>(null);

    // Efeito 1: Verifica se o cliente está logado ao carregar o componente.
    useEffect(() => {
        if (typeof window !== "undefined") {
            const clienteUserString = localStorage.getItem('clienteUser');
            const clienteToken = localStorage.getItem('clienteToken');
            if (clienteUserString && clienteToken) {
                try {
                    setLoggedInCliente(JSON.parse(clienteUserString));
                } catch (e) {
                    console.error("Erro ao parsear dados do clienteUser do localStorage:", e);
                    localStorage.removeItem('clienteUser');
                    localStorage.removeItem('clienteToken');
                }
            }
        }
    }, []);

    // Efeito 2: Define o ID de sessão anônima APENAS se o cliente NÃO estiver logado.
    // Este efeito roda sempre que o estado de 'loggedInCliente' mudar.
    useEffect(() => {
        if (typeof window !== "undefined" && !loggedInCliente) {
            let sessionId = localStorage.getItem('anonymousSessionId');
            if (!sessionId) {
                if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                    sessionId = crypto.randomUUID();
                } else {
                    sessionId = generateSimpleUUID(); 
                }
                localStorage.setItem('anonymousSessionId', sessionId);
            }
            setAnonymousSessionId(sessionId);
        } else if (loggedInCliente) {
            // Se o cliente está logado, não há necessidade de um ID anônimo.
            setAnonymousSessionId(null); 
        }
    }, [loggedInCliente]);

    // Efeito 3: Carrega os dados da avaliação.
    // CORRIGIDO: Este é o ÚNICO efeito que deve carregar os dados.
    useEffect(() => {
        if (!avaliacaoId) {
            setError("ID da Avaliação não fornecido na URL.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        setSubmissionMessage(null);

        const loadAvaliacao = async () => {
            try {
                const response = await api.get<AvaliacaoParaResponder>(`/public/avaliacoes/${avaliacaoId}`);
                setAvaliacaoData(response.data);
                const initialRespostas: RespostasState = {};
                response.data.perguntas.forEach(p => {
                    initialRespostas[p.id] = ''; 
                });
                setRespostas(initialRespostas);
            } catch (err: any) {
                console.error("Erro ao carregar avaliação para responder:", err);
                if (err.response?.status === 404) {
                    setError("Avaliação não encontrada ou não está mais ativa.");
                } else {
                    setError("Não foi possível carregar a avaliação. Tente novamente mais tarde.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadAvaliacao();
    }, [avaliacaoId]);

    const handleInputChange = (perguntaId: number, valor: string) => {
        setRespostas(prevRespostas => ({
            ...prevRespostas,
            [perguntaId]: valor
        }));
    };

    const handleSubmitRespostas = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!avaliacaoData) {
            setError("Dados da avaliação não carregados.");
            return;
        }

        // Validação para garantir que todas as perguntas foram respondidas
        for (const pergunta of avaliacaoData.perguntas) {
            if (!respostas[pergunta.id] || respostas[pergunta.id].trim() === '') {
                setError(`Por favor, responda a pergunta: "${pergunta.enunciado}"`);
                // Foca no elemento da pergunta para melhor UX (opcional)
                const element = document.getElementById(`pergunta-${pergunta.id}`);
                element?.focus();
                return;
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

        // --- LÓGICA DE IDENTIFICAÇÃO CORRIGIDA ---
        // IMPLEMENTADO: Usa o objeto 'loggedInCliente' diretamente.
        if (loggedInCliente) {
            payload.usuarioId = loggedInCliente.id;
        } else if (anonymousSessionId) {
            payload.anonymousSessionId = anonymousSessionId;
        } else {
            // Este caso de erro é uma segurança extra, mas raramente deve acontecer.
            setError("Não foi possível identificar sua sessão. Recarregue a página e tente novamente.");
            setIsSubmitting(false);
            return;
        }
        
        try {
            const response = await api.post(`/public/avaliacoes/${avaliacaoId}/respostas`, payload);
            setSubmissionMessage(response.data.message ?? "Respostas enviadas com sucesso! Agradecemos a sua participação.");
        } catch (err: any) {
            console.error("Erro ao enviar respostas:", err.response?.data ?? err.message);
            setError(err.response?.data?.message ?? "Erro ao enviar suas respostas. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- Renderização condicional ---

    if (isLoading) {
        return <div className="page-container center-content"><p className="text-text-muted">Carregando avaliação...</p></div>;
    }

    if (error && !submissionMessage && !avaliacaoData) { 
        return (
            <div className="page-container center-content">
                <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
                <Link href="/" className="btn btn-secondary mt-6">Voltar para Home</Link>
            </div>
        );
    }

    if (!avaliacaoData && !isLoading) {
        return <div className="page-container center-content"><p className="text-text-muted">Avaliação não disponível ou ID inválido.</p></div>;
    }

    // --- LÓGICA DE REDIRECIONAMENTO CORRIGIDA ---
    // IMPLEMENTADO: Usa 'loggedInCliente' diretamente para a verificação.
    if (avaliacaoData?.requerLoginCliente && !loggedInCliente) {
        if (typeof window !== "undefined") {
            // Salva a URL atual para redirecionar de volta após o login
            localStorage.setItem('redirectToAfterLogin', `/responder/${avaliacaoId}`);
            console.log("Avaliação requer login. Redirecionando...");
        }
        // Redireciona para a página de login, passando a URL de retorno na query (prática recomendada)
        router.push(`/clientes/login?redirectTo=/responder/${avaliacaoId}`); 
        return <div className="page-container center-content"><p>Esta avaliação requer login. Redirecionando...</p></div>;
    }

    if (submissionMessage && !error) {
        return (
            <div className="page-container center-content text-center py-10">
                <CheckSquare size={64} className="text-green-500 dark:text-green-400 mx-auto mb-6" />
                <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">Obrigado!</h2>
                <p className="text-lg text-text-muted">{submissionMessage}</p>
                <Link href="/" className="btn btn-primary mt-10">
                    Voltar para a Página Inicial
                </Link>
            </div>
        );
    }

    // --- JSX do formulário (seu código original, que já estava ótimo) ---
    return (
        <div className="page-container max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {avaliacaoData && (
                <>
                    <header className="mb-10 text-center">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{avaliacaoData.tituloQuestionario}</h1>
                        <p className="mt-2 text-lg text-text-muted">Uma avaliação de: {avaliacaoData.nomeEmpresa}</p>
                        {avaliacaoData.semestreAvaliacao && <p className="mt-1 text-md text-text-muted">Referente a: {avaliacaoData.semestreAvaliacao}</p>}
                    </header>

                    <form onSubmit={handleSubmitRespostas} className="space-y-8">
                        {avaliacaoData.perguntas.map((pergunta, index) => (
                            <div key={pergunta.id} className="p-6 bg-card-background dark:bg-gray-800 shadow-lg rounded-xl border border-border">
                                <label htmlFor={`pergunta-${pergunta.id}`} className="form-label text-lg font-semibold text-foreground">
                                    {index + 1}. {pergunta.enunciado}
                                </label>
                                
                                {pergunta.tipos === 'TEXTO' && (
                                    <textarea
                                        id={`pergunta-${pergunta.id}`}
                                        rows={5}
                                        className="input-edit-mode w-full mt-3"
                                        value={respostas[pergunta.id] || ''}
                                        onChange={(e) => handleInputChange(pergunta.id, e.target.value)}
                                        placeholder="Digite sua resposta aqui..."
                                        required
                                        disabled={isSubmitting}
                                    />
                                )}

                                {pergunta.tipos === 'MULTIPLA_ESCOLHA' && (
                                    <div className="mt-4 space-y-3">
                                        {pergunta.opcoes.map(opcao => (
                                            <div key={opcao.id} className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                                <input
                                                    id={`opcao-${opcao.id}-pergunta-${pergunta.id}`}
                                                    name={`pergunta-${pergunta.id}`}
                                                    type="radio"
                                                    value={opcao.texto}
                                                    checked={respostas[pergunta.id] === opcao.texto}
                                                    onChange={(e) => handleInputChange(pergunta.id, e.target.value)}
                                                    className="h-5 w-5 text-primary focus:ring-primary border-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800 cursor-pointer"
                                                    required
                                                    disabled={isSubmitting}
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

                        {error && !submissionMessage && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center', fontWeight: '500' }}>{error}</p>}

                        <div className="pt-8 flex justify-end">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting || isLoading}>
                                {isSubmitting ? "Enviando..." : "Enviar Minhas Respostas"}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default function ResponderAvaliacaoPage() {
  return (
    <Suspense fallback={
        <div className="page-container flex items-center justify-center min-h-screen">
            <p className="text-text-muted text-lg">Carregando avaliação...</p>
        </div>
    }>
      <ResponderAvaliacaoContent />
    </Suspense>
  );
}

