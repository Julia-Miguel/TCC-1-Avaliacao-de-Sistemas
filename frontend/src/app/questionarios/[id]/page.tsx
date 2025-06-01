// frontend/src/app/questionarios/[id]/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import "../../globals.css";

// --- Interfaces Atualizadas ---
interface Opcao {
    id?: number;
    texto: string;
}

interface PerguntaAninhada {
    id: number;
    enunciado: string;
    tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA';
    opcoes: Opcao[];
}

interface QuePerg {
    perguntaId: number;
    questionarioId: number;
    pergunta: PerguntaAninhada;
}

export default function EditQuestionarioForm() {
    const router = useRouter();
    const { id } = useParams();
    const questionarioId = Number(id);

    const [titulo, setTitulo] = useState("");
    const [quePergs, setQuePergs] = useState<QuePerg[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!questionarioId) return;
        const loadData = async () => {
            try {
                const respQuestionario = await api.get<{ titulo: string }>(`/questionarios/${questionarioId}`);
                setTitulo(respQuestionario.data.titulo);

                const respQuePerg = await api.get<QuePerg[]>(`/quePerg?questionarioId=${questionarioId}`);

                // CORREÇÃO 1 (ESSENCIAL): Garantir que toda pergunta tenha um array 'opcoes'
                // Isto previne 100% o erro "cannot read properties of undefined (reading 'map')"
                const sanitizedQuePergs = respQuePerg.data.map(qp => ({
                    ...qp,
                    pergunta: {
                        ...qp.pergunta,
                        opcoes: qp.pergunta.opcoes || [] // Se 'opcoes' for undefined, transforma em []
                    }
                }));

                setQuePergs(sanitizedQuePergs);

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                alert("Não foi possível carregar os dados para edição.");
                router.push("/questionarios");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [questionarioId, router]);

    // --- Funções para Gerenciar o Formulário Dinâmico ---

    const handlePerguntaChange = (index: number, novoEnunciado: string) => {
        const newState = [...quePergs];
        newState[index].pergunta.enunciado = novoEnunciado;
        setQuePergs(newState);
    };

    const handleTipoChange = (index: number, novoTipo: 'TEXTO' | 'MULTIPLA_ESCOLHA') => {
        const newState = [...quePergs];
        const pergunta = newState[index].pergunta;
        pergunta.tipos = novoTipo;

        if (novoTipo === 'TEXTO') {
            pergunta.opcoes = [];
        } else if (novoTipo === 'MULTIPLA_ESCOLHA' && pergunta.opcoes.length === 0) {
            pergunta.opcoes.push({ texto: '' });
        }
        setQuePergs(newState);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, novoTexto: string) => {
        const newState = [...quePergs];
        newState[qIndex].pergunta.opcoes[oIndex].texto = novoTexto;
        setQuePergs(newState);
    };

    const addOption = (qIndex: number) => {
        const newState = [...quePergs];
        newState[qIndex].pergunta.opcoes.push({ texto: '' });
        setQuePergs(newState);
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        const newState = [...quePergs];
        newState[qIndex].pergunta.opcoes.splice(oIndex, 1);
        setQuePergs(newState);
    };

    const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // Promessa para atualizar o título do questionário
            const updateTituloPromise = api.put(`/questionarios`, {
                id: questionarioId,
                titulo: titulo
            });

            // Cria um array de promessas, uma para cada pergunta a ser atualizada.
            // Note que estamos chamando a rota no PLURAL: /perguntas
            const updatePerguntasPromises = quePergs.map(qp =>
                api.put(`/perguntas`, {
                    id: qp.pergunta.id,
                    enunciado: qp.pergunta.enunciado,
                    tipos: qp.pergunta.tipos,
                    opcoes: qp.pergunta.opcoes
                })
            );

            // Executa todas as promessas de atualização em paralelo.
            // O backend garantirá que tudo seja salvo corretamente com a transação.
            await Promise.all([updateTituloPromise, ...updatePerguntasPromises]);

            alert("Questionário atualizado com sucesso!");
            router.push("/questionarios");

        } catch (error: any) {
            console.error('Erro ao salvar:', error.response?.data ?? error.message);
            alert('Erro ao salvar as alterações!');
        }
    };

    if (isLoading) {
        return <div className="page-container"><p>Carregando dados...</p></div>;
    }

    return (
        <div className="page-container">
            <form onSubmit={handleSaveChanges} className="editor-form-card">
                <div className="form-header">
                    <h3>Editando Questionário</h3>
                    <div className="form-header-actions">
                        <button type="button" onClick={() => router.push("/questionarios")} className="btn-secondary">Cancelar</button>
                        <button type="submit" className="btn-primary">Salvar Alterações</button>
                    </div>
                </div>

                <div className="display-section">
                    <label htmlFor="titulo-input">Título</label>
                    <input id="titulo-input" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="input-edit-mode title-input" />
                </div>

                <div className="display-section">
                    <label htmlFor="perguntas-edit-list">Perguntas</label>
                    <div className="perguntas-edit-list">
                        {quePergs.map((qp, qIndex) => (
                            <div
                                key={`${qp.perguntaId}-${qIndex}`}
                                className="pergunta-editor-item"
                            >
                                <textarea
                                    value={qp.pergunta.enunciado}
                                    onChange={(e) => handlePerguntaChange(qIndex, e.target.value)}
                                    className="input-edit-mode question-textarea"
                                    rows={2}
                                    placeholder="Digite o enunciado da pergunta"
                                />
                                <div className="pergunta-meta-editor">
                                    <label htmlFor={`tipo-pergunta-select-${qIndex}`}>Tipo de Pergunta</label>
                                    <select
                                        id={`tipo-pergunta-select-${qIndex}`}
                                        value={qp.pergunta.tipos}
                                        onChange={(e) => handleTipoChange(qIndex, e.target.value as any)}
                                        className="select-tipo-pergunta"
                                    >
                                        <option value="TEXTO">Texto</option>
                                        <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
                                    </select>
                                </div>

                                {qp.pergunta.tipos === 'MULTIPLA_ESCOLHA' && (
                                    <div className="opcoes-editor-container">
                                        <label htmlFor={`opcao-input-q${qIndex}-o0`}>Opções de Resposta</label>
                                        {qp.pergunta.opcoes.map((opt, oIndex) => (
                                            /* CORREÇÃO 2: Chave única para evitar o aviso do React */
                                            <div key={`q${qIndex}-o${oIndex}`} className="opcao-editor-item">
                                                <input
                                                    id={`opcao-input-q${qIndex}-o${oIndex}`}
                                                    type="text"
                                                    value={opt.texto}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    placeholder={`Opção ${oIndex + 1}`}
                                                    className="input-edit-mode"
                                                />
                                                <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="btn-remover-opcao">
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addOption(qIndex)} className="btn-adicionar-opcao">
                                            + Adicionar Opção
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
}