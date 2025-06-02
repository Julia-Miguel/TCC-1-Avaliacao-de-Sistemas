// frontend/src/app/questionarios/[id]/page.tsx
'use client';

import { useEffect, useState, Suspense } from "react"; // Adicionado Suspense
import api from "@/services/api";
import { useRouter, useParams, useSearchParams } from "next/navigation"; // Adicionado useSearchParams
import Link from "next/link";
import "../../globals.css";
import AdminAuthGuard from '@/components/auth/AdminAuthGuard'; // Importe o guardião

// --- Interfaces Atualizadas ---
interface Opcao {
    id?: number; 
    texto: string;
    tempId?: string; // Para keys no React de novas opções
}

interface PerguntaAninhada {
    id?: number; // Opcional para novas perguntas
    enunciado: string;
    tipos: 'TEXTO' | 'MULTIPLA_ESCOLHA';
    opcoes: Opcao[];
    tempId?: string; // Para keys no React de novas perguntas
}

interface QuePerg {
    // Se a relação QuePerg em si tiver um ID do banco e você precisar dele:
    // id?: number; 
    perguntaId?: number; // ID da pergunta original (se já existir no banco)
    questionarioId: number; // ID do questionário atual
    pergunta: PerguntaAninhada;
}

interface QuestionarioData { // Para o título do questionário
    id: number;
    titulo: string;
}
// --- FIM DAS INTERFACES ---


// Componente principal da página, protegido pelo guardião
export default function EditQuestionarioPage() {
    return (
        // Suspense é necessário porque EditQuestionarioFormContent usa useSearchParams
        <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
            <AdminAuthGuard>
                <EditQuestionarioFormContent />
            </AdminAuthGuard>
        </Suspense>
    );
}

// Componente interno que contém a lógica do formulário
function EditQuestionarioFormContent() {
    const router = useRouter();
    const params = useParams(); // Usamos params para pegar o ID da rota
    const questionarioId = Number(params.id); // params.id virá da URL /questionarios/[id]

    const [titulo, setTitulo] = useState("");
    const [quePergs, setQuePergs] = useState<QuePerg[]>([]); // Armazena as associações QuePerg
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
                // Busca o título do questionário
                const respQuestionario = await api.get<QuestionarioData>(`/questionarios/${questionarioId}`);
                setTitulo(respQuestionario.data.titulo);

                // Busca as perguntas e opções já associadas a este questionário
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
                    // O AdminAuthGuard deve, em teoria, prevenir isso, mas é uma segurança extra.
                    // Se o token expirar DURANTE a sessão, o usuário verá esta mensagem.
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
    }, [questionarioId]); // Dependência é o questionarioId da rota

    // --- Funções para Gerenciar o Formulário Dinâmico ---
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

    const addOptionToList = (qIndex: number) => { // Renomeado de 'addOption'
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
            // perguntaId será undefined aqui, pois é uma nova pergunta
        };
        setQuePergs(prevQuePergs => [...prevQuePergs, novoQuePerg]);
    };
    
    const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            // 1. Salvar o título do questionário
            await api.put(`/questionarios`, {
                id: questionarioId,
                titulo: titulo
            });

            // 2. Processar cada pergunta (QuePerg)
            // Usaremos Promise.all para executar todas as atualizações/criações de perguntas em paralelo
            const promisesPerguntas = quePergs.map(async (qp) => {
                let perguntaData = qp.pergunta;
                let perguntaSalvaOuAtualizada: PerguntaAninhada;

                if (perguntaData.id) { // Pergunta existente, ATUALIZAR
                    const updatePayload = {
                        id: perguntaData.id,
                        enunciado: perguntaData.enunciado,
                        tipos: perguntaData.tipos,
                        // Para o backend, enviamos apenas o texto das opções. O backend recriará as opções.
                        opcoes: perguntaData.tipos === 'MULTIPLA_ESCOLHA' ? perguntaData.opcoes.map(opt => ({ texto: opt.texto })) : []
                    };
                    const response = await api.put(`/perguntas`, updatePayload);
                    perguntaSalvaOuAtualizada = response.data;
                } else { // Nova pergunta, CRIAR
                    const createPayload = {
                        enunciado: perguntaData.enunciado,
                        tipos: perguntaData.tipos,
                        opcoes: perguntaData.tipos === 'MULTIPLA_ESCOLHA' ? perguntaData.opcoes.map(opt => opt.texto) : [] 
                    };
                    const response = await api.post(`/perguntas`, createPayload);
                    perguntaSalvaOuAtualizada = response.data;

                    // Associar a nova pergunta criada ao questionário atual
                    // Garanta que o CreateQuePergController no backend verifica a propriedade da empresa
                    await api.post('/queperg', {
                        questionario_id: questionarioId,
                        pergunta_id: perguntaSalvaOuAtualizada.id 
                    });
                }
                return perguntaSalvaOuAtualizada; // Retorna a pergunta processada
            });

            await Promise.all(promisesPerguntas);

            alert("Questionário e perguntas atualizados com sucesso!");
            // Recarregar dados para refletir IDs de novas perguntas/opções
            // ou fazer um refetch na página de listagem após o push.
            // Por simplicidade, vamos apenas redirecionar.
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
                <Link href="/questionarios" className="btn-secondary" style={{marginTop: '1rem'}}>
                    Voltar para Lista de Questionários
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <form onSubmit={handleSaveChanges} className="editor-form-card">
                <div className="form-header">
                    <h3>Editando Questionário: {titulo || "Sem Título"}</h3>
                    <div className="form-header-actions">
                        <button type="button" onClick={() => router.push("/questionarios")} className="btn-secondary" disabled={isLoading}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </div>

                <div className="display-section">
                    <label htmlFor="titulo-input">Título do Questionário</label>
                    <input 
                        id="titulo-input" 
                        type="text" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)} 
                        className="input-edit-mode title-input"
                        disabled={isLoading}
                        required
                    />
                </div>

                <div className="display-section">
                    <label>Perguntas do Questionário</label>
                    <div className="perguntas-edit-list">
                        {quePergs.map((qp, qIndex) => (
                            <div key={qp.pergunta.id || qp.pergunta.tempId} className="pergunta-editor-item">
                                <textarea
                                    value={qp.pergunta.enunciado}
                                    onChange={(e) => handlePerguntaChange(qIndex, e.target.value)}
                                    className="input-edit-mode question-textarea"
                                    rows={2}
                                    placeholder="Digite o enunciado da pergunta"
                                    disabled={isLoading}
                                    required
                                />
                                <div className="pergunta-meta-editor">
                                    <label htmlFor={`tipo-pergunta-${qp.pergunta.id || qp.pergunta.tempId}`}>Tipo</label>
                                    <select 
                                        id={`tipo-pergunta-${qp.pergunta.id || qp.pergunta.tempId}`}
                                        value={qp.pergunta.tipos} 
                                        onChange={(e) => handleTipoChange(qIndex, e.target.value as 'TEXTO' | 'MULTIPLA_ESCOLHA')} 
                                        className="select-tipo-pergunta"
                                        disabled={isLoading}
                                    >
                                        <option value="TEXTO">Texto</option>
                                        <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
                                    </select>
                                </div>

                                {qp.pergunta.tipos === 'MULTIPLA_ESCOLHA' && (
                                    <div className="opcoes-editor-container">
                                        <label>Opções de Resposta</label>
                                        {qp.pergunta.opcoes.map((opt, oIndex) => (
                                            <div key={opt.id || opt.tempId || `q${qIndex}-o${oIndex}`} className="opcao-editor-item">
                                                <input
                                                    type="text"
                                                    value={opt.texto}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    placeholder={`Opção ${oIndex + 1}`}
                                                    className="input-edit-mode"
                                                    disabled={isLoading}
                                                    required
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeOption(qIndex, oIndex)} 
                                                    className="btn-remover-opcao"
                                                    title="Remover Opção"
                                                    disabled={isLoading}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            onClick={() => addOptionToList(qIndex)} 
                                            className="btn-adicionar-opcao"
                                            disabled={isLoading}
                                        >
                                            + Adicionar Opção
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={handleAddNewPergunta} 
                            className="btn-adicionar-opcao"
                            style={{marginTop: '1rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.75rem', fontSize:'1rem'}}
                            disabled={isLoading}
                        >
                            + Adicionar Nova Pergunta ao Questionário
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}