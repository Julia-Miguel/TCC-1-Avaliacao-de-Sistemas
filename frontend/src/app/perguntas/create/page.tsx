// frontend/src/app/perguntas/create/page.tsx
'use client';

import { useState, Suspense } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../globals.css"; // Seu globals.css unificado
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import { PlusIcon, Trash2, Save, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react'; // Ícones

// Interface para as opções de pergunta de múltipla escolha
interface OpcaoData {
    id?: string; // ID temporário para a chave no React, não enviado ao backend se for nova
    texto: string;
}

// Componente de conteúdo principal
function CreatePerguntaContent() {
    const [enunciado, setEnunciado] = useState("");
    const [tipos, setTipos] = useState<'TEXTO' | 'MULTIPLA_ESCOLHA'>('TEXTO'); // Tipo com select
    const [opcoes, setOpcoes] = useState<OpcaoData[]>([]); // Estado para as opções

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    // Funções para manipular opções de múltipla escolha
    const handleAddOpcao = () => {
        setOpcoes([...opcoes, { id: `temp-${Date.now()}`, texto: "" }]);
    };

    const handleOpcaoChange = (index: number, texto: string) => {
        const novasOpcoes = [...opcoes];
        novasOpcoes[index].texto = texto;
        setOpcoes(novasOpcoes);
    };

    const handleRemoveOpcao = (index: number) => {
        setOpcoes(opcoes.filter((_, i) => i !== index));
    };

    const handleTipoChange = (novoTipo: 'TEXTO' | 'MULTIPLA_ESCOLHA') => {
        setTipos(novoTipo);
        if (novoTipo === 'TEXTO') {
            setOpcoes([]); // Limpa opções se mudar para TEXTO
        } else if (opcoes.length === 0) {
            // Adiciona uma opção inicial se mudar para MULTIPLA_ESCOLHA e não houver opções
            handleAddOpcao();
        }
    };

    const handleResetForm = () => {
        setEnunciado("");
        setTipos("TEXTO");
        setOpcoes([]);
        setError(null);
        setSuccessMessage(null);
    };

    const handleNewPergunta = async (event: React.FormEvent<HTMLFormElement>) => {
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

        setIsLoading(true);

        const dataPayload = {
            enunciado: enunciado.trim(),
            tipos,
            opcoes: tipos === 'MULTIPLA_ESCOLHA' ? opcoes.map(opt => ({ texto: opt.texto.trim() })) : [],
        };

        try {
            await api.post("/perguntas", dataPayload);
            setSuccessMessage("Pergunta cadastrada com sucesso! Redirecionando...");
            handleResetForm(); // Limpa o formulário
            setTimeout(() => {
                router.push("/perguntas");
            }, 2000); // Delay para o usuário ver a mensagem de sucesso
        } catch (err: any) {
            console.error("Erro ao cadastrar pergunta:", err.response?.data ?? err.message);
            setError(err.response?.data?.message ?? "Erro ao cadastrar a pergunta. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="editor-form-card" style={{ maxWidth: '700px' }}> {/* Card do formulário */}
                <div className="form-header">
                    <h3>Cadastro de Nova Pergunta Base</h3>
                    <Link href="/perguntas" className="btn btn-outline btn-sm">
                        Voltar para Lista
                    </Link>
                </div>

                <form onSubmit={handleNewPergunta} className="display-section space-y-6">
                    {/* Mensagens de Feedback */}
                    {error && (
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

                    {/* Campo Enunciado */}
                    <div className="form-group">
                        <label htmlFor="enunciado" className="form-label">Enunciado da Pergunta</label>
                        <textarea
                            id="enunciado"
                            value={enunciado}
                            onChange={e => setEnunciado(e.target.value)}
                            rows={3}
                            className="input-edit-mode question-textarea" // Estilo global para textarea
                            placeholder="Digite o enunciado completo da pergunta..."
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Campo Tipo de Pergunta */}
                    <div className="form-group">
                        <label htmlFor="tipo" className="form-label">Tipo de Pergunta</label>
                        <select
                            id="tipo"
                            value={tipos}
                            onChange={(e) => handleTipoChange(e.target.value as 'TEXTO' | 'MULTIPLA_ESCOLHA')}
                            className="input-edit-mode" // Estilo global para select
                            disabled={isLoading}
                        >
                            <option value="TEXTO">Texto Dissertativo</option>
                            <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
                        </select>
                    </div>

                    {/* Seção para Opções de Múltipla Escolha */}
                    {tipos === 'MULTIPLA_ESCOLHA' && (
                        <fieldset className="form-group border-t border-border pt-4 mt-4">
                            <legend className="form-label mb-2">Opções de Resposta</legend>
                            <div className="space-y-3">
                                {opcoes.map((opcao, index) => (
                                    <div key={opcao.id ?? index} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={opcao.texto}
                                            onChange={(e) => handleOpcaoChange(index, e.target.value)}
                                            placeholder={`Texto da Opção ${index + 1}`}
                                            className="input-edit-mode flex-grow"
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOpcao(index)}
                                            className="btn btn-danger btn-sm p-2" // Botão menor e quadrado
                                            title="Remover Opção"
                                            disabled={isLoading}
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
                                disabled={isLoading}
                            >
                            <PlusIcon size={16} className="mr-1" /> Adicionar Opção
                            </button>
                        </fieldset>
                    )}

                    {/* Botões de Ação */}
                    <div className="form-actions pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={handleResetForm}
                            className="btn btn-secondary inline-flex items-center"
                            disabled={isLoading}
                        >
                            <RotateCcw size={16} className="mr-2"/>
                            Limpar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary inline-flex items-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                   <Save size={16} className="mr-2"/>
                                    Cadastrar Pergunta
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Componente de página que exportamos como padrão
export default function CreatePerguntaPage() {
    return (
        <Suspense fallback={<div className="page-container center-content"><p>Carregando formulário...</p></div>}>
            <AdminAuthGuard>
                <CreatePerguntaContent />
            </AdminAuthGuard>
        </Suspense>
    );
}