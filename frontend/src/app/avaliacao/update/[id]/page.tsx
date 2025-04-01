// src/app/avaliacao/update/[id]/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import "../../../globals.css";

interface Avaliacao {
  id: number;
  semestre: string;
  questionarioId: number;
  questionario: {
    titulo: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface Questionario {
  id: number;
  titulo: string;
}

export default function UpdateAvaliacao() {
  const [semestre, setSemestre] = useState("");
  const [questionarioId, setQuestionarioId] = useState("");
  const [questionarios, setQuestionarios] = useState<Questionario[]>([]);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar a lista de questionários para o dropdown
        const resQuestionarios = await api.get("/questionarios");
        setQuestionarios(resQuestionarios.data);

        // Carregar os dados da avaliação
        const response = await api.get<Avaliacao>(`/avaliacao/${id}`);
        const avaliacao = response.data;
        setSemestre(avaliacao.semestre || "");
        setQuestionarioId(avaliacao.questionarioId.toString() || "");
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar a avaliação: " + (error));
        router.push("/avaliacao");
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleUpdateAvaliacao = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!semestre || !questionarioId) {
      alert("Preencha todos os campos!");
      return;
    }

    const data = {
      id: parseInt(id as string),
      semestre,
      questionario_id: parseInt(questionarioId),
    };

    try {
      await api.put("/avaliacao", data);
      alert("Avaliação atualizada com sucesso!");
      router.push("/avaliacao");
    } catch (error) {
      console.error("Erro ao atualizar a avaliação:", error);
      alert(`Erro ao atualizar a avaliação: ${error}`);
    }
  };

  const handleReset = () => {
    setSemestre("");
    setQuestionarioId("");
  };

  return (
    <div className="Create">
      <h3>Atualização de Avaliação</h3>
      <form onSubmit={handleUpdateAvaliacao}>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="semestre">Semestre</label></td>
              <td>
                <input
                  type="text"
                  id="semestre"
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="questionario">Questionário</label></td>
              <td>
                <select
                  id="questionario"
                  value={questionarioId}
                  onChange={(e) => setQuestionarioId(e.target.value)}
                  required
                >
                  <option value="">Selecione um questionário</option>
                  {questionarios.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.titulo}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Atualizar</button>
        <button type="button" onClick={handleReset}>
          Limpar
        </button>
      </form>
    </div>
  );
}