'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import '../../globals.css';
import { CheckSquare, SendHorizonal } from 'lucide-react';
import ApplicationLogo from '@/components/ApplicationLogo';

// --- Interfaces (Tipos de Dados) ---
interface Opcao {
  id: number;
  texto: string;
}

interface Pergunta {
  id: number;
  enunciado: string;
  tipo: 'TEXTO' | 'MULTIPLA_ESCOLHA';
  obrigatoria: boolean;
  opcoes: Opcao[];
}

interface AvaliacaoParaResponder {
  tituloQuestionario: string;
  nomeEmpresa: string;
  requerLoginCliente: boolean;
  perguntas: Pergunta[];
  hasResponded?: boolean;
}

// --- Componente Principal ---
function ResponderAvaliacaoContent() {
  const params = useParams();
  const avaliacaoId = params.avaliacaoId as string;

  const [avaliacaoData, setAvaliacaoData] = useState<AvaliacaoParaResponder | null>(null);
  const [respostas, setRespostas] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // --- Funções de Lógica ---
  const getAnonymousSessionId = useCallback(() => {
    if (typeof window === 'undefined') return null;
    let sessionId = localStorage.getItem('anonymousSessionId');
    if (!sessionId) {
      if (crypto && typeof crypto.randomUUID === 'function') {
        sessionId = crypto.randomUUID();
      } else {
        console.warn("crypto.randomUUID não disponível. Usando fallback.");
        sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      localStorage.setItem('anonymousSessionId', sessionId);
    }
    return sessionId;
  }, []);

  useEffect(() => {
    if (!avaliacaoId) return;

    const initializePage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sessionId = getAnonymousSessionId();
        const payload = { anonymousSessionId: sessionId };
        
        // CORREÇÃO APLICADA AQUI: Chamando a rota correta que você já criou no backend.
        const response = await api.post<AvaliacaoParaResponder>(`/public/avaliacoes/${avaliacaoId}/iniciar`, payload);
        
        setAvaliacaoData(response.data);

        if (response.data.hasResponded) {
          setSubmissionSuccess(true);
          setError("Você já respondeu a esta avaliação.");
        }

      } catch (err: any) {
        console.error("Erro ao buscar avaliação:", err);
        if (err.response?.status === 404) {
            setError("Esta avaliação não foi encontrada ou não está mais disponível.");
        } else {
            setError(err.response?.data?.message || "Não foi possível carregar a avaliação.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [avaliacaoId, getAnonymousSessionId]);

  const handleInputChange = (perguntaId: number, valor: string) => {
    setRespostas(prev => ({ ...prev, [perguntaId]: valor }));
  };

  const handleSubmitRespostas = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!avaliacaoData) return;

    for (const pergunta of avaliacaoData.perguntas) {
      if (pergunta.obrigatoria && (!respostas[pergunta.id] || respostas[pergunta.id].trim() === '')) {
        alert(`A pergunta "${pergunta.enunciado}" é obrigatória.`);
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      anonymousSessionId: getAnonymousSessionId(),
      respostas: Object.entries(respostas).map(([perguntaId, resposta]) => ({
        perguntaId: parseInt(perguntaId),
        textoResposta: resposta, // Corrigido para corresponder ao backend
      })),
    };

    try {
      // CORREÇÃO APLICADA AQUI: Chamando a rota correta para submeter as respostas.
      await api.post(`/public/avaliacoes/${avaliacaoId}/respostas`, payload);
      setSubmissionSuccess(true);
    } catch (err: any)      {
      console.error("Erro ao enviar respostas:", err);
      setError(err.response?.data?.message || "Ocorreu um erro ao enviar suas respostas. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Renderização do Componente ---
  if (isLoading) {
    return <div className="text-center p-8 text-text-muted">Carregando avaliação...</div>;
  }

  if (submissionSuccess || (error && avaliacaoData?.hasResponded)) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-16 px-4">
        <CheckSquare className="mx-auto h-20 w-20 text-green-500" strokeWidth={1.5} />
        <h1 className="mt-6 text-3xl font-bold text-foreground">Obrigado!</h1>
        <p className="mt-3 text-lg text-text-muted">Sua avaliação foi registrada com sucesso.</p>
      </div>
    );
  }

  if (error) {
      return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!avaliacaoData) {
    return <div className="text-center p-8">Avaliação não encontrada.</div>;
  }
  
  const progresso = (Object.values(respostas).filter(r => r && r.trim() !== '').length / avaliacaoData.perguntas.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <header className="mb-8 text-center">
        <div className="flex justify-center items-center mb-4">
          <ApplicationLogo className="h-12 w-12" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{avaliacaoData.tituloQuestionario}</h1>
        <p className="mt-2 text-md sm:text-lg text-text-muted">Avaliação de: {avaliacaoData.nomeEmpresa}</p>
      </header>
      
      <div className="mb-8">
        <div className="w-full bg-border rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progresso}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-text-muted mt-2">{Math.round(progresso)}% Concluído</p>
      </div>

      <form onSubmit={handleSubmitRespostas} className="space-y-8">
        {avaliacaoData.perguntas.map((pergunta, index) => (
          <div key={pergunta.id} className="p-6 bg-card-background dark:bg-gray-800 shadow-lg rounded-xl border border-border">
            <label className="form-label text-lg font-semibold text-foreground">
              {index + 1}. {pergunta.enunciado}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            
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
          </div>
        ))}
        
        <div className="pt-6 flex justify-end">
          <button type="submit" className="btn btn-primary btn-lg inline-flex items-center gap-2" disabled={isSubmitting || isLoading}>
            {isSubmitting ? "Enviando..." : "Enviar Respostas"}
            {!isSubmitting && <SendHorizonal size={18} />}
          </button>
        </div>
      </form>

      <footer className="mt-16 text-center">
        <div className="inline-flex items-center gap-2">
          <p className="text-sm text-text-muted">Powered by</p>
          <ApplicationLogo className="h-6 w-6" />
          <p className="text-sm font-semibold text-text-base">Evaluation</p>
        </div>
      </footer>
    </div>
  );
}

// --- Componente de Exportação com Suspense ---
export default function ResponderAvaliacaoPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Carregando...</div>}>
      <ResponderAvaliacaoContent />
    </Suspense>
  );
}