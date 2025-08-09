'use client';

import { useEffect, useState, Suspense } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "../../../globals.css";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

interface Usuario {
  id: number;
  token: string;
  nome: string;
  email: string;
  tipo: string;
}

function UpdateUsuarioContent() {
  const [token, setToken] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("CLIENTE");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const urlToken = params.id as string;

  useEffect(() => {
    if (!urlToken) {
      setError("Token do Usuário não fornecido na URL.");
      setIsLoading(false);
      return;
    }

    const fetchUsuario = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Usuario>(`/usuario/${urlToken}`);
        const usuario = response.data;
        setToken(usuario.token);
        setNome(usuario.nome);
        setEmail(usuario.email);
        setTipo(usuario.tipo);
      } catch (err: any) {
        console.error("Erro ao carregar dados do usuário:", err);
        if (err.response?.status === 404) {
            setError("Usuário não encontrado ou você não tem permissão para acessá-lo.");
        } else {
            setError("Ocorreu um erro ao buscar os dados do usuário.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuario();
  }, [urlToken]);

  const handleUpdateUsuario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setError("Token do usuário não está definido. Não é possível atualizar.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const data = { token, nome, email, tipo };

    try {
      await api.put("/usuario", data);
      alert("Usuário atualizado com sucesso!");
      router.push("/usuario");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erro ao atualizar o usuário!");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !error) {
    return <div className="page-container center-content"><p>Carregando dados do usuário...</p></div>;
  }

  if (error && !nome) {
    return (
      <div className="page-container center-content">
        <p style={{ color: 'red' }}>{error}</p>
        <Link href="/usuario" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Voltar para Lista de Usuários
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="editor-form-card" style={{ maxWidth: '700px' }}>
        <div className="form-header">
          <h3>Atualização de Usuário</h3>
          <Link href="/usuario" className="btn btn-outline btn-sm">Voltar</Link>
        </div>
        <form onSubmit={handleUpdateUsuario} className="display-section">
          {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
          <table>
            <tbody>
              <tr>
                <th scope="row"><label htmlFor="nome" className="form-label">Nome</label></th>
                <td>
                  <input
                    type="text" id="nome" value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required className="input-edit-mode" disabled={isLoading}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row"><label htmlFor="email" className="form-label">Email</label></th>
                <td>
                  <input
                    type="email" id="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required className="input-edit-mode" disabled={isLoading}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row"><label htmlFor="tipo" className="form-label">Tipo</label></th>
                <td>
                  <select
                    id="tipo" value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required className="input-edit-mode" disabled={isLoading}
                  >
                    <option value="CLIENTE">Cliente</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="form-actions">
            <button type="button" onClick={() => router.push('/usuario')} className="btn btn-secondary" disabled={isLoading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UpdateUsuarioPage() {
  return (
    <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
      <AdminAuthGuard>
        <UpdateUsuarioContent />
      </AdminAuthGuard>
    </Suspense>
  );
}