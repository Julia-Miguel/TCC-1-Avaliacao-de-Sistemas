'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import "../../../globals.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export default function UpdateUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      api.get<Usuario>(`/usuario/${id}`)
        .then((response) => {
          setNome(response.data.nome);
          setEmail(response.data.email);
          setTipo(response.data.tipo);
        })
        .catch((error) => {
          console.error(error);
          alert("Erro ao buscar o usuário");
        });
    }
  }, [id]);

  const handleUpdateUsuario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { id: Number(id), nome, email, tipo };
    try {
      await api.put("/usuario", data);
      alert("Usuário atualizado com sucesso!");
      router.push("/usuario");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o usuário!");
    }
  };

  return (
    <div className="Create">
      <h3>Atualização de Usuário</h3>
      <form onSubmit={handleUpdateUsuario}>
        <table>
          <thead>
            <tr>
              <th>Campo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><label htmlFor="nome">Nome</label></td>
              <td><input type="text" name="nome" id="nome" value={nome} onChange={e => setNome(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="email">Email</label></td>
              <td><input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="tipo">Tipo</label></td>
              <td><input type="text" name="tipo" id="tipo" value={tipo} onChange={e => setTipo(e.target.value)} /></td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Atualizar</button>
        <button type="reset">Limpar</button>
      </form>
    </div>
  );
}
