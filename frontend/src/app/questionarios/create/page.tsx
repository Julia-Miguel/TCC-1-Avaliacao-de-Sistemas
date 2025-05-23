'use client';

import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import "../../globals.css";
import "../../questionario.css";

export default function CreateQuestionario() {
  const [titulo, setTitulo] = useState("");
  const router = useRouter();

  const handleNewQuestionario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!titulo.trim()) {
      alert("O título não pode estar vazio.");
      return;
    }

    const data = {
      titulo,
      perguntas: [],
      avaliacoes: [],
    };

    try {
      await api.post("/questionarios", data);
      router.push("/questionarios");
      // Aqui você pode adicionar um toast, como react-toastify
    } catch (error: any) {
      console.error("Erro no frontend:", error.response?.data ?? error.message);
      alert("Erro ao cadastrar o questionário!");
    }
  };

  return (
    <div className="create-container">
      <h3>Cadastro de Questionário</h3>
      <form onSubmit={handleNewQuestionario} className="form">
        <div className="form-group">
          <label htmlFor="titulo">Título do Questionário</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            minLength={3}
            placeholder="Digite o título do questionário"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn-primary">Cadastrar</button>
          <button type="reset" className="btn-secondary">Limpar</button>
        </div>
      </form>
    </div>
  );
}