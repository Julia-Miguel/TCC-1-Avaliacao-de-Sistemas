// frontend/src/app/avaliacao/page.tsx
'use client';

import { useEffect, useState, Suspense } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css"; // Seu globals.css unificado
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";
import { PlusIcon, Edit3, Trash2, ExternalLink, ListChecks, Share2, X, Copy, CheckCircle2, QrCode } from 'lucide-react'; // Ícones adicionados
import QRCode from "react-qr-code"; // Importa o componente QR Code

// --- Interfaces (mantidas como antes) ---
interface UsuarioSimplificado {
  id: number;
  nome?: string | null;
}
interface QuestionarioSimplificado {
  id: number;
  titulo: string;
}
interface UsuAvalSimplificado {
  id: number;
  status: string;
  isFinalizado: boolean;
  usuario?: UsuarioSimplificado | null;
  anonymousSessionId?: string | null;
}
interface AvaliacaoInterface {
  id: number;
  semestre: string;
  requerLoginCliente: boolean;
  questionario: QuestionarioSimplificado;
  criador: UsuarioSimplificado;
  usuarios: UsuAvalSimplificado[];
  _count?: {
    usuarios: number;
  };
  created_at: string;
  updated_at: string;
}
// --- Fim das Interfaces ---

function ListAvaliacaoContent() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NOVO: Estados para o Modal de Compartilhamento ---
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedAvaliacaoForShare, setSelectedAvaliacaoForShare] = useState<AvaliacaoInterface | null>(null);
  const [shareableLink, setShareableLink] = useState("");
  const [copied, setCopied] = useState(false);
  // --- FIM: Estados para o Modal de Compartilhamento ---

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    api.get("/avaliacao")
      .then(response => {
        setAvaliacoes(response.data);
      })
      .catch(err => { /* ... (tratamento de erro existente) ... */ 
        console.error("Erro ao buscar as avaliações:", err.response?.data ?? err.message);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Acesso não autorizado. Faça login como administrador.");
        } else {
          setError("Erro ao buscar as avaliações.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatDate = (isoDate: string | null | undefined) => { /* ... (sem mudança) ... */ 
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleDeleteAvaliacao = async (id: number) => { /* ... (sem mudança) ... */ 
    if (!window.confirm("Deseja realmente excluir esta avaliação e todas as respostas associadas?")) return;
    try {
      await api.delete('/avaliacao', { data: { id } });
      alert("Avaliação excluída com sucesso!");
      setAvaliacoes(prev => prev.filter(avaliacao => avaliacao.id !== id));
    } catch (err) {
      console.error("Erro ao excluir a avaliação:", err);
      alert("Erro ao excluir a avaliação.");
    }
  };

  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return ""; // Ou um fallback se necessário, mas para links de compartilhamento window.location.origin é ideal
  };

  // --- NOVO: Funções para Compartilhamento ---
  const handleOpenShareModal = (avaliacao: AvaliacaoInterface) => {
    const link = `${getBaseUrl()}/responder/${avaliacao.id}`;
    setShareableLink(link);
    setSelectedAvaliacaoForShare(avaliacao);
    setShowShareModal(true);
    setCopied(false); // Reseta o estado de "copiado"
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Mensagem de "copiado" some após 2s
    }).catch(err => {
      console.error("Falha ao copiar link: ", err);
      alert("Não foi possível copiar o link. Tente manualmente.");
    });
  };
  // --- FIM: Funções para Compartilhamento ---


  if (isLoading) { /* ... (sem mudança) ... */ 
    return <div className="page-container flex items-center justify-center min-h-[calc(100vh-8rem)]"><p className="text-text-muted">Carregando avaliações...</p></div>;
  }
  if (error) { /* ... (sem mudança) ... */ 
    return <div className="page-container center-content"><p className="text-red-600 dark:text-red-400">{error}</p></div>;
  }

  return (
    <div className="page-container">
      <div className="table-header-actions">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
          Gerenciamento de Avaliações
        </h3>
        <div className="button-group">
            <Link href="/avaliacao/create" className="btn btn-primary inline-flex items-center">
              <PlusIcon size={18} className="mr-2" />
              Nova Avaliação
            </Link>
             <Link href="/" className="btn btn-outline">
                Voltar
            </Link>
        </div>
      </div>

      {avaliacoes.length === 0 ? (
        /* ... (Mensagem de "Nenhuma avaliação criada" - sem mudança) ... */
        <div className="text-center py-10 px-4 bg-card-background dark:bg-gray-800 rounded-lg shadow-md border border-border mt-6">
          <ListChecks className="mx-auto h-12 w-12 text-text-muted" strokeWidth={1.5} />
          <h3 className="mt-4 text-md font-medium text-foreground">Nenhuma avaliação criada</h3>
          <p className="mt-1 text-sm text-text-muted">Crie uma nova avaliação para começar a coletar respostas.</p>
          <div className="mt-6">
            <Link href="/avaliacao/create" className="btn btn-primary inline-flex items-center">
              <PlusIcon size={18} className="mr-2" />
              Criar Avaliação
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-card-background dark:bg-gray-800 shadow-md rounded-lg border border-border">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Semestre/Contexto</th>
                <th>Questionário</th>
                <th>Login Cliente</th>
                <th>Nº Respostas</th>
                <th>Criado em</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {avaliacoes.map(av => (
                <tr key={av.id}>
                  <td data-label="ID">{av.id}</td>
                  <td data-label="Semestre/Contexto">{av.semestre}</td>
                  <td data-label="Questionário" className="max-w-xs truncate" title={av.questionario?.titulo || "N/A"}>
                    {av.questionario?.titulo || "N/A"}
                  </td>
                  <td data-label="Login Cliente?">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        av.requerLoginCliente 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                        {av.requerLoginCliente ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td data-label="Nº Respostas">{av._count?.usuarios ?? 0}</td>
                  <td data-label="Criado em">{formatDate(av.created_at)}</td>
                  <td data-label="Ações" className="text-right whitespace-nowrap space-x-1">
                    {/* NOVO: Botão de Compartilhar */}
                    <button
                        onClick={() => handleOpenShareModal(av)}
                        className="btn btn-sm btn-outline p-1.5 inline-flex items-center" // p-1.5 para botão de ícone
                        title="Compartilhar Avaliação"
                    >
                        <Share2 size={14} />
                    </button>
                    <Link
                        href={`/responder/${av.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline p-1.5 inline-flex items-center"
                        title="Ver/Responder (Link Público)"
                      >
                        <ExternalLink size={14} />
                    </Link>
                    <Link
                      href={`/avaliacao/update/${av.id}`}
                      className="btn btn-sm btn-outline p-1.5 inline-flex items-center"
                      title="Editar Avaliação"
                    >
                      <Edit3 size={14} />
                    </Link>
                    <button
                      onClick={() => handleDeleteAvaliacao(av.id)}
                      className="btn btn-sm btn-danger p-1.5 inline-flex items-center"
                      title="Excluir Avaliação"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- NOVO: Modal de Compartilhamento --- */}
      {/* --- NOVO: Modal de Compartilhamento --- */}
      {showShareModal && selectedAvaliacaoForShare && (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[999] backdrop-blur-sm" // Aumentei um pouco a opacidade do bg-black para 70%
            onClick={() => setShowShareModal(false)}
        >
            <div 
                className="bg-card-background dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md relative" // Removido transform transition-all para teste, aumentado shadow e padding
                onClick={(e) => e.stopPropagation()} 
            >
                <button 
                    onClick={() => setShowShareModal(false)}
                    className="absolute top-3 right-3 text-text-muted hover:text-foreground p-1.5 rounded-full hover:bg-page-bg dark:hover:bg-gray-700 transition-colors"
                    aria-label="Fechar modal"
                >
                    <X size={22} />
                </button>

                <h4 className="text-xl font-semibold text-foreground mb-2 text-center sm:text-left"> {/* Aumentado tamanho da fonte e centralizado em mobile */}
                    Compartilhar Avaliação
                </h4>
                <p className="text-sm text-text-muted mb-6 text-center sm:text-left">
                    {selectedAvaliacaoForShare.semestre} <br className="sm:hidden" /> {/* Quebra de linha no mobile */}
                    <span className="hidden sm:inline">- </span>
                    Questionário: {selectedAvaliacaoForShare.questionario.titulo}
                </p>

                <div className="mb-6">
                    <label htmlFor="share-link" className="form-label text-xs uppercase tracking-wider text-text-muted">Link Público:</label>
                    <div className="flex items-center space-x-2 mt-1">
                        <input
                            id="share-link"
                            type="text"
                            value={shareableLink}
                            readOnly
                            className="input-edit-mode text-sm flex-grow bg-input-background dark:bg-gray-700" // Garante fundo no input
                            onFocus={(e) => e.target.select()}
                        />
                        <button
                            onClick={handleCopyLink}
                            className="btn btn-primary btn-sm p-2.5" // Padding um pouco maior
                            title="Copiar Link"
                        >
                            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                    {copied && <p className="text-xs text-green-600 dark:text-green-400 mt-1.5">Link copiado!</p>}
                </div>
                
                <div className="text-center">
                    <label className="form-label text-xs uppercase tracking-wider text-text-muted mb-2 block">Ou escaneie o QR Code:</label>
                    <div className="bg-white p-3 inline-block rounded-md shadow border border-border">
                        {shareableLink && <QRCode value={shareableLink} size={192} level="M" bgColor="#FFFFFF" fgColor="#000000" />} {/* Cores explícitas para o QR Code */}
                    </div>
                </div>

                <div className="mt-8 text-right"> {/* Aumentado margin-top */}
                    <button onClick={() => setShowShareModal(false)} className="btn btn-outline">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

export default function ProtectedListAvaliacaoPage() {
  return (
    <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
      <AdminAuthGuard>
        <ListAvaliacaoContent />
      </AdminAuthGuard>
    </Suspense>
  );
}