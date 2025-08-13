// frontend\src\app\usuario\page.tsx

'use client';

import { useEffect, useState, Suspense } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";

// Hooks e Componentes de Autenticação
import { useAuth } from "@/contexts/AuthContext";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";

// Ícones para uma UI mais rica
import { PlusIcon, Edit3, Trash2, Users, ExternalLink } from 'lucide-react';

// --- Interfaces ---
interface UsuarioInterface {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  created_at: string;
  updated_at: string;
  token: string; // Usado para a rota de atualização
}

function ListUsuarioContent() {
  const [usuarios, setUsuarios] = useState<UsuarioInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook para obter o usuário logado para a lógica de permissões
  const { loggedInAdmin, logoutAdmin } = useAuth();

  useEffect(() => {
    const fetchUsuarios = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get("/usuario");
        setUsuarios(response.data.usuarios || response.data);
      } catch (err: any) {
        console.error("Erro ao buscar usuários:", err.response?.data ?? err.message);
        setError("Não foi possível carregar a lista de usuários.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const formatDate = (isoDate: string | null | undefined) => {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleDeleteUsuario = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este usuário? Esta ação não pode ser desfeita.")) return;
    try {
      await api.delete(`/usuario/${id}`);
      setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
      if (loggedInAdmin && Number(loggedInAdmin.id) === Number(id)) {
        alert("Sua conta foi excluída. Você será desconectado.");
        logoutAdmin();
      } else {
        alert("Usuário excluído com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro ao excluir o usuário:", error.response?.data ?? error.message);
      const errorMessage = error.response?.data?.message || "Erro ao excluir o usuário!";
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return <div className="page-container flex items-center justify-center min-h-[calc(100vh-8rem)]"><p className="text-text-muted">Carregando usuários...</p></div>;
  }
  if (error) {
    return <div className="page-container center-content"><p className="text-red-600 dark:text-red-400">{error}</p></div>;
  }

  return (
    <div className="page-container">
      {/* Cabeçalho da Página */}
      <div className="table-header-actions">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
          Gerenciamento de Usuários
        </h3>
        <div className="button-group flex items-center gap-2">
          <Link href="/usuario/create" className="btn btn-primary inline-flex items-center">
            <PlusIcon size={18} className="mr-2" />
            Novo Usuário
          </Link>
          <Link href="/dashboard" className="btn btn-outline">
            Voltar
          </Link>
        </div>
      </div>

      {/* Estado de "Nenhum Usuário" */}
      {usuarios.length === 0 && !isLoading ? (
        <div className="text-center py-10 px-4 bg-card-background dark:bg-gray-800 rounded-lg shadow-md border border-border mt-6">
          <Users className="mx-auto h-12 w-12 text-text-muted" strokeWidth={1.5} />
          <h3 className="mt-4 text-md font-medium text-foreground">Nenhum usuário encontrado</h3>
          <p className="mt-1 text-sm text-text-muted">Crie um novo usuário para começar.</p>
          <div className="mt-6">
            <Link href="/usuario/create" className="btn btn-primary inline-flex items-center">
              <PlusIcon size={18} className="mr-2" />
              Criar Usuário
            </Link>
          </div>
        </div>
      ) : (
        // Tabela de Usuários
        <div className="overflow-x-auto bg-card-background rounded-lg shadow-md border border-border">
          <table className="min-w-full responsive-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Criado em</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => {
                // Lógica para determinar se o usuário logado é o dono da linha
                const isOwner = loggedInAdmin && Number(loggedInAdmin.id) === Number(usuario.id);

                return (
                  <tr key={usuario.id}>
                    <td data-label="ID">{usuario.id}</td>
                    <td data-label="Nome">{usuario.nome}</td>
                    <td data-label="Email">{usuario.email}</td>
                    <td data-label="Tipo">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${usuario.tipo.includes('ADMIN')
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-700/30 dark:text-purple-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300'
                        }`}>
                        {usuario.tipo.replace('_', ' ')}
                      </span>
                    </td>
                    <td data-label="Criado em">{formatDate(usuario.created_at)}</td>
                    <td data-label="Ações" className="text-right whitespace-nowrap space-x-1">
                      {isOwner ? (
                        // Botões para o próprio usuário
                        <>
                          <Link href={`/usuario/update/${usuario.token}`} className="btn btn-sm btn-outline p-1.5 inline-flex items-center" title="Editar Perfil">
                            <Edit3 size={14} />
                          </Link>
                          <button onClick={() => handleDeleteUsuario(usuario.id)} className="btn btn-sm btn-danger p-1.5 inline-flex items-center" title="Excluir Conta">
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        // Nenhum botão para outros usuários
                        null
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ProtectedListUsuarioPage() {
  return (
    <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
      <AdminAuthGuard>
        <ListUsuarioContent />
      </AdminAuthGuard>
    </Suspense>
  );
}
