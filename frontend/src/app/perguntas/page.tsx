// src/app/pergunta/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";

interface PerguntaInterface {
  id: number;
  enunciado: string;
  tipos: string;
  created_at: string;
  updated_at: string;
}

export default function ListPergunta() {
  const [perguntas, setPerguntas] = useState<PerguntaInterface[]>([]);

  useEffect(() => {
    api.get("/perguntas")
      .then(response => {
        setPerguntas(response.data);
      })
      .catch(error => {
        console.error(error);
        alert("Erro ao buscar perguntas");
      });
  }, []);

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleDeletePergunta = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta pergunta?")) return;
    try {
      await api.delete('/perguntas', { data: { id } });
      alert("Pergunta excluída com sucesso!");
      setPerguntas(perguntas.filter(pergunta => pergunta.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir a pergunta!");
    }
  };

  return (
    <div>
      <div className="center-content">
        <h3>Lista de Perguntas</h3>
        <div>
          <Link href="/perguntas/create">Inserir</Link>
        </div>
        <div>
          <Link href="/">Voltar</Link>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Enunciado</th>
            <th>Tipo de Pergunta</th>
            <th>Criado</th>
            <th>Alterado</th>
            <th>Atualizar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {perguntas.map(pergunta => (
            <tr key={pergunta.id}>
              <td>{pergunta.id}</td>
              <td>{pergunta.enunciado}</td>
              <td>{pergunta.tipos}</td>
              <td>{formatDate(pergunta.created_at)}</td>
              <td>{formatDate(pergunta.updated_at)}</td>
              <td><Link href={`/perguntas/update/${pergunta.id}`}>Atualizar</Link></td>
              <td>
                <button onClick={() => handleDeletePergunta(pergunta.id)}>
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
