// frontend/src/app/questionarios/create/page.tsx
'use client';

import { useState } from "react";
import AdminAuthGuard from '@/components/auth/AdminAuthGuard'; // << IMPORTE
import api from "@/services/api";
import { useRouter } from "next/navigation";
import "../../globals.css";
import "../../questionario.css";
import { useAuth } from "@/contexts/AuthContext"; // << IMPORTE para pegar criadorId

// Componente com o conteúdo da página
function CreateQuestionarioContent() {
  const [titulo, setTitulo] = useState("");
  const router = useRouter();
  const { loggedInAdmin } = useAuth(); // << PEGUE O ADMIN LOGADO

  const handleNewQuestionario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!titulo.trim()) {
      alert("O título não pode estar vazio.");
      return;
    }
    if (!loggedInAdmin) { // Segurança adicional
        alert("Você precisa estar logado como administrador para criar um questionário.");
        return;
    }

    // AGORA USAMOS loggedInAdmin.id como criadorId
    const data = {
      titulo,
      criadorId_para_teste: loggedInAdmin.id, // No backend, isso deve ser pego de req.user.id
    };

    try {
      await api.post("/questionarios", data); // O token já é enviado pelo interceptor
      router.push("/questionarios");
    } catch (error: any) {
      console.error("Erro no frontend:", error.response?.data ?? error.message);
      alert("Erro ao cadastrar o questionário!");
    }
  };

  return (
    <div className="create-container">
      <h3>Cadastro de Questionário</h3>
      <form onSubmit={handleNewQuestionario} className="form">
        <div className="form-group">
          <label htmlFor="titulo">Título do Questionário</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            minLength={3}
            placeholder="Digite o título do questionário"
            className="input-edit-mode" // Use seus estilos
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn-primary">Cadastrar</button>
          <button type="reset" className="btn-secondary">Limpar</button>
        </div>
      </form>
    </div>
  );
}

// Componente de página que exportamos como padrão
export default function CreateQuestionarioPage() {
  return (
    <AdminAuthGuard>
      <CreateQuestionarioContent />
    </AdminAuthGuard>
  );
}