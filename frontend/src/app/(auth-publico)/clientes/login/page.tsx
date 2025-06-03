// frontend/src/app/(auth-publico)/clientes/login/page.tsx
'use client';

import { useState, Suspense, useEffect } from 'react';
import api from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation'; // useSearchParams para pegar redirectTo
import Link from 'next/link';
import ApplicationLogo from '@/components/ApplicationLogo'; // Opcional

// Se o seu globals.css não for importado automaticamente pelo layout do grupo (auth-publico),
// você pode precisar importá-lo aqui.
// import '../../../globals.css'; 

interface ClienteLogado {
    id: number;
    nome?: string | null;
    email: string;
    tipo: 'CLIENTE_PLATAFORMA';
    // Adicione outros campos que sua API retorna para o cliente
}

function LoginClienteForm() {
    const router = useRouter();
    const searchParams = useSearchParams(); // Para pegar o redirectTo da URL
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [redirectTo, setRedirectTo] = useState<string | null>(null);

    useEffect(() => {
        // Pega o redirectTo da URL, se existir (ex: vindo de uma tentativa de acesso a uma avaliação protegida)
        const redirectToParam = searchParams.get('redirectTo');
        if (redirectToParam) {
            setRedirectTo(decodeURIComponent(redirectToParam));
        }
    }, [searchParams]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post<{ cliente: ClienteLogado, token: string }>('/clientes/login', {
                email,
                senha,
            });

            const { cliente, token } = response.data;

            // Armazenar o token e os dados do cliente com chaves DIFERENTES das do admin
            localStorage.setItem('clienteToken', token);
            localStorage.setItem('clienteUser', JSON.stringify(cliente));

            alert(`Login bem-sucedido! Bem-vindo(a), ${cliente.nome || cliente.email}!`);

            // Redirecionar para a página de destino ou para a home
            if (redirectTo) {
                router.push(redirectTo);
            } else {
                router.push('/'); // Ou uma página de dashboard do cliente, se houver
            }

        } catch (err: any) {
            console.error('Erro ao fazer login do cliente:', err.response?.data || err.message);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Ocorreu um erro desconhecido ao tentar fazer login.');
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
                Login do Cliente
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <p className="text-sm text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-md border border-red-300 dark:border-red-600">
                        {error}
                    </p>
                )}

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
                        className="input-edit-mode"
                        placeholder="Sua senha"
                        disabled={isLoading}
                    />
                </div>

                <div className="pt-2 space-y-4">
                    <button
                        type="submit"
                        className="btn btn-primary w-full py-2.5 text-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? "Entrando..." : "Entrar"}
                    </button>
                    <p className="text-center text-sm text-text-muted">
                        Não tem uma conta?{' '}
                        <Link href="/clientes/registrar" className="font-medium text-primary hover:underline">
                            Registre-se aqui
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
}

export default function LoginClientePage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[200px]">
                <p className="text-text-muted">Carregando formulário de login...</p>
            </div>
        }>
            <LoginClienteForm />
        </Suspense>
    );
}
