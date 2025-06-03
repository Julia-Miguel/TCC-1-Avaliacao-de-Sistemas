// frontend/src/app/questionarios/[id]/page.tsx
'use client';

import { useEffect, useState, Suspense } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation"; // Removido useSearchParams se não usado diretamente aqui
import Link from "next/link";
import "../../globals.css";
// Importe seu questionario.css se ele tiver estilos específicos para esta página
// import "../../questionario.css"; 
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import { PlusIcon, Trash2 } from "lucide-react"; // Adicionando ícones para os botões

// --- Interfaces (mantidas como você definiu) ---
interface Opcao {
    id?: number; 
    texto: string;
    tempId?: string; 
}

interface PerguntaAninhada {
    id?: number; 
    enunciado: string;
    tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA';
    opcoes: Opcao[];
    tempId?: string; 
}

interface QuePerg {
    perguntaId?: number; 
    questionarioId: number; 
    pergunta: PerguntaAninhada;
    // id?: number; // ID da relação QuePerg, se o backend enviar e você precisar
}

interface QuestionarioData {
    id: number;
    titulo: string;
}
// --- FIM DAS INTERFACES ---

export default function EditQuestionarioPage() { 
    return (
        <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
            <AdminAuthGuard>
                <EditQuestionarioFormContent />
            </AdminAuthGuard>
        </Suspense>
    );
}

