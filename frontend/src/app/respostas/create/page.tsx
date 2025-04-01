// src/app/respostas/create/page.tsx
'use client';

import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import "../../globals.css";

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

export default function CreateResposta() {
  const [resposta, setResposta] = useState("");
  const [usuAvalId, setUsuAvalId] = useState("");
  const [perguntaId, setPerguntaId] = useState("");
  const [usuAvals, setUsuAvals] = useState<UsuAval[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsuAvals = await api.get<UsuAval[]>("/usuaval");
        setUsuAvals(resUsuAvals.data);

        const resPerguntas = await api.get<Pergunta[]>("/perguntas");
        setPerguntas(resPerguntas.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar dados: " + (error));
      }
    };
    fetchData();
  }, []);

  const handleNewResposta = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!resposta || !usuAvalId || !perguntaId) {
      alert("Preencha todos os campos!");
      return;
    }

    const data = {
      resposta,
      usuAvalId: parseInt(usuAvalId),
      perguntaId: parseInt(perguntaId),
    };

    try {
      await api.post("/respostas", data);
      alert("Resposta criada com sucesso!");
      router.push("/respostas");
    } catch (error) {
      console.error("Erro ao criar a resposta:", error);
      alert(`Erro ao criar a resposta: ${error}`);
    }
  };

  const handleReset = () => {
    setResposta("");
    setUsuAvalId("");
    setPerguntaId("");
  };

  return (
    <div className="Create">
      <h3>Criar Nova Resposta</h3>
      <form onSubmit={handleNewResposta}>
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
        <button type="submit">Cadastrar</button>
        <button type="button" onClick={handleReset}>Limpar</button>
      </form>
    </div>
  );
}