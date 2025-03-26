'use client';

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import "../../globals.css";

export default function CreateQuestionario() {
  const [titulo, setTitulo] = useState("");
  const router = useRouter();

  const handleNewQuestionario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const data = {
      titulo,
      perguntas: [], // Enviar lista vazia para evitar erro no backend
      avaliacoes: [] // Enviar lista vazia para evitar erro no backend
    };

    try {
      await api.post("/questionarios", data);
      alert("Questionário cadastrado com sucesso!");
      router.push("/questionarios");
    } catch (error: any) {
      console.error("Erro no frontend:", error.response?.data || error.message);
      alert("Erro ao cadastrar o questionário!");
    }
  };

  return (
    <div className="Create">
      <h3>Cadastro de Questionario</h3>
      <form onSubmit={handleNewQuestionario}>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="enunciado">Enunciado</label></td>
              <td><input type="text" name="enunciado" id="enunciado" value={titulo} onChange={e => setTitulo(e.target.value)} /></td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Cadastrar</button>
        <button type="reset">Limpar</button>
      </form>
    </div>
  );
}