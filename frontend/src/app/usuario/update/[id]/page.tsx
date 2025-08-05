'use client';

import { useEffect, useState, Suspense } from "react";
import api from "@/services/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "../../../globals.css";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

// Interface para os dados do usuário
interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

// Componente principal com a lógica do formulário
function UpdateUsuarioContent() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("CLIENTE"); // Padrão para 'CLIENTE'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const usuarioId = params.id ? parseInt(params.id as string) : null;

  // Efeito para buscar os dados do usuário ao carregar a página
  useEffect(() => {
    if (!usuarioId) {
      setError("ID do Usuário não fornecido.");
      setIsLoading(false);
      return;
    }

    const fetchUsuario = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Usuario>(`/usuario/${usuarioId}`);
        const usuario = response.data;
        setNome(usuario.nome);
        setEmail(usuario.email);
        setTipo(usuario.tipo);
      } catch (err: any) {
        console.error("Erro ao carregar dados do usuário:", err);
        if (err.response?.status === 404) {
          setError("Usuário não encontrado.");
        } else {
          setError("Erro ao carregar o usuário para edição.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuario();
  }, [usuarioId]);

  // Função para lidar com o envio do formulário de atualização
  const handleUpdateUsuario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!nome.trim() || !email.trim()) {
      setError("Nome e Email são obrigatórios!");
      return;
    }
    if (!usuarioId) {
      setError("ID do usuário é inválido para atualização.");
      return;
    }
    
    setIsLoading(true);

    const data = { id: usuarioId, nome, email, tipo };

    try {
      await api.put("/usuario", data);
      alert("Usuário atualizado com sucesso!");
      router.push("/usuario");
    } catch (err: any) {
      console.error("Erro ao atualizar o usuário:", err);
      setError(err.response?.data?.message ?? "Erro ao atualizar o usuário!");
    } finally {
      setIsLoading(false);
    }
  };

  // Tela de Loading inicial
  if (isLoading && !nome && !error) {
    return <div className="page-container center-content"><p>Carregando dados do usuário...</p></div>;
  }

  // Tela para erro na busca inicial dos dados
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
          <h3>Atualização de Usuário (ID: {usuarioId})</h3>
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
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="input-edit-mode"
                    disabled={isLoading}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row"><label htmlFor="email" className="form-label">Email</label></th>
                <td>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-edit-mode"
                    disabled={isLoading}
                  />
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
