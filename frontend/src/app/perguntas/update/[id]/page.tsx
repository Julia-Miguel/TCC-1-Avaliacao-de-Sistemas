// src/app/pergunta/update/[id]/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import "../../../css.css"; // Ajuste o caminho se necessário

// Interface para a estrutura da pergunta
interface Pergunta {
  id: number;
  enunciado: string;
  tipos: string;
  created_at?: string; // Opcional, caso não seja sempre retornado
  updated_at?: string; // Opcional, caso não seja sempre retornado
}

export default function UpdatePergunta() {
  const [enunciado, setEnunciado] = useState("");
  const [tipos, setTipos] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      api.get<Pergunta>(`/perguntas/${id}`)
        .then((response) => {
          setEnunciado(response.data.enunciado);
          setTipos(response.data.tipos);
        })
        .catch((error: unknown) => {
          console.log(error);
          alert("Erro ao buscar a pergunta");
        });
    }
  }, [id]);

  const handleUpdatePergunta = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { id: Number(id), enunciado, tipos };
    try {
      await api.put<Pergunta>(`/perguntas/${id}`, data);
      alert("Pergunta atualizada com sucesso!");
      router.push("/perguntas");
    } catch (error: unknown) {
      console.log(error);
      alert("Erro ao atualizar a pergunta!");
    }
  };

  return (
    <div className="Create">
      <h3>Atualização de Pergunta: {enunciado} - {tipos}</h3>
      <form onSubmit={handleUpdatePergunta}>
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
        <button type="submit">Atualizar</button>
        <button type="reset">Limpar</button>
      </form>
    </div>
  );
}