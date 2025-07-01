// frontend/src/app/page.tsx (VERSÃO CORRETA E PROTEGIDA)
'use client';

import Link from "next/link";
import { CheckSquare, Users, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import AdminAuthGuard from '@/components/auth/AdminAuthGuard';
import "./globals.css";

// Dados mock para os cards
const summaryCardsData = [
    {
        title: "Avaliações Concluídas",
        value: "152",
        change: "+15%",
        changeType: "positive" as "positive" | "negative",
        icon: CheckSquare,
        color: "text-green-500 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-700/30",
        detailsLink: "/avaliacao?status=concluido",
    },
    {
        title: "Usuários Ativos",
        value: "48",
        change: "+3",
        changeType: "positive" as "positive" | "negative",
        icon: Users,
        color: "text-blue-500 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-700/30",
        detailsLink: "/usuario",
    },
    {
        title: "Questionários Disponíveis",
        value: "12",
        change: "",
        changeType: "neutral" as "positive" | "negative" | "neutral",
        icon: FileText,
        color: "text-indigo-500 dark:text-indigo-400",
        bgColor: "bg-indigo-50 dark:bg-indigo-700/30",
        detailsLink: "/questionarios",
    },
    {
        title: "Engajamento Médio",
        value: "85%",
        change: "-2%",
        changeType: "negative" as "positive" | "negative",
        icon: TrendingUp,
        color: "text-red-500 dark:text-red-400",
        bgColor: "bg-red-50 dark:bg-red-700/30",
        detailsLink: "#",
    },
];

// Componente que contém o layout do seu dashboard
function HomePageDashboardContent() {
    // Você pode usar os dados do admin aqui se precisar

    return (
        <div className="page-container">
            {/* Cabeçalho da Página do Dashboard */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard de Avaliações</h1>
                <p className="text-text-muted mt-1">
                    Visão geral do sistema de avaliações e desempenho.
                </p>
            </div>

            {/* Seção de Sumário com Cards */}
            <section className="mb-10">
                <h2 className="text-xl font-semibold text-foreground mb-4">Sumário Rápido</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {summaryCardsData.map((card) => (
                        <Link href={card.detailsLink || "#"} key={card.detailsLink || card.title} className="block group">
                            <div className="bg-element-bg p-5 rounded-xl shadow-md border border-main-border hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                                <div className="flex items-start justify-between">
                                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                        <card.icon size={24} className={card.color} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <h3 className="text-lg font-semibold text-text-base">{card.value}</h3>
                                    <p className="text-sm text-text-muted mt-1">{card.title}</p>
                                </div>
                                {card.change && (
                                    <div className="mt-auto pt-3 text-xs">
                                        {(() => {
                                            let changeClass = '';
                                            if (card.changeType === 'positive') {
                                                changeClass = 'text-green-600 dark:text-green-400';
                                            } else if (card.changeType === 'negative') {
                                                changeClass = 'text-red-600 dark:text-red-400';
                                            } else {
                                                changeClass = 'text-text-muted';
                                            }
                                            return (
                                                <span className={`font-medium ${changeClass}`}>
                                                    {card.change}
                                                </span>
                                            );
                                        })()}
                                        <span className="text-text-muted"> em relação ao período anterior</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Seção Placeholder para "Todas as Avaliações" */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Avaliações Recentes</h2>
                    <Link href="/avaliacao" className="btn btn-primary btn-sm">
                        Ver Todas
                    </Link>
                </div>
                <div className="bg-element-bg p-5 rounded-xl shadow-md border border-main-border">
                    <div className="text-center py-8">
                        <AlertCircle size={40} className="text-text-muted mx-auto" strokeWidth={1.5}/>
                        <p className="mt-4 text-text-muted">
                            Área para exibir uma tabela ou lista de avaliações recentes.
                        </p>
                        <p className="text-sm text-text-muted">
                            (Implementação da tabela de avaliações pode ser feita aqui)
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Componente principal que exportamos, aplicando a proteção
export default function ProtectedHomePageDashboard() {
    return (
        <AdminAuthGuard>
            <HomePageDashboardContent />
        </AdminAuthGuard>
    );
}