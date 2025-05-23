'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";

interface UsuarioInterface {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  created_at: string;
  updated_at: string;
}

export default function ListUsuario() {
  const [usuarios, setUsuarios] = useState<UsuarioInterface[]>([]);

  useEffect(() => {
    api.get("/usuario")
      .then(response => setUsuarios(response.data))
      .catch(error => {
        console.error(error);
        alert("Erro ao buscar usuários");
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

  const handleDeleteUsuario = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este usuário?")) return;
    try {
      await api.delete('/usuario', { data: { id } });
      alert("Usuário excluído com sucesso!");
      setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o usuário!");
    }
  };

  return (
    <div>
      <div className="center-content">
        <h3>Lista de Usuários</h3>
        <div>
          <Link href="/usuario/create">Inserir</Link>
        </div>
        <div>
          <Link href="/">Voltar</Link>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Criado</th>
            <th>Alterado</th>
            <th>Atualizar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.tipo}</td>
              <td>{formatDate(usuario.created_at)}</td>
              <td>{formatDate(usuario.updated_at)}</td>
              <td><Link href={`/usuario/update/${usuario.id}`}>Atualizar</Link></td>
              <td><button onClick={() => handleDeleteUsuario(usuario.id)}>Excluir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
