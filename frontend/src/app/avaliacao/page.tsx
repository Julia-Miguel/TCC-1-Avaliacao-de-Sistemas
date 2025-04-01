'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";

interface AvaliacaoInterface {
  id: number;
  semestre: string;
  questionario: {
    titulo: string;
  };
  usuarios: {
    usuario: {
      nome: string;
    };
    status: string;
    isFinalizado: boolean;
  }[];
  created_at: string;
  updated_at: string;
}

export default function ListAvaliacao() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoInterface[]>([]);

  useEffect(() => {
    api.get("/avaliacao")
      .then(response => {
        console.log("Dados retornados pela API:", response.data); // Para depuração
        setAvaliacoes(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar as avaliações:", error.response?.data || error.message);
        alert("Erro ao buscar as avaliações: " + (error.response?.data?.error || error.message));
      });
  }, []);

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

  const handleDeleteAvaliacao = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta avaliação?")) return;

    try {
      await api.delete('/avaliacao', { data: { id } });
      alert("Avaliação excluída com sucesso!");
      setAvaliacoes(prev => prev.filter(avaliacao => avaliacao.id !== id));
    } catch (error) {
      console.error("Erro ao excluir a avaliação:", error);
      alert(`Erro ao excluir a avaliação: ${error}`);
    }
  };

  return (
    <div>
      <div className="center-content">
        <h3>Lista de Avaliações</h3>
        <div>
          <Link href="/avaliacao/create">Inserir</Link>
        </div>
        <div>
          <Link href="/">Voltar</Link>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Semestre</th>
            <th>Questionário</th>
            <th>Usuários</th>
            <th>Criado</th>
            <th>Alterado</th>
            <th>Atualizar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {avaliacoes.map(avaliacao => (
            <tr key={avaliacao.id}>
              <td>{avaliacao.id}</td>
              <td>{avaliacao.semestre}</td>
              <td>{avaliacao.questionario?.titulo ?? "Sem título"}</td>
              <td>
                {avaliacao.usuarios && avaliacao.usuarios.length > 0 ? (
                  avaliacao.usuarios.map((usuAval, index) => (
                    <div key={index}>
                      {usuAval.usuario?.nome ?? "Usuário não encontrado"} - {usuAval.status ?? "Sem status"} - {usuAval.isFinalizado ? "Finalizado" : "Em andamento"}
                    </div>
                  ))
                ) : (
                  "Nenhum usuário associado"
                )}
              </td>
              <td>{formatDate(avaliacao.created_at)}</td>
              <td>{formatDate(avaliacao.updated_at)}</td>
              <td><Link href={`/avaliacao/update/${avaliacao.id}`}>Atualizar</Link></td>
              <td>
                <button onClick={() => handleDeleteAvaliacao(avaliacao.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}