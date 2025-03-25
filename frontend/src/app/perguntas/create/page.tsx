// src/app/pergunta/create/page.tsx
'use client';

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import "../../globals.css"; // Ajuste o caminho se necessário

export default function CreatePergunta() {
  const [enunciado, setEnunciado] = useState("");
  const [tipos, setTipos] = useState("");
  const router = useRouter();

  const handleNewPergunta = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { enunciado, tipos };
    try {
      await api.post("/perguntas", data);
      alert("Pergunta cadastrada com sucesso!");
      router.push("/perguntas");
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar a pergunta!");
    }
  };

  return (
    <div className="Create">
      <h3>Cadastro de Pergunta</h3>
      <form onSubmit={handleNewPergunta}>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="enunciado">Enunciado</label></td>
              <td><input type="text" name="enunciado" id="enunciado" value={enunciado} onChange={e => setEnunciado(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="tipo">Tipo de Pergunta</label></td>
              <td><input type="text" name="tipo" id="tipo" value={tipos} onChange={e => setTipos(e.target.value)} /></td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Cadastrar</button>
        <button type="reset">Limpar</button>
      </form>
    </div>
  );
}