// frontend/src/app/questionarios/create/page.tsx (VERSÃO UNIFICADA)
'use client';

import { useState, Suspense } from "react"; // Adicionado Suspense
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import api from "@/services/api";
import { useRouter } from "next/navigation";
import "../../globals.css"; // Caminho para o globals.css
import "../../questionario.css"; // Seu CSS específico para questionários
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link"; // Para o botão Voltar

// Componente com o conteúdo da página de criação
function CreateQuestionarioContent() {
  const [titulo, setTitulo] = useState("");
  const router = useRouter();
  const { loggedInAdmin } = useAuth(); // Pega o admin logado do contexto
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleNewQuestionario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!titulo.trim()) {
      setError("O título não pode estar vazio.");
      return;
    }
    if (!loggedInAdmin) {
      setError("Você precisa estar logado como administrador para criar um questionário.");
      // O AdminAuthGuard já deve ter prevenido isso, mas é uma segurança extra.
      return;
    }

    setIsLoading(true);
    // O backend agora pega o criadorId do token (via req.user.usuarioId),
    // então só precisamos enviar o título.
    const data = {
      titulo: titulo.trim(),
    };

    try {
      await api.post("/questionarios", data); // O token já é enviado pelo interceptor
      alert("Questionário cadastrado com sucesso!");
      router.push("/questionarios"); // Redireciona para a lista após o sucesso
    } catch (err: any) {
      console.error("Erro no frontend ao cadastrar questionário:", err.response?.data || err.message);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao cadastrar o questionário!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTitulo("");
    setError(null);
  }

  return (
    // Usando as classes de estilização que definimos no globals.css
    // A classe 'Create' do seu CSS original pode ser mapeada para 'editor-form-card' ou uma nova.
    // Vou usar a estrutura do editor-form-card para consistência.
    <div className="page-container"> {/* Para centralizar e dar padding */}
      <div className="editor-form-card" style={{maxWidth: '700px'}}> {/* Card do formulário */}
        <div className="form-header">
            <h3>Cadastro de Novo Questionário</h3>
            {/* Pode adicionar botões de ação no header aqui se quiser */}
        </div>
        
        <form onSubmit={handleNewQuestionario} className="display-section"> {/* display-section para padding */}
          {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
          
          <div className="form-group"> {/* Do seu CSS original, ou use o novo .form-label + input */}
            <label htmlFor="titulo" className="form-label">Título do Questionário</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              minLength={3}
              placeholder="Digite o título do questionário"
              className="input-edit-mode title-input" // Sua classe ou a global para inputs
              disabled={isLoading}
            />
          </div>
          <div className="form-header-actions" style={{ justifyContent: 'flex-start', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)'}}>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
            <button type="button" onClick={handleReset} className="btn btn-secondary" disabled={isLoading}>
              Limpar
            </button>
            <Link href="/questionarios" className="btn btn-outline"> {/* Usando btn-outline para Voltar */}
                Cancelar / Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente de página que exportamos como padrão
export default function CreateQuestionarioPage() {
  return (
    // Suspense pode não ser estritamente necessário aqui se CreateQuestionarioContent não usar useSearchParams
    // mas não prejudica.
    <Suspense fallback={<div className="page-container center-content"><p>Carregando...</p></div>}>
      <AdminAuthGuard>
        <CreateQuestionarioContent />
      </AdminAuthGuard>
    </Suspense>
  );
}