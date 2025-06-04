// frontend/src/app/perguntas/update/[id]/page.tsx (VERSÃO MELHORADA)
'use client';

import { useEffect, useState, Suspense } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "../../../globals.css"; // Seu globals.css unificado
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import { PlusIcon, Trash2, Save, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'; // Ícones

// Interface para a pergunta como recebida da API (incluindo opções)
interface PerguntaComOpcoes {
    id: number;
    enunciado: string;
    tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA'; // Permitindo string para flexibilidade inicial
    opcoes?: { id: number; texto: string }[]; // Opções podem vir do backend
    created_at?: string;
    updated_at?: string;
}

// Interface para o estado local das opções (pode incluir tempId para novas opções)
interface OpcaoEditData {
    id?: number; // ID da opção existente no backend
    tempId?: string; // ID temporário para novas opções no frontend
    texto: string;
}

function UpdatePerguntaContent() {
    const router = useRouter();
    const params = useParams();
    const perguntaId = params.id ? parseInt(params.id as string) : null;

    const [enunciado, setEnunciado] = useState("");
    const [tipos, setTipos] = useState<'TEXTO' | 'MULTIPLA_ESCOLHA'>('TEXTO');
    const [opcoes, setOpcoes] = useState<OpcaoEditData[]>([]);

    const [isLoading, setIsLoading] = useState(false); // Para submissão do formulário
    const [isPageLoading, setIsPageLoading] = useState(true); // Para carregamento inicial dos dados
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!perguntaId) {
            setError("ID da Pergunta não fornecido na URL.");
            setIsPageLoading(false);
            return;
        }

        setIsPageLoading(true);
        setError(null);
        api.get<PerguntaComOpcoes>(`/perguntas/${perguntaId}`)
            .then((response) => {
                const perguntaData = response.data;
                setEnunciado(perguntaData.enunciado);
                setTipos(perguntaData.tipos as 'TEXTO' ?? 'MULTIPLA_ESCOLHA'); // Cast para o tipo esperado
                setOpcoes(perguntaData.opcoes?.map(opt => ({ id: opt.id, texto: opt.texto })) || []);
            })
            .catch((err: any) => {
                console.error("Erro ao buscar a pergunta:", err.response?.data ?? err.message);
                setError(err.response?.data?.message ?? "Erro ao buscar os dados da pergunta para edição.");
            })
            .finally(() => {
                setIsPageLoading(false);
            });
    }, [perguntaId]);


    // Funções para manipular opções de múltipla escolha (similares à página de create)
    const handleAddOpcao = () => {
        setOpcoes([...opcoes, { tempId: `temp-${Date.now()}`, texto: "" }]);
    };

    const handleOpcaoChange = (index: number, texto: string) => {
        const novasOpcoes = [...opcoes];
        novasOpcoes[index].texto = texto;
        setOpcoes(novasOpcoes);
    };

    const handleRemoveOpcao = (index: number) => {
        // Se a opção tiver um ID real (do backend), precisaremos tratar a exclusão dela
        // de forma diferente na submissão se o backend não fizer cascade/gerenciamento automático.
        // Por ora, apenas remove do estado local. O backend (UpdatePerguntasController)
        // já deleta todas as opções antigas e recria as novas.
        setOpcoes(opcoes.filter((_, i) => i !== index));
    };
    
    const handleTipoChange = (novoTipo: 'TEXTO' | 'MULTIPLA_ESCOLHA') => {
        setTipos(novoTipo);
        if (novoTipo === 'TEXTO') {
            setOpcoes([]);
        } else if (opcoes.length === 0 && novoTipo === 'MULTIPLA_ESCOLHA') {
             // Adiciona uma opção inicial se mudar para MULTIPLA_ESCOLHA e não houver opções
            handleAddOpcao();
        }
    };


    const handleUpdatePergunta = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!enunciado.trim()) {
            setError("O enunciado da pergunta é obrigatório.");
            return;
        }
        if (tipos === 'MULTIPLA_ESCOLHA' && (opcoes.length === 0 || opcoes.some(opt => !opt.texto.trim()))) {
            setError("Para perguntas de múltipla escolha, adicione pelo menos uma opção com texto.");
            return;
        }
        if (!perguntaId) {
            setError("ID da pergunta inválido para atualização.");
            return;
        }

        setIsLoading(true);

        const dataPayload = {
            id: perguntaId,
            enunciado: enunciado.trim(),
            tipos,
            // No backend, o UpdatePerguntasController espera um array de objetos { texto: string } para 'opcoes'
            // Ele vai deletar as opções antigas e criar essas novas.
            opcoes: tipos === 'MULTIPLA_ESCOLHA' ? opcoes.map(opt => ({ texto: opt.texto.trim() })) : [],
        };

        try {
            await api.put("/perguntas", dataPayload); // Rota PUT para /perguntas, envia ID no corpo
            setSuccessMessage("Pergunta atualizada com sucesso! Redirecionando...");
            setTimeout(() => {
                router.push("/perguntas");
            }, 2000);
        } catch (err: any) {
            console.error("Erro ao atualizar pergunta:", err.response?.data ?? err.message);
            setError(err.response?.data?.message ?? "Erro ao atualizar a pergunta. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isPageLoading) {
        return (
            <div className="page-container flex items-center justify-center min-h-[calc(100vh-12rem)]">
                <div className="flex flex-col items-center">
                    <Loader2 size={48} className="text-primary animate-spin mb-4" />
                    <p className="text-text-muted text-lg">Carregando dados da pergunta...</p>
                </div>
            </div>
        );
    }

    if (error && !enunciado) { // Erro crítico ao carregar os dados iniciais
        return (
             <div className="page-container center-content text-center">
                <AlertTriangle size={48} className="text-error mx-auto mb-4" />
                <p className="text-xl font-semibold text-error mb-2">Erro ao carregar pergunta</p>
                <p className="text-text-muted mb-6">{error}</p>
                <Link href="/perguntas" className="btn btn-primary">
                    Voltar para Lista de Perguntas
                </Link>
            </div>
        );
    }


    return (
        <div className="page-container">
            <div className="editor-form-card" style={{ maxWidth: '700px' }}>
                <div className="form-header">
                    <h3>Editando Pergunta (ID: {perguntaId})</h3>
                    <Link href="/perguntas" className="btn btn-outline btn-sm">
                        Cancelar Edição
                    </Link>
                </div>

                <form onSubmit={handleUpdatePergunta} className="display-section space-y-6">
                    {error && !successMessage && ( // Mostrar erro apenas se não houver mensagem de sucesso
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700 flex items-center" role="alert">
                            <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
                            <span className="font-medium">Erro:</span> {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300 dark:bg-green-700/30 dark:text-green-300 dark:border-green-700 flex items-center" role="alert">
                            <CheckCircle2 size={18} className="mr-2 flex-shrink-0" />
                            {successMessage}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="enunciado" className="form-label">Enunciado da Pergunta</label>
                        <textarea
                            id="enunciado"
                            value={enunciado}
                            onChange={e => setEnunciado(e.target.value)}
                            rows={3}
                            className="input-edit-mode question-textarea"
                            placeholder="Digite o enunciado completo da pergunta..."
                            required
                            disabled={isLoading || isPageLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipo" className="form-label">Tipo de Pergunta</label>
                        <select
                            id="tipo"
                            value={tipos}
                            onChange={(e) => handleTipoChange(e.target.value as 'TEXTO' | 'MULTIPLA_ESCOLHA')}
                            className="input-edit-mode"
                            disabled={isLoading || isPageLoading}
                        >
                            <option value="TEXTO">Texto Dissertativo</option>
                            <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
                        </select>
                    </div>

                    {tipos === 'MULTIPLA_ESCOLHA' && (
                        <fieldset className="form-group border-t border-border pt-4 mt-4">
                            <legend className="form-label mb-2">Opções de Resposta</legend>
                            <div className="space-y-3">
                                {opcoes.map((opcao, index) => (
                                    <div key={opcao.id ?? opcao.tempId ?? index} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={opcao.texto}
                                            onChange={(e) => handleOpcaoChange(index, e.target.value)}
                                            placeholder={`Texto da Opção ${index + 1}`}
                                            className="input-edit-mode flex-grow"
                                            required
                                            disabled={isLoading || isPageLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOpcao(index)}
                                            className="btn btn-danger btn-sm p-2"
                                            title="Remover Opção"
                                            disabled={isLoading || isPageLoading}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddOpcao}
                                className="btn btn-outline btn-sm mt-3 inline-flex items-center"
                                disabled={isLoading || isPageLoading}
                            >
                                <PlusIcon size={16} className="mr-1" /> Adicionar Opção
                            </button>
                        </fieldset>
                    )}

                    <div className="form-actions pt-4 border-t border-border">
                         <Link href="/perguntas" className="btn btn-secondary" aria-disabled={isLoading}>
                            Voltar
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-primary inline-flex items-center"
                            disabled={isLoading || isPageLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin mr-2"/>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                   <Save size={16} className="mr-2"/>
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default function UpdatePerguntaPage() {
    return (
        <Suspense fallback={
            <div className="page-container flex items-center justify-center min-h-[calc(100vh-12rem)]">
                 <div className="flex flex-col items-center">
                    <Loader2 size={48} className="text-primary animate-spin mb-4" />
                    <p className="text-text-muted text-lg">Carregando formulário de edição...</p>
                </div>
            </div>
        }>
            <AdminAuthGuard>
                <UpdatePerguntaContent />
            </AdminAuthGuard>
        </Suspense>
    );
}