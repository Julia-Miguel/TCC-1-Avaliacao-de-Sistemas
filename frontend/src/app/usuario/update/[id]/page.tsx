'use client';

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";
import "../../../globals.css";
import "../../../responsividade.css";
import { useAuth } from "@/contexts/AuthContext";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";
import { Trash2 } from "lucide-react"; // 1. Importar o ícone da lixeira

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string; // Senha pode não vir da API, então é opcional
  tipo: string;
}

function UpdateUsuarioContent() {
  const [usuarioParaExibir, setUsuarioParaExibir] = useState<Usuario | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState(""); // Campo para nova senha

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);

  const { loggedInAdmin, logoutAdmin } = useAuth(); // 2. Precisamos do logoutAdmin
  const router = useRouter();
  const params = useParams();
  const usuarioIdUrl = params.id as string;

  useEffect(() => {
    if (!usuarioIdUrl || !loggedInAdmin) {
      if (!loggedInAdmin) {
        setError("Acesso negado. Você precisa estar logado.");
      }
      setIsLoading(false);
      return;
    }

    const fetchUsuario = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Usuario>(`/usuario/${usuarioIdUrl}`);
        const usuarioDaApi = response.data;

        setUsuarioParaExibir(usuarioDaApi);
        setNome(usuarioDaApi.nome);
        setEmail(usuarioDaApi.email);
        
        // Não definimos a senha vinda da API por segurança
        setSenha(""); 

        if (loggedInAdmin.id === usuarioDaApi.id) {
          setCanEdit(true);
        } else {
          setCanEdit(false);
        }

      } catch (err: any) {
        console.error("Erro ao carregar dados do usuário:", err);
        setError("Não foi possível carregar os dados. O usuário pode não existir.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuario();
  }, [usuarioIdUrl, loggedInAdmin]);

  const handleUpdateUsuario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canEdit) {
      setError("Você não tem permissão para realizar esta ação.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Envia a senha apenas se ela for preenchida
    const data: Partial<Usuario> = {
      id: usuarioParaExibir?.id,
      nome,
      email,
      tipo: usuarioParaExibir?.tipo
    };
    if (senha) {
      data.senha = senha;
    }

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

  // 3. Lógica de exclusão copiada e adaptada
  const handleDeleteUsuario = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este usuário? Esta ação não pode ser desfeita.")) return;
    try {
      await api.delete(`/usuario/${id}`);
      
      // Se o usuário excluiu a própria conta, faz o logout e redireciona
      if (loggedInAdmin && Number(loggedInAdmin.id) === Number(id)) {
        alert("Sua conta foi excluída. Você será desconectado.");
        logoutAdmin(); // Limpa o estado de autenticação
        router.push('/login'); // Redireciona para a página de login
      }
    } catch (error: any) {
      console.error("Erro ao excluir o usuário:", error.response?.data ?? error.message);
      const errorMessage = error.response?.data?.message || "Erro ao excluir o usuário!";
      alert(errorMessage);
    }
  };


  if (isLoading) {
    return <div className="page-container center-content"><p>Carregando perfil...</p></div>;
  }

  if (error && !usuarioParaExibir) {
    return (
      <div className="page-container center-content">
        <p style={{ color: 'red' }}>{error}</p>
        <Link href="/usuario" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Voltar para a Lista
        </Link>
      </div>
    );
  }

  if (!usuarioParaExibir) {
    return (
      <div className="page-container center-content">
        <p>Usuário não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="editor-form-card" style={{ maxWidth: '700px' }}>
        <div className="form-header">
          <h3>{canEdit ? "Editar Meu Perfil" : `Visualizando Perfil de ${usuarioParaExibir.nome}`}</h3>
          <Link href="/usuario" className="btn btn-outline btn-sm">Voltar</Link>
        </div>

        {!canEdit && (
          <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', color: '#555', textAlign: 'center', margin: '0 1rem 1rem', borderRadius: '8px' }}>
            <p>Este é o perfil de outro usuário. A edição não é permitida.</p>
          </div>
        )}

        {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleUpdateUsuario} className="display-section">
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
                    disabled={!canEdit || isLoading}
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
                    disabled={!canEdit || isLoading}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row"><label htmlFor="senha" className="form-label">Nova Senha</label></th>
                <td>
                  <input
                    type="password"
                    id="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Deixe em branco para não alterar"
                    className="input-edit-mode"
                    disabled={!canEdit || isLoading}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {canEdit && (
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
              
              {/* 4. Botão de exclusão adicionado e ligado à nova função */}
              <button
                type="button"
                className="btn btn-danger"
                disabled={isLoading}
                onClick={() => handleDeleteUsuario(usuarioParaExibir.id)}
                style={{ marginLeft: "0.5rem" }}
              >
                <Trash2 size={16} className="mr-2" />
                Excluir Conta
              </button>
            </div>
          )}
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