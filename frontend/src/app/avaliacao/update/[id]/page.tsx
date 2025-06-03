// frontend/src/app/avaliacao/update/[id]/page.tsx
'use client';

import { useEffect, useState, Suspense } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "../../../globals.css"; // Seu globals.css unificado
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

interface AvaliacaoData { // Renomeado para evitar conflito com nome do componente
  id: number;
  semestre: string;
  questionarioId: number;
  requerLoginCliente: boolean;
  questionario?: { // Pode ou não vir do GET /avaliacao/:id
    titulo: string;
  };
}

interface Questionario {
  id: number;
  titulo: string;
}

function UpdateAvaliacaoContent() {
  const [semestre, setSemestre] = useState("");
  const [questionarioId, setQuestionarioId] = useState("");
  const [questionarios, setQuestionarios] = useState<Questionario[]>([]);
  const [requerLoginCliente, setRequerLoginCliente] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Para carregamento de dados e submit
  const [error, setError] = useState<string|null>(null);
  const router = useRouter();
  const params = useParams();
  const avaliacaoId = params.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (!avaliacaoId) {
        setError("ID da Avaliação não fornecido na URL.");
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        // Carregar a lista de questionários para o dropdown
        // Backend deve filtrar pela empresa do admin
        const resQuestionarios = await api.get<Questionario[]>("/questionarios");
        setQuestionarios(resQuestionarios.data);

        // Carregar os dados da avaliação a ser editada
        // Backend deve verificar se esta avaliação pertence à empresa do admin
        const response = await api.get<AvaliacaoData>(`/avaliacao/${avaliacaoId}`);
        const avaliacao = response.data;
        setSemestre(avaliacao.semestre || "");
        setQuestionarioId(avaliacao.questionarioId?.toString() || "");
        setRequerLoginCliente(avaliacao.requerLoginCliente || false);

      } catch (err: any) {
        console.error("Erro ao carregar dados da avaliação:", err.response?.data ?? err.message);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Acesso não autorizado ou negado.");
        } else if (err.response && err.response.status === 404) {
          setError("Avaliação não encontrada.");
        } else {
          setError("Erro ao carregar a avaliação para edição.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [avaliacaoId]);

  const handleUpdateAvaliacao = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!semestre.trim() || !questionarioId) {
      setError("Semestre e Questionário são obrigatórios!");
      return;
    }
    if (avaliacaoId === null) {
        setError("ID da avaliação é inválido para atualização.");
        return;
    }
    setIsLoading(true);

    const data = {
      id: avaliacaoId,
      semestre: semestre.trim(),
      questionario_id: parseInt(questionarioId),
      requerLoginCliente,
    };

    try {
      await api.put("/avaliacao", data); // Backend verifica permissão e atualiza
      alert("Avaliação atualizada com sucesso!");
      router.push("/avaliacao");
    } catch (err: any) {
      console.error("Erro ao atualizar a avaliação:", err.response?.data ?? err.message);
      setError(err.response?.data?.message ?? "Erro ao atualizar a avaliação!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !semestre && !error) { // Condição de loading inicial
      return <div className="page-container center-content"><p>Carregando dados da avaliação...</p></div>;
  }

  if (error && !semestre) { // Se deu erro ao carregar e não tem dados
       return (
            <div className="page-container center-content">
                <p style={{color: 'red'}}>{error}</p>
                <Link href="/avaliacao" className="btn btn-secondary" style={{marginTop: '1rem'}}>
                    Voltar para Lista de Avaliações
                </Link>
            </div>
        );
  }


  return (
    <div className="page-container">
      <div className="editor-form-card" style={{maxWidth: '700px'}}>
        <div className="form-header">
          <h3>Atualização de Avaliação (ID: {avaliacaoId})</h3>
           <Link href="/avaliacao" className="btn btn-outline btn-sm">Voltar</Link>
        </div>
        <form onSubmit={handleUpdateAvaliacao} className="display-section">
          {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
          <table> {/* Reutilizando sua estrutura de tabela para o form */}
            <tbody>
              <tr>
                <th scope="row"><label htmlFor="semestre" className="form-label">Semestre / Contexto</label></th>
                <td>
                  <input
                    type="text"
                    id="semestre"
                    value={semestre}
                    onChange={(e) => setSemestre(e.target.value)}
                    required
                    className="input-edit-mode"
                    disabled={isLoading}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row"><label htmlFor="questionario" className="form-label">Questionário</label></th>
                <td>
                  <select
                    id="questionario"
                    value={questionarioId}
                    onChange={(e) => setQuestionarioId(e.target.value)}
                    required
                    className="input-edit-mode"
                    disabled={isLoading || questionarios.length === 0}
                  >
                    <option value="">Selecione um questionário</option>
                    {questionarios.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.titulo} (ID: {q.id})
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <th scope="row"><label htmlFor="requerLoginCliente" className="form-label">Requer Login do Cliente?</label></th>
                <td>
                  <div className="checkbox-label-group">
                    <input
                      type="checkbox"
                      id="requerLoginCliente"
                      checked={requerLoginCliente}
                      onChange={e => setRequerLoginCliente(e.target.checked)}
                      disabled={isLoading}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="form-actions">
             <button type="button" onClick={() => router.push('/avaliacao')} className="btn btn-secondary" disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function UpdateAvaliacaoPage() {
  return (
    <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
      <AdminAuthGuard>
        <UpdateAvaliacaoContent />
      </AdminAuthGuard>
    </Suspense>
  );
}