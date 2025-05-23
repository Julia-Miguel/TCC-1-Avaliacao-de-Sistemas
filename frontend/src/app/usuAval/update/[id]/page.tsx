// frontend/src/app/usuAval/update/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useRouter, useParams } from 'next/navigation';
import '../../../globals.css';

export default function UpdateUsuAval() {
  const [usuarioId, setUsuarioId] = useState<number>(0);
  const [avaliacaoId, setAvaliacaoId] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [isFinalizado, setIsFinalizado] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      api.get(`/usuAval/${id}`)
        .then(response => {
          const data = response.data;
          setUsuarioId(data.usuarioId);
          setAvaliacaoId(data.avaliacaoId);
          setStatus(data.status);
          setIsFinalizado(data.isFinalizado);
        })
        .catch(error => {
          console.error(error);
          alert('Erro ao buscar avaliação');
        });
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put('/usuAval', { id: Number(id), usuarioId, avaliacaoId, status, isFinalizado });
      alert('Avaliação atualizada com sucesso!');
      router.push('/usuAval');
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar avaliação');
    }
  };

  return (
    <div className="center-content">
      <h3>Atualização de Avaliação de Usuário</h3>
      <form onSubmit={handleUpdate}>
        <table>
          <thead>
            <tr>
              <th>Campo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><label htmlFor="usuarioId">Usuário ID</label></td>
              <td>
                <input
                  type="number"
                  id="usuarioId"
                  value={usuarioId}
                  onChange={e => setUsuarioId(Number(e.target.value))}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="avaliacaoId">Avaliação ID</label></td>
              <td>
                <input
                  type="number"
                  id="avaliacaoId"
                  value={avaliacaoId}
                  onChange={e => setAvaliacaoId(Number(e.target.value))}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="status">Status</label></td>
              <td>
                <input
                  type="text"
                  id="status"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="isFinalizado">Finalizado</label></td>
              <td>
                <input
                  type="checkbox"
                  id="isFinalizado"
                  checked={isFinalizado}
                  onChange={e => setIsFinalizado(e.target.checked)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Atualizar</button>
        <button type="reset">Limpar</button>
      </form>
    </div>
  );
}
