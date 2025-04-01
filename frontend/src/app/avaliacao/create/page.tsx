// src/app/avaliacao/create/page.tsx
'use client';

import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import "../../globals.css";

interface Questionario {
  id: number;
  titulo: string;
}

export default function CreateAvaliacao() {
  const [semestre, setSemestre] = useState("");
  const [questionarioId, setQuestionarioId] = useState("");
  const [questionarios, setQuestionarios] = useState<Questionario[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const resQuestionarios = await api.get("/questionarios");
        setQuestionarios(resQuestionarios.data);
      } catch (error) {
        console.error("Erro ao buscar questionários:", error);
        alert("Erro ao buscar questionários: " + (error));
      }
    }
    fetchData();
  }, []);

  const handleNewAvaliacao = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!semestre || !questionarioId) {
      alert("Preencha todos os campos!");
      return;
    }

    const data = {
      semestre,
      questionario_id: parseInt(questionarioId),
    };

    try {
      await api.post("/avaliacao", data);
      alert("Avaliação cadastrada com sucesso!");
      router.push("/avaliacao");
    } catch (error) {
      console.error("Erro ao cadastrar avaliação:", error);
      alert(`Erro ao cadastrar a avaliação: ${error}`);
    }
  };

  const handleReset = () => {
    setSemestre("");
    setQuestionarioId("");
  };

  return (
    <div className="Create">
      <h3>Criar Nova Avaliação</h3>
      <form onSubmit={handleNewAvaliacao}>
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
        <button type="submit">Cadastrar</button>
        <button type="button" onClick={handleReset}>
          Limpar
        </button>
      </form>
    </div>
  );
}