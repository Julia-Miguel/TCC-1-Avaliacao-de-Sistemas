'use client';

import { useState, Suspense } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../globals.css";
import "../../responsividade.css";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";
import { useAuth } from "@/contexts/AuthContext"; // 1. Importar o useAuth

function CreateUsuarioContent() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 2. Obter os dados do administrador logado
  const { loggedInAdmin } = useAuth();

  const handleNewUsuario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Verificação de segurança adicional
    if (!loggedInAdmin?.empresaId) {
        setError("Não foi possível identificar a sua empresa. Por favor, faça login novamente.");
        return;
    }

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    if (senha.length < 6) {
        setError("A senha deve ter no mínimo 6 caracteres.");
        return;
    }
    
    setIsLoading(true);

    // 3. Adicionar o 'empresaId' do admin logado aos dados enviados
    const data = { 
      nome, 
      email, 
      senha, 
      tipo: 'ADMIN_EMPRESA',
      empresaId: loggedInAdmin.empresaId 
    };

    try {
      await api.post("/usuario", data);
      alert("Novo administrador cadastrado com sucesso!");
      router.push("/usuario");
    } catch (err: any) {
      console.error("Erro ao cadastrar usuário:", err.response?.data ?? err.message);
      setError(err.response?.data?.message ?? "Erro ao cadastrar o usuário!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setError(null);
  }

  return (
    <div className="page-container">
      <div className="editor-form-card" style={{maxWidth: '700px'}}>
        <div className="form-header">
          <h3>Criar Novo Administrador</h3>
          <Link href="/usuario" className="btn btn-outline btn-sm">Voltar</Link>
        </div>
        
        <form onSubmit={handleNewUsuario} className="display-section">
          {error && <p className="text-sm text-center text-error bg-red-50 dark:bg-red-700/10 p-3 rounded-md border border-error mb-4">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="nome" className="form-label">Nome</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="input-edit-mode"
              placeholder="Nome do novo administrador"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-edit-mode"
              placeholder="email@empresa.com"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha" className="form-label">Senha Provisória</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
              className="input-edit-mode"
              placeholder="Mínimo de 6 caracteres"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={handleResetForm} className="btn btn-secondary" disabled={isLoading}>
              Limpar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar Administrador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateUsuarioPage() {
  return (
    <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
      <AdminAuthGuard>
        <CreateUsuarioContent />
      </AdminAuthGuard>
    </Suspense>
  );
}