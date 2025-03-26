'use client';

import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import "../../globals.css"; // Ajuste o caminho conforme necessário

export default function CreateQueperg() {
  const [questionarioId, setQuestionarioId] = useState("");
  const [perguntaId, setPerguntaId] = useState("");
  const [questionarios, setQuestionarios] = useState([]);
  const [perguntas, setPerguntas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const resQuestionarios = await api.get("/questionarios");
        const resPerguntas = await api.get("/perguntas");
        setQuestionarios(resQuestionarios.data);
        setPerguntas(resPerguntas.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);

  const handleNewQueperg = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!questionarioId || !perguntaId) {
      alert("Selecione um questionário e uma pergunta.");
      return;
    }

    const data = { pergunta_id: parseInt(perguntaId), questionario_id: parseInt(questionarioId) };

    try {
      await api.post("/queperg", data);
      alert("Associação cadastrada com sucesso!");
      router.push("/queperg");
    } catch (error) {
      console.error("Erro ao cadastrar associação:", error);
      alert("Erro ao cadastrar a associação!");
    }
  };

  return (
    <div className="Create">
      <h3>Associar Pergunta a Questionário e Pergunta</h3>
      <form onSubmit={handleNewQueperg}>
        <table>
          <tbody>
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
                  {questionarios.map((q: any) => (
                    <option key={q.id} value={q.id}>
                      {q.pergunta}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="pergunta">Pergunta</label></td>
              <td>
                <select
                  id="pergunta"
                  value={perguntaId}
                  onChange={(e) => setPerguntaId(e.target.value)}
                  required
                >
                  <option value="">Selecione uma pergunta</option>
                  {perguntas.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.questionario}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Cadastrar</button>
        <button type="reset" onClick={() => { setQuestionarioId(""); setPerguntaId(""); }}>
          Limpar
        </button>
      </form>
    </div>
  );
}
