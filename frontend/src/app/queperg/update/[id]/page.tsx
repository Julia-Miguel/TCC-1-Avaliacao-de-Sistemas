'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import "../../../globals.css";
import { errorMonitor } from "node:stream";

interface QuePerg {
  id: number;
  perguntaId: number;
  questionarioId: number;
  pergunta: {
    enunciado: string;
    tipos: string;
  };
  questionario: {
    titulo: string;
  };
}

interface Questionario {
  id: number;
  titulo: string;
}

interface Pergunta {
  id: number;
  enunciado: string;
  tipos: string;
}

export default function UpdateQuePerg() {
  const [questionarioId, setQuestionarioId] = useState("");
  const [perguntaId, setPerguntaId] = useState("");
  const [questionarios, setQuestionarios] = useState<Questionario[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar questionários e perguntas para os dropdowns
        const resQuestionarios = await api.get("/questionarios");
        const resPerguntas = await api.get("/perguntas");
        setQuestionarios(resQuestionarios.data);
        setPerguntas(resPerguntas.data);

        // Carregar os dados do quePerg para preencher os campos
        const response = await api.get<QuePerg>(`/queperg/${id}`);
        const quePerg = response.data;
        setPerguntaId(quePerg.perguntaId.toString());
        setQuestionarioId(quePerg.questionarioId.toString());
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar os dados: " + (error));
        router.push("/queperg");
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleUpdateQuePerg = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!questionarioId || !perguntaId) {
      alert("Selecione um questionário e uma pergunta.");
      return;
    }

    const data = {
      id: parseInt(id as string), // Inclui o id no corpo da requisição
      pergunta_id: parseInt(perguntaId),
      questionario_id: parseInt(questionarioId),
    };

    try {
      await api.put(`/queperg`, data); // Alterado para /queperg, sem o id na URL
      alert("Relação atualizada com sucesso!");
      router.push("/queperg");
    } catch (error) {
      console.error("Erro na atualização:", error);
      alert(`Erro ao atualizar a relação: ${error}`);
    }
  };

  return (
    <div className="Create">
      <h3>Atualização de Relação Pergunta-Questionário</h3>
      <form onSubmit={handleUpdateQuePerg}>
        <table>
          <tbody>
            <tr><td><label htmlFor="questionario">Questionário</label></td><td>
              <select
                id="questionario"
                value={questionarioId}
                onChange={(e) => setQuestionarioId(e.target.value)}
                required
              >
                <option value="">Selecione um questionário</option>
                {questionarios.map((q) => (
                  <option key={q.id} value={q.id}>{q.titulo}</option>
                ))}
              </select>
            </td></tr>
            <tr><td><label htmlFor="pergunta">Pergunta</label></td><td>
              <select
                id="pergunta"
                value={perguntaId}
                onChange={(e) => setPerguntaId(e.target.value)}
                required
              >
                <option value="">Selecione uma pergunta</option>
                {perguntas.map((p) => (
                  <option key={p.id} value={p.id}>{p.enunciado}</option>
                ))}
              </select>
            </td></tr>
          </tbody>
        </table>
        <button type="submit">Salvar Alterações</button>
        <button type="button" onClick={() => router.push("/queperg")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}