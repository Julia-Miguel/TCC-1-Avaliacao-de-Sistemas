// src/app/avaliacao/update/[id]/page.tsx
'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import "../../../globals.css"; 

// Interface para a estrutura da avaliação
interface Avaliacao {
  id: number;
  enunciado: string;
  tipos: string;
  created_at?: string; // Opcional, caso não seja sempre retornado
  updated_at?: string; // Opcional, caso não seja sempre retornado
}

export default function UpdateAvaliacao() {
  const [enunciado, setEnunciado] = useState("");
  const [tipos, setTipos] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      api.get<Avaliacao>(`/avaliacoes/${id}`)
        .then((response) => {
          setEnunciado(response.data.enunciado);
          setTipos(response.data.tipos);
        })
        .catch((error: unknown) => {
          console.log(error);
          alert("Erro ao buscar a avaliação");
        });
    }
  }, [id]);

  const handleUpdateAvaliacao = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { id: Number(id), enunciado, tipos };
    try {
      await api.put<Avaliacao>("/avaliacoes", data); // Alterado para enviar o ID no corpo
      alert("Avaliação atualizada com sucesso!");
      router.push("/avaliacoes");
    } catch (error: unknown) {
      console.log(error);
      alert("Erro ao atualizar a avaliação!");
    }
};

  return (
    <div className="Create">    
      <h3>Atualização de Avaliação: {enunciado} - {tipos}</h3>
      <form onSubmit={handleUpdateAvaliacao}>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="enunciado">Enunciado</label></td>
              <td><input type="text" name="enunciado" id="enunciado" value={enunciado} onChange={e => setEnunciado(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label htmlFor="tipo">Tipo de Avaliação</label></td>
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
