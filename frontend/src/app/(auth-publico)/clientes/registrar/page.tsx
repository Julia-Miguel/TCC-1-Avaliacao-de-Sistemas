// frontend/src/app/(auth-publico)/clientes/registrar/page.tsx
'use client';

import { useState, Suspense } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ApplicationLogo from '@/components/ApplicationLogo'; // Opcional

// Definindo a interface para o que esperamos do backend ao registrar
interface ClienteRegistrado {
    id: number;
    nome?: string | null;
    email: string;
    tipo: 'CLIENTE_PLATAFORMA';
}

function RegistrarClienteForm() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        if (senha !== confirmaSenha) {
            setError("As senhas não coincidem!");
            return;
        }
        if (senha.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }
        // Adicione mais validações se necessário (ex: formato do email)

        setIsLoading(true);

        try {
            const payload = {
                nome: nome.trim() || null, // Envia null se o nome estiver vazio
                email: email.trim(),
                senha,
            };
            // A rota no backend deve ser POST /clientes/register (ou /usuarios/register-cliente)
            await api.post<ClienteRegistrado>('/clientes/register', payload);

            alert("Cadastro realizado com sucesso! Você será redirecionado para o login.");
            router.push('/clientes/login');

        } catch (err: any) {
            console.error('Erro ao registrar cliente:', err.response?.data || err.message);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Ocorreu um erro desconhecido ao tentar registrar.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex justify-center mb-6">
                <Link href="/">
                    <ApplicationLogo className="w-12 h-12 text-primary" />
                </Link>
            </div>
            <h3 className="text-center text-xl sm:text-2xl font-semibold text-foreground mb-6">
                Criar Conta de Cliente
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <p className="text-sm text-center text-error bg-red-50 dark:bg-red-700/10 p-3 rounded-md border border-error">
                        {error}
                    </p>
                )}

                <div className="form-group">
                    <label htmlFor="cliente-nome" className="form-label">Nome (Opcional)</label>
                    <input
                        id="cliente-nome"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="input-edit-mode" // Reutilize estilos de input do globals.css
                        placeholder="Seu nome completo"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cliente-email" className="form-label">Email</label>
                    <input
                        id="cliente-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-edit-mode"
                        placeholder="seu.email@exemplo.com"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cliente-senha" className="form-label">Senha</label>
                    <input
                        id="cliente-senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        minLength={6}
                        className="input-edit-mode"
                        placeholder="Mínimo 6 caracteres"
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cliente-confirma-senha" className="form-label">Confirmar Senha</label>
                    <input
                        id="cliente-confirma-senha"
                        type="password"
                        value={confirmaSenha}
                        onChange={(e) => setConfirmaSenha(e.target.value)}
                        required
                        className="input-edit-mode"
                        placeholder="Repita sua senha"
                        disabled={isLoading}
                    />
                </div>

                <div className="pt-2 space-y-4">
                    <button
                        type="submit"
                        className="btn btn-primary w-full py-2.5 text-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? "Registrando..." : "Criar Conta"}
                    </button>
                    <p className="text-center text-sm text-text-muted">
                        Já tem uma conta?{' '}
                        <Link href="/clientes/login" className="font-medium text-primary hover:underline">
                            Faça Login
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
}

export default function RegistrarClientePage() {
    return (
        // Suspense é uma boa prática se LoginForm usar hooks como useSearchParams,
        // mas para este formulário simples, pode não ser estritamente necessário.
        // Mantendo por consistência se você adicionar hooks que o exijam.
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-text-muted">Carregando...</p>
            </div>
        }>
            <RegistrarClienteForm />
        </Suspense>
    );
}
