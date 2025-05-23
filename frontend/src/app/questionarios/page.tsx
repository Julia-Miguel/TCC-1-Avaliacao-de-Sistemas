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

interface PerguntaInterface {
  id: number;
  enunciado: string;
  tipos: string;
  questionarioId: number;
}

export default function ListQuestionarios() {
  const [questionarios, setQuestionarios] = useState<QuestionarioInterface[]>([]);
  const [perguntas, setPerguntas] = useState<PerguntaInterface[]>([]);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState<number | null>(null);

  useEffect(() => {
    api.get("/questionarios")
      .then(response => setQuestionarios(response.data))
      .catch(error => {
        console.error(error);
        alert("Erro ao buscar questionários");
      });

    api.get("/queperg")
      .then(response => setPerguntas(response.data.map((qp: any) => ({
        id: qp.pergunta.id,
        enunciado: qp.pergunta.enunciado,
        tipos: qp.pergunta.tipos,
        questionarioId: qp.questionarioId
      }))))
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
    });
  };

  const handleDeleteQuestionario = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este questionário?")) return;
    try {
      await api.delete('/questionarios', { data: { id } });
      setQuestionarios(questionarios.filter(q => q.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o questionário!");
    }
  };

  const toggleMenu = (id: number) => {
    setMenuAberto(menuAberto === id ? null : id);
  };

  const toggleDetalhes = (id: number) => {
    setDetalhesVisiveis(detalhesVisiveis === id ? null : id);
    setMenuAberto(null);
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
      <div className="questionarios-grid">
        {questionarios.map((q) => (
          <div key={q.id} className="questionario-card">
            <div className="card-header">
              <h4>{q.titulo}</h4>
              <button className="botao" onClick={() => toggleMenu(q.id)}>⋮</button>
            </div>
            <div className="perguntas-list">
              {perguntas.filter(p => p.questionarioId === q.id).length > 0 ? (
                perguntas
                  .filter(p => p.questionarioId === q.id)
                  .map((p, idx) => (
                    <h5
                      key={typeof p.id === "number" && p.id !== undefined ? p.id : `idx-${idx}`}
                      className="enunciado-pergunta"
                    >
                      {p.enunciado}
                    </h5>
                  ))
              ) : (
                <p className="no-perguntas">Nenhuma pergunta associada</p>
              )}
            </div>
            {menuAberto === q.id && (
              <div className="menu-dropdown">
                <button className="botao" onClick={() => handleDeleteQuestionario(q.id)}>Deletar</button>
                <button className="botao" onClick={() => toggleDetalhes(q.id)}>Detalhes</button>
              </div>
            )}
            {detalhesVisiveis === q.id && (
              <div className="detalhes">
                <p><strong>Criado em:</strong> {formatDate(q.created_at)}</p>
                <p><strong>Última modificação:</strong> {formatDate(q.updated_at)}</p>
                <button onClick={() => setDetalhesVisiveis(null)}>Fechar</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}