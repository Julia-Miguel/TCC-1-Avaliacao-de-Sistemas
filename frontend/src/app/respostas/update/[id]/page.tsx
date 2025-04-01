// src/app/resposta/update/[id]/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import "../../../globals.css";

interface Resposta {
  id: number;
  resposta: string;
  usuAvalId: number;
  perguntaId: number;
  created_at?: string;
  updated_at?: string;
}

interface UsuAval {
  id: number;
  usuario: {
    nome: string;
  };
  avaliacao: {
    semestre: string;
  };
}

interface Pergunta {
  id: number;
  enunciado: string;
}

export default function UpdateResposta() {
  const [resposta, setResposta] = useState("");
  const [usuAvalId, setUsuAvalId] = useState(""); // Alterado para string
  const [perguntaId, setPerguntaId] = useState(""); // Alterado para string
  const [usuAvals, setUsuAvals] = useState<UsuAval[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar a resposta para o id fornecido
        const response = await api.get<Resposta>(`/respostas/${id}`);
        const respostaData = response.data;
        setResposta(respostaData.resposta || "");
        setUsuAvalId(respostaData.usuAvalId.toString() || "");
        setPerguntaId(respostaData.perguntaId.toString() || "");

        // Carregar avaliações e perguntas para o select
        const resUsuAvals = await api.get<UsuAval[]>("/usuaval");
        setUsuAvals(resUsuAvals.data);

        const resPerguntas = await api.get<Pergunta[]>("/perguntas");
        setPerguntas(resPerguntas.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar a resposta: " + (error));
        router.push("/respostas");
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleUpdateResposta = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!resposta || !usuAvalId || !perguntaId) {
      alert("Preencha todos os campos!");
      return;
    }

    const data = {
      id: parseInt(id as string),
      resposta,
      usuAvalId: parseInt(usuAvalId),
      perguntaId: parseInt(perguntaId),
    };

    try {
      await api.put("/respostas", data);
      alert("Resposta atualizada com sucesso!");
      router.push("/respostas");
    } catch (error) {
      console.error("Erro ao atualizar a resposta:", error);
      alert(`Erro ao atualizar a resposta: ${error}`);
    }
  };

  const handleReset = () => {
    setResposta("");
    setUsuAvalId("");
    setPerguntaId("");
  };

  return (
    <div className="Create">
      <h3>Atualização de Resposta</h3>
      <form onSubmit={handleUpdateResposta}>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="usuAvalId">Avaliação</label></td>
              <td>
                <select
                  name="usuAvalId"
                  id="usuAvalId"
                  value={usuAvalId}
                  onChange={(e) => setUsuAvalId(e.target.value)}
                  required
                >
                  <option value="">Selecione uma avaliação</option>
                  {usuAvals.map((usuAval) => (
                    <option key={usuAval.id} value={usuAval.id}>
                      {usuAval.usuario.nome} - {usuAval.avaliacao.semestre}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="perguntaId">Pergunta</label></td>
              <td>
                <select
                  name="perguntaId"
                  id="perguntaId"
                  value={perguntaId}
                  onChange={(e) => setPerguntaId(e.target.value)}
                  required
                >
                  <option value="">Selecione uma pergunta</option>
                  {perguntas.map((pergunta) => (
                    <option key={pergunta.id} value={pergunta.id}>
                      {pergunta.enunciado}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="resposta">Resposta</label></td>
              <td>
                <textarea
                  id="resposta"
                  value={resposta}
                  onChange={(e) => setResposta(e.target.value)}
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Atualizar</button>
        <button type="button" onClick={handleReset}>Limpar</button>
      </form>
    </div>
  );
}