// frontend/src/app/avaliacao/create/page.tsx
'use client';

import { useState, useEffect, Suspense } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../globals.css";
import "../../responsividade.css";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

interface Questionario {
  id: number;
  titulo: string;
}

function CreateAvaliacaoContent() {
  const [semestre, setSemestre] = useState("");
  const [questionarioId, setQuestionarioId] = useState("");
  const [questionarios, setQuestionarios] = useState<Questionario[]>([]);
  const [requerLoginCliente, setRequerLoginCliente] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    // A rota /questionarios deve retornar apenas os questionários da empresa do admin logado
    api.get("/questionarios") 
      .then(response => {
        setQuestionarios(response.data);
      })
      .catch(err => {
        console.error("Erro ao buscar questionários:", err);
        setError("Erro ao buscar questionários para seleção.");
      }).finally(() => setIsLoading(false));
  }, []);

  const handleNewAvaliacao = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!semestre.trim() || !questionarioId) {
      setError("Semestre/Contexto e Questionário são obrigatórios!");
      return;
    }
    setIsLoading(true);

    // O criadorId será adicionado pelo backend usando o token do usuário logado
    const data = {
      semestre: semestre.trim(),
      questionarioId: parseInt(questionarioId),
      requerLoginCliente,
    };

    try {
      await api.post("/avaliacao", data); // O token já é enviado pelo interceptor
      alert("Avaliação cadastrada com sucesso!");
      router.push("/avaliacao");
    } catch (err: any) {
      console.error("Erro ao cadastrar avaliação:", err.response?.data ?? err.message);
      setError(err.response?.data?.message ?? "Erro ao cadastrar a avaliação!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="editor-form-card" style={{maxWidth: '700px'}}>
        <div className="form-header">
          <h3>Criar Nova Avaliação</h3>
          <Link href="/avaliacao" className="btn btn-outline btn-sm">Voltar</Link>
        </div>
        
        <form onSubmit={handleNewAvaliacao} className="display-section">
          {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
          
          <div className="form-group">
            <label htmlFor="semestre" className="form-label">Semestre / Contexto da Avaliação</label>
            <input
              type="text"
              id="semestre"
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              required
              className="input-edit-mode"
              placeholder="Ex: 2025/1 - Turma A"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="questionario" className="form-label">Questionário Vinculado</label>
            <select
              id="questionario"
              value={questionarioId}
              onChange={(e) => setQuestionarioId(e.target.value)}
              required
              className="input-edit-mode" // Reutiliza estilo de select do globals.css
              disabled={isLoading || questionarios.length === 0}
            >
              <option value="">Selecione um questionário...</option>
              {questionarios.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.titulo} (ID: {q.id})
                </option>
              ))}
            </select>
            {questionarios.length === 0 && !isLoading && <p className="text-sm text-text-muted mt-1">Nenhum questionário disponível. Crie um primeiro.</p>}
          </div>
          
          <div className="form-group checkbox-label-group"> {/* Estilo para checkbox */}
            <input
              type="checkbox"
              id="requerLoginCliente"
              checked={requerLoginCliente}
              onChange={e => setRequerLoginCliente(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="requerLoginCliente" className="form-label" style={{marginBottom: 0}}>
              Exigir login do cliente para responder?
            </label>
          </div>

          <div className="form-actions"> {/* Estilo para alinhar botões */}
            <button type="reset" onClick={() => {setSemestre(''); setQuestionarioId(''); setRequerLoginCliente(false); setError(null);}} className="btn btn-secondary" disabled={isLoading}>
              Limpar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar Avaliação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateAvaliacaoPage() {
  return (
    <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
      <AdminAuthGuard>
        <CreateAvaliacaoContent />
      </AdminAuthGuard>
    </Suspense>
  );
}