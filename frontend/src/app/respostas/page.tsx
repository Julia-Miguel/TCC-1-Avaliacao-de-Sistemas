// src/app/respostas/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";
import { errorMonitor } from "node:stream";

interface RespostaInterface {
  id: number;
  usuAval: {
    usuario: {
      nome: string;
    };
    avaliacao: {
      semestre: string;
    };
  } | null;
  pergunta: {
    enunciado: string;
  } | null;
  resposta: string;
  created_at: string | null;
  updated_at: string | null;
}

export default function ListRespostas() {
  const [respostas, setRespostas] = useState<RespostaInterface[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState(0); // Estado para forçar recarga

  const fetchRespostas = async () => {
    try {
      const response = await api.get("/respostas");
      setRespostas(response.data);
    } catch (error) {
      console.error("Erro ao buscar as respostas:", error);
      alert("Erro ao buscar as respostas: " + (error));
    }
  };

  useEffect(() => {
    fetchRespostas();
  }, [reloadTrigger]); // Recarrega quando reloadTrigger muda

  const formatDate = (isoDate: string | null | undefined) => {
    if (!isoDate) return "Data não disponível";
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleDeleteResposta = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta resposta?")) return;

    try {
      await api.delete('/respostas', { data: { id } });
      alert("Resposta excluída com sucesso!");
      setRespostas(prev => prev.filter(resposta => resposta.id !== id));
    } catch (error) {
      console.error("Erro ao excluir a resposta:", error);
      alert(`Erro ao excluir a resposta: ${error}`);
    }
  };

  return (
    <div>
      <div className="center-content">
        <h3>Lista de Respostas</h3>
        <div>
          <Link href="/respostas/create">Inserir</Link>
        </div>
        <div>
          <Link href="/">Voltar</Link>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Avaliação</th>
              <th>Pergunta</th>
              <th>Resposta</th>
              <th>Criado</th>
              <th>Atualizado</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {respostas.map(resposta => (
              <tr key={resposta.id}>
                <td>{resposta.id}</td>
                <td>{resposta.usuAval?.usuario?.nome ?? "Usuário não encontrado"}</td>
                <td>{resposta.usuAval?.avaliacao?.semestre ?? "Avaliação não encontrada"}</td>
                <td>{resposta.pergunta?.enunciado ?? "Pergunta não encontrada"}</td>
                <td>{resposta.resposta}</td>
                <td>{formatDate(resposta.created_at)}</td>
                <td>{formatDate(resposta.updated_at)}</td>
                <td><Link href={`/respostas/update/${resposta.id}`}>Editar</Link></td>
                <td>
                  <button onClick={() => handleDeleteResposta(resposta.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}