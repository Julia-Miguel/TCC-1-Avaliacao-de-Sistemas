'use client';

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import "../../globals.css";

export default function CreateUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const router = useRouter();

  const handleNewUsuario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { nome, email, tipo };
    try {
      await api.post("/usuario", data);
      alert("Usuário cadastrado com sucesso!");
      router.push("/usuario");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar o usuário!");
    }
  };

  return (
    <div className="Create">
      <h3>Cadastro de Usuário</h3>
      <form onSubmit={handleNewUsuario}>
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
        <button type="submit">Cadastrar</button>
        <button type="reset">Limpar</button>
      </form>
    </div>
  );
}