function EditQuestionarioFormContent() { 
    const router = useRouter();
    const params = useParams(); 
    const questionarioId = Number(params.id); 

    const [titulo, setTitulo] = useState("");
    const [quePergs, setQuePergs] = useState<QuePerg[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!questionarioId) {
            setError("ID do Questionário não encontrado na URL.");
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);

        const loadData = async () => {
            try {
                const respQuestionario = await api.get<QuestionarioData>(`/questionarios/${questionarioId}`);
                setTitulo(respQuestionario.data.titulo);

                const respQuePerg = await api.get<QuePerg[]>(`/quePerg?questionarioId=${questionarioId}`);
                const sanitizedQuePergs = respQuePerg.data.map(qp => ({
                    ...qp,
                    pergunta: {
                        ...qp.pergunta,
                        opcoes: (qp.pergunta.opcoes || []).map(opt => ({...opt})) 
                    }
                }));
                setQuePergs(sanitizedQuePergs);

            } catch (err: any) {
                console.error("Erro ao carregar dados do questionário:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError("Acesso não autorizado ou negado. Faça o login novamente.");
                } else if (err.response && err.response.status === 404) {
                    setError("Questionário não encontrado. Verifique o ID ou se ele pertence à sua empresa.");
                } else {
                    setError("Não foi possível carregar os dados para edição. Tente novamente.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [questionarioId]);

    const handlePerguntaChange = (qIndex: number, novoEnunciado: string) => {
        setQuePergs(prevQuePergs => 
            prevQuePergs.map((qp, index) => 
                index === qIndex 
                ? { ...qp, pergunta: { ...qp.pergunta, enunciado: novoEnunciado } } 
                : qp
            )
        );
    };
    
    const handleTipoChange = (qIndex: number, novoTipo: 'TEXTO' | 'MULTIPLA_ESCOLHA') => {
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) => {
                if (index === qIndex) {
                    const perguntaAtual = qp.pergunta;
                    const novasOpcoes = novoTipo === 'TEXTO' 
                        ? [] 
                        : (perguntaAtual.opcoes.length === 0 ? [{ texto: '', tempId: `temp-opt-${Date.now()}` }] : perguntaAtual.opcoes.map(o => ({...o})));
                    return { ...qp, pergunta: { ...perguntaAtual, tipos: novoTipo, opcoes: novasOpcoes } };
                }
                return qp;
            })
        );
    };
    
    const handleOptionChange = (qIndex: number, oIndex: number, novoTexto: string) => {
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) => {
                if (index === qIndex) {
                    const novasOpcoes = qp.pergunta.opcoes.map((opt, optIdx) => 
                        optIdx === oIndex ? { ...opt, texto: novoTexto } : opt
                    );
                    return { ...qp, pergunta: { ...qp.pergunta, opcoes: novasOpcoes } };
                }
                return qp;
            })
        );
    };

    const addOptionToList = (qIndex: number) => {
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) => {
                if (index === qIndex) {
                    const novasOpcoes = [...qp.pergunta.opcoes, { texto: '', tempId: `temp-opt-${Date.now()}-${qp.pergunta.opcoes.length}` }];
                    return { ...qp, pergunta: { ...qp.pergunta, opcoes: novasOpcoes } };
                }
                return qp;
            })
        );
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        setQuePergs(prevQuePergs =>
            prevQuePergs.map((qp, index) => {
                if (index === qIndex) {
                    const novasOpcoes = qp.pergunta.opcoes.filter((_, optIdx) => optIdx !== oIndex);
                    return { ...qp, pergunta: { ...qp.pergunta, opcoes: novasOpcoes } };
                }
                return qp;
            })
        );
    };

    const handleAddNewPergunta = () => {
        const novaPerguntaDefault: PerguntaAninhada = {
            tempId: `temp-perg-${Date.now()}`, 
            enunciado: "",
            tipos: "TEXTO",
            opcoes: []
        };
        const novoQuePerg: QuePerg = {
            questionarioId: questionarioId,
            pergunta: novaPerguntaDefault
        };
        setQuePergs(prevQuePergs => [...prevQuePergs, novoQuePerg]);
    };
    
    const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await api.put(`/questionarios`, {
                id: questionarioId,
                titulo: titulo
            });

            const promisesPerguntas = quePergs.map(async (qp) => {
                let perguntaData = qp.pergunta;
                let perguntaSalvaOuAtualizada: PerguntaAninhada;

                if (perguntaData.id) { 
                    const updatePayload = {
                        id: perguntaData.id,
                        enunciado: perguntaData.enunciado,
                        tipos: perguntaData.tipos,
                        opcoes: perguntaData.tipos === 'MULTIPLA_ESCOLHA' ? perguntaData.opcoes.map(opt => ({ texto: opt.texto })) : []
                    };
                    const response = await api.put(`/perguntas`, updatePayload);
                    perguntaSalvaOuAtualizada = response.data;
                } else { 
                    const createPayload = {
                        enunciado: perguntaData.enunciado,
                        tipos: perguntaData.tipos,
                        opcoes: perguntaData.tipos === 'MULTIPLA_ESCOLHA' ? perguntaData.opcoes.map(opt => opt.texto) : [] 
                    };
                    const response = await api.post(`/perguntas`, createPayload);
                    perguntaSalvaOuAtualizada = response.data;
                    
                    if (perguntaSalvaOuAtualizada.id) { // Garante que temos ID antes de associar
                        await api.post('/queperg', {
                            questionario_id: questionarioId,
                            pergunta_id: perguntaSalvaOuAtualizada.id 
                        });
                    } else {
                        throw new Error("Nova pergunta criada não retornou um ID.");
                    }
                }
                return perguntaSalvaOuAtualizada;
            });

            await Promise.all(promisesPerguntas);

            alert("Questionário e perguntas atualizados com sucesso!");
            router.push("/questionarios"); 

        } catch (err: any) {
            console.error('Erro ao salvar:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Erro ao salvar as alterações!');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading && quePergs.length === 0 && !titulo) { 
        return <div className="page-container center-content"><p>Carregando dados do questionário...</p></div>;
    }

    if (error && quePergs.length === 0 && !titulo) { 
        return (
            <div className="page-container center-content">
                <p style={{color: 'red'}}>{error}</p>
                <Link href="/questionarios" className="btn btn-secondary" style={{marginTop: '1rem'}}>
                    Voltar para Lista de Questionários
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container"> {/* Usa a classe do globals.css para padding/max-width */}
            <form onSubmit={handleSaveChanges} className="editor-form-card"> {/* Estilo do card */}
                <div className="form-header"> {/* Estilo do cabeçalho do card */}
                    <h3>Editando Questionário: {titulo || "Carregando Título..."}</h3>
                    <div className="form-header-actions">
                        <button type="button" onClick={() => router.push("/questionarios")} className="btn btn-secondary" disabled={isLoading}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </div>

                <div className="display-section">
                    <label htmlFor="titulo-input" className="form-label">Título do Questionário</label> {/* Usando form-label */}
                    <input 
                        id="titulo-input" 
                        type="text" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)} 
                        className="input-edit-mode title-input" // Sua classe ou a global para inputs
                        disabled={isLoading}
                        required
                    />
                </div>

                <div className="display-section">
                    <label className="form-label">Perguntas do Questionário</label> {/* Usando form-label */}
                    <div className="perguntas-edit-list">
                        {quePergs.map((qp, qIndex) => (
                            <div key={qp.pergunta.id || qp.pergunta.tempId} className="pergunta-editor-item">
                                <label htmlFor={`enunciado-pergunta-${qIndex}`} className="form-label sr-only">Enunciado da Pergunta {qIndex + 1}</label>
                                <textarea
                                    id={`enunciado-pergunta-${qIndex}`}
                                    value={qp.pergunta.enunciado}
                                    onChange={(e) => handlePerguntaChange(qIndex, e.target.value)}
                                    className="input-edit-mode question-textarea" // Sua classe ou a global para textareas
                                    rows={2}
                                    placeholder={`Enunciado da Pergunta ${qIndex + 1}`}
                                    disabled={isLoading}
                                    required
                                />
                                <div className="pergunta-meta-editor">
                                    <label htmlFor={`tipo-pergunta-${qIndex}`} className="form-label">Tipo</label>
                                    <select 
                                        id={`tipo-pergunta-${qIndex}`}
                                        value={qp.pergunta.tipos} 
                                        onChange={(e) => handleTipoChange(qIndex, e.target.value as 'TEXTO' | 'MULTIPLA_ESCOLHA')} 
                                        className="select-tipo-pergunta" // Sua classe ou a global para selects
                                        disabled={isLoading}
                                    >
                                        <option value="TEXTO">Texto</option>
                                        <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
                                    </select>
                                </div>

                                {qp.pergunta.tipos === 'MULTIPLA_ESCOLHA' && (
                                    <div className="opcoes-editor-container">
                                        <label className="form-label">Opções de Resposta</label>
                                        {qp.pergunta.opcoes.map((opt, oIndex) => (
                                            <div key={opt.id || opt.tempId || `q${qIndex}-o${oIndex}`} className="opcao-editor-item">
                                                <label htmlFor={`opcao-q${qIndex}-o${oIndex}`} className="sr-only">Opção {oIndex + 1}</label>
                                                <input
                                                    id={`opcao-q${qIndex}-o${oIndex}`}
                                                    type="text"
                                                    value={opt.texto}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    placeholder={`Texto da Opção ${oIndex + 1}`}
                                                    className="input-edit-mode" // Sua classe ou a global para inputs
                                                    disabled={isLoading}
                                                    required={qp.pergunta.tipos === 'MULTIPLA_ESCOLHA'} // Obrigatório se for múltipla escolha
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeOption(qIndex, oIndex)} 
                                                    className="btn-remover-opcao" // Estilo para este botão específico
                                                    title="Remover Opção"
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            onClick={() => addOptionToList(qIndex)} 
                                            className="btn btn-outline btn-sm mt-2 flex items-center self-start" // Usando classes de botão genéricas
                                            disabled={isLoading}
                                        >
                                            <PlusIcon size={16} className="mr-1" /> Adicionar Opção
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={handleAddNewPergunta} 
                            className="btn btn-primary mt-4 flex items-center" // Botão primário para ação principal
                            style={{padding: '0.75rem 1.5rem', fontSize:'1rem'}} // Estilo inline mantido, pode virar classe
                            disabled={isLoading}
                        >
                            <PlusIcon size={20} className="mr-2" /> Adicionar Nova Pergunta
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}