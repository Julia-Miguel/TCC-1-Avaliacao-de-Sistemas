'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";
import "../questionario.css";

interface QuestionarioInterface {
  id: number;
  titulo: string;
  created_at: string;
  updated_at: string;
}

export default function ListQuestionarios() {
  const [questionarios, setQuestionarios] = useState<QuestionarioInterface[]>([]);

  useEffect(() => {
    api.get("/questionarios")
      .then(response => setQuestionarios(response.data))
      .catch(error => {
        console.error(error);
        alert("Erro ao buscar questionários");
      });
  }, []);

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteQuestionario = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este questionário?")) return;
    try {
      await api.delete('/questionarios', { data: { id } });
      setQuestionarios(questionarios.filter(q => q.id !== id));
      // Adicionar toast de sucesso aqui
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o questionário!");
    }
  };

  return (
    <div className="list-container">
      <div className="center-content">
        <h3>Lista de Questionários</h3>
        <div className="button-group">
          <Link href="/questionarios/create" className="btn-primary">Inserir</Link>
          <Link href="/" className="btn-secondary">Voltar</Link>
        </div>
      </div>
      <table aria-label="Lista de questionários">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Criado</th>
            <th>Alterado</th>
            <th>Atualizar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {questionarios.map((q) => (
            <tr key={q.id}>
              <td>{q.id}</td>
              <td>{q.titulo}</td>
              <td>{formatDate(q.created_at)}</td>
              <td>{formatDate(q.updated_at)}</td>
              <td>
                <Link href={`/questionarios/update/${q.id}`} className="btn-link">Atualizar</Link>
              </td>
              <td>
                <button onClick={() => handleDeleteQuestionario(q.id)} className="btn-danger">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}