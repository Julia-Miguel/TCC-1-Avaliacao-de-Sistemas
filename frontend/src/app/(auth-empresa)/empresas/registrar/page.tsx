// frontend/src/app/empresas/registrar/page.tsx
'use client';

import { useState } from "react";
import api from "@/services/api"; // Ajuste o caminho se o seu api.ts estiver em local diferente
import { useRouter } from "next/navigation";
import Link from "next/link";
// Se você tiver um globals.css ou um CSS específico para formulários, importe-o
import '../../../globals.css'; 

export default function RegistrarEmpresaPage() {
  const [nome, setNome] = useState("");
  const [emailResponsavel, setEmailResponsavel] = useState("");
  const [senhaEmpresa, setSenhaEmpresa] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); // Limpa erros anteriores

    if (senhaEmpresa !== confirmaSenha) {
      setError("As senhas não coincidem!");
      return;
    }

    if (senhaEmpresa.length < 6) { // Exemplo de validação simples de senha
        setError("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    setIsLoading(true);

    try {
      await api.post("/empresas/register", {
        nome,
        emailResponsavel,
        senhaEmpresa,
      });
      alert("Empresa registrada com sucesso!");
      // Redireciona para a página de login da empresa ou outra página de sucesso
      router.push("/empresas/login"); 
    } catch (err: any) {
      console.error("Erro ao registrar empresa:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ocorreu um erro desconhecido ao tentar registrar a empresa.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container"> {/* Use sua classe de container principal */}
      <div className="editor-form-card"> {/* Reutilizando o estilo do card */}
        <div className="form-header">
          <h3>Registrar Nova Empresa</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="display-section"> {/* Reutilizando padding */}
          {error && <p className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
          
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="nome-empresa">Nome da Empresa</label>
            <input
              id="nome-empresa"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="input-edit-mode" // Reutilizando estilo de input
              placeholder="Ex: Hospital Central"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="email-responsavel">Email do Responsável</label>
            <input
              id="email-responsavel"
              type="email"
              value={emailResponsavel}
              onChange={(e) => setEmailResponsavel(e.target.value)}
              required
              className="input-edit-mode"
              placeholder="Ex: contato@hospital.com"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="senha-empresa">Senha da Empresa</label>
            <input
              id="senha-empresa"
              type="password"
              value={senhaEmpresa}
              onChange={(e) => setSenhaEmpresa(e.target.value)}
              required
              minLength={6}
              className="input-edit-mode"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirma-senha">Confirmar Senha</label>
            <input
              id="confirma-senha"
              type="password"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              required
              className="input-edit-mode"
            />
          </div>

          <div className="form-header-actions" style={{ justifyContent: 'flex-start' }}>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar Empresa"}
            </button>
            <Link href="/" className="btn-secondary">
                Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}