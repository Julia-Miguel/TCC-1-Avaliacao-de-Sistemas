'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";

interface UsuAvalInterface {
  id: number;
  usuario: { nome: string };
  avaliacao: { semestre: string };
  status: string;
  isFinalizado: boolean;
  created_at: string;
  updated_at: string;
}

export default function ListUsuAval() {
  const [usuAvals, setUsuAvals] = useState<UsuAvalInterface[]>([]);

  useEffect(() => {
    api.get("/usuAval")
      .then(response => {
        setUsuAvals(response.data);
      })
      .catch(error => {
        console.error(error);
        alert("Erro ao buscar avaliações de usuário");
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir esta avaliação?")) return;
    try {
      await api.delete('/usuAval', { data: { id } });
      alert("Avaliação excluída com sucesso!");
      setUsuAvals(usuAvals.filter(item => item.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir a avaliação!");
    }
  };

  return (
    <div>
      <div className="center-content">
        <h3>Lista de Avaliações de Usuário</h3>
        <div>
          <Link href="/usuAval/create">Inserir</Link>
        </div>
        <div>
          <Link href="/">Voltar</Link>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Usuário</th>
            <th>Avaliação</th>
            <th>Status</th>
            <th>Finalizado</th>
            <th>Criado</th>
            <th>Alterado</th>
            <th>Atualizar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {usuAvals.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.usuario.nome}</td>
              <td>{item.avaliacao.semestre}</td>
              <td>{item.status}</td>
              <td>{item.isFinalizado ? 'Sim' : 'Não'}</td>
              <td>{formatDate(item.created_at)}</td>
              <td>{formatDate(item.updated_at)}</td>
              <td>
                <Link href={`/usuAval/update/${item.id}`}>Atualizar</Link>
              </td>
              <td>
                <button onClick={() => handleDelete(item.id)}>
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
