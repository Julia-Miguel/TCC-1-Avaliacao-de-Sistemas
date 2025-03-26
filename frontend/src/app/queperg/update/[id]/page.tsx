'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import "../../../globals.css";

interface QuePerg {
  id: number;
  pergunta_id: number;
  questionario_id: number;
}

export default function UpdateQuePerg() {
  const [perguntaId, setPerguntaId] = useState<number | "">("");
  const [questionarioId, setQuestionarioId] = useState<number | "">("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const loadQuePerg = async () => {
      try {
        const response = await api.get<QuePerg>(`/quepreg/${id}`);
        setPerguntaId(response.data.pergunta_id);
        setQuestionarioId(response.data.questionario_id);
      } catch (error) {
        console.error("Erro ao carregar relação pergunta-questionário:", error);
        alert("Relação não encontrada");
        router.push("/quepreg");
      }
    };

    if (id) loadQuePerg();
  }, [id, router]);

  const handleUpdateQuePerg = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Verifique se os campos estão preenchidos antes de enviar a requisição
    if (perguntaId === "" || questionarioId === "") {
      alert("Todos os campos devem ser preenchidos!");
      return;
    }

    try {
      await api.put(`/quepreg/${id}`, {
        pergunta_id: Number(perguntaId),
        questionario_id: Number(questionarioId)
      });
      
      alert("Relação atualizada com sucesso!");
      router.push("/quepreg");
    } catch (error) {
      console.error("Erro na atualização:", error);
      alert("Erro ao atualizar a relação!");
    }
  };

  return (
    <div className="Create">
      <h3>Atualização de Relação Pergunta-Questionário</h3>
      <form onSubmit={handleUpdateQuePerg}>
        <div className="form-group">
          <label htmlFor="perguntaId">ID da Pergunta:</label>
          <input
            type="number"
            id="perguntaId"
            value={perguntaId}
            onChange={(e) => setPerguntaId(Number(e.target.value) || "")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="questionarioId">ID do Questionário:</label>
          <input
            type="number"
            id="questionarioId"
            value={questionarioId}
            onChange={(e) => setQuestionarioId(Number(e.target.value) || "")}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">
            Salvar Alterações
          </button>
          <button 
            type="button" 
            onClick={() => router.push("/quepreg")}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
