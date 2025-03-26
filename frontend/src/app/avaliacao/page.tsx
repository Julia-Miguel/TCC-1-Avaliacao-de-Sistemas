'use client';

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import "../globals.css";

interface AvaliacaoInterface {
    id: number;
    semestre: string;
    questionario: {
        titulo: string;
    };
    usuarios: {
        usuario: {
            nome: string;
        };
        status: string;
        isFinalizado: boolean;
    }[];
    created_at: string;
    updated_at: string;
}

export default function ListAvaliacao() {
    const [avaliacoes, setAvaliacoes] = useState<AvaliacaoInterface[]>([]);

    useEffect(() => {
        api.get("/avaliacao")
            .then(response => setAvaliacoes(response.data))
            .catch(error => {
                console.error(error);
                alert("Erro ao buscar as avaliações.");
            });
    }, []);

    const formatDate = (isoDate: string) => {
        return new Date(isoDate).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const handleDeleteAvaliacao = async (id: number) => {
        if (!window.confirm("Deseja realmente excluir esta avaliação?")) return;

        try {
            await api.delete(`/avaliacao/${id}`);
            alert("Avaliação excluída com sucesso!");
            setAvaliacoes(prev => prev.filter(avaliacao => avaliacao.id !== id));
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir a avaliação.");
        }
    };

    return (
        <div>
            <div className="center-content">
                <h3>Lista de Avaliações</h3>
                <div>
                    <Link href="/avaliacao/create">Inserir</Link>
                </div>
                <div>
                    <Link href="/">Voltar</Link>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Semestre</th>
                        <th>Questionário</th>
                        <th>Usuários</th>
                        <th>Criado</th>
                        <th>Alterado</th>
                        <th>Atualizar</th>
                        <th>Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {avaliacoes.map(avaliacao => (
                        <tr key={avaliacao.id}>
                            <td>{avaliacao.id}</td>
                            <td>{avaliacao.semestre}</td>
                            <td>{avaliacao.questionario.titulo}</td>
                            <td>
                                {avaliacao.usuarios.map(usuario => (
                                    <div key={usuario.usuario.nome}>
                                        {usuario.usuario.nome} - {usuario.status} - {usuario.isFinalizado ? "Finalizado" : "Em andamento"}
                                    </div>
                                ))}
                            </td>
                            <td>{formatDate(avaliacao.created_at)}</td>
                            <td>{formatDate(avaliacao.updated_at)}</td>
                            <td><Link href={`/avaliacao/update/${avaliacao.id}`}>Atualizar</Link></td>
                            <td>
                                <button onClick={() => handleDeleteAvaliacao(avaliacao.id)}>
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
