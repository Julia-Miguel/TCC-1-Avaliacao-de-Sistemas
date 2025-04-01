'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";

interface QuepergInterface {
  id: number;
  questionarioId: number;
  perguntaId: number;
  questionario: {
    titulo: string;
  };
  pergunta: {
    enunciado: string;
    tipos: string;
  };
  created_at: string;
  updated_at: string;
}

export default function ListQueperg() {
  const [quepergs, setQuepergs] = useState<QuepergInterface[]>([]);

  useEffect(() => {
    api.get("/queperg")
      .then(response => setQuepergs(response.data))
      .catch(error => {
        console.error(error);
        alert("Erro ao buscar as associações entre questionários e perguntas.");
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

  const handleDeleteQueperg = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta associação?")) return;

    try {
      await api.delete('/queperg', { data: { id } });
      alert("Associação excluída com sucesso!");
      setQuepergs(prev => prev.filter(queperg => queperg.id !== id));
    } catch (error) {
      console.error("Erro ao excluir a associação:", error);
      alert(`Erro ao excluir a associação: ${error}`);
    }
  };

  return (
    <div>
      <div className="center-content">
        <h3>Lista de Associações entre Questionários e Perguntas</h3>
        <div>
          <Link href="/queperg/create">Inserir</Link>
        </div>
        <div>
          <Link href="/">Voltar</Link>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Questionário</th>
            <th>Pergunta</th>
            <th>Tipo</th>
            <th>Criado</th>
            <th>Alterado</th>
            <th>Atualizar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {quepergs.map(queperg => (
            <tr key={queperg.id}><td>{queperg.id}</td><td>{queperg.questionario?.titulo ?? "Sem título"}</td><td>{queperg.pergunta?.enunciado ?? "Sem enunciado"}</td><td>{queperg.pergunta?.tipos ?? "Sem tipo"}</td><td>{formatDate(queperg.created_at)}</td><td>{formatDate(queperg.updated_at)}</td><td><Link href={`/queperg/update/${queperg.id}`}>Atualizar</Link></td><td><button onClick={() => handleDeleteQueperg(queperg.id)}>Excluir</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}