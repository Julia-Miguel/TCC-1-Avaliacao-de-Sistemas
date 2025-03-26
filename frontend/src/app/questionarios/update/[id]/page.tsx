// src/app/questionarios/update/[id]/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import "../../../globals.css";

interface Questionario {
  id: number;
  titulo: string;
  created_at?: string;
  updated_at?: string;
}

export default function UpdateQuestionario() {
  const [titulo, setTitulo] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const loadQuestionario = async () => {
      try {
        const response = await api.get<Questionario>(`/questionarios/${id}`);
        setTitulo(response.data.titulo);
      } catch (error) {
        console.error("Erro ao carregar questionário:", error);
        alert("Questionário não encontrado");
        router.push("/questionarios");
      }
    };

    if (id) loadQuestionario();
  }, [id, router]);

  const handleUpdateQuestionario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      // Corrigido para enviar o ID no corpo da requisição
      await api.put(`/questionarios`, { 
        id: Number(id),
        titulo 
      });
      
      alert("Questionário atualizado com sucesso!");
      router.push("/questionarios");
    } catch (error) {
      console.error("Erro na atualização:", error);
      alert("Erro ao atualizar o questionário!");
    }
  };

  return (
    <div className="Create">
      <h3>Atualização de Questionário</h3>
      <form onSubmit={handleUpdateQuestionario}>
        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            minLength={3}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn-primary">
            Salvar Alterações
          </button>
          <button 
            type="button" 
            onClick={() => router.push("/questionarios")}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}