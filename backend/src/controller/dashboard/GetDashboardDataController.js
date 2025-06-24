// backend/src/controller/dashboard/GetDashboardDataController.js
import { prisma } from '../../database/client.js';

export class GetDashboardDataController {
    async handle(request, response) {
        const { empresaId } = request.user;
        const { questionarioId } = request.query;

        try {
            // Monta o filtro base que sempre será aplicado (pertencer à empresa)
            const baseWhere = {
                questionario: {
                    criador: {
                        empresaId: parseInt(empresaId)
                    }
                }
            };

            // Se um questionarioId for fornecido, adiciona ao filtro
            if (questionarioId) {
                baseWhere.questionarioId = parseInt(questionarioId);
            }

            // --- 1. Cálculo de KPIs ---
            const totalAvaliacoes = await prisma.avaliacao.count({ where: baseWhere });
            const avaliacoesComRespostas = await prisma.usuAval.findMany({
                where: { avaliacao: baseWhere },
                select: { isFinalizado: true }
            });

            const totalRespondentes = avaliacoesComRespostas.length;
            const totalFinalizados = avaliacoesComRespostas.filter(r => r.isFinalizado).length;
            const taxaDeConclusao = totalRespondentes > 0 ? (totalFinalizados / totalRespondentes) * 100 : 0;

            // --- 2. Agregação para Gráficos de Múltipla Escolha ---
            const respostasMultiplaEscolha = await prisma.resposta.findMany({
                where: {
                    usuAval: { avaliacao: baseWhere },
                    pergunta: { tipos: 'MULTIPLA_ESCOLHA' }
                },
                select: {
                    resposta: true,
                    pergunta: {
                        select: {
                            id: true,
                            enunciado: true
                        }
                    }
                }
            });

            const dadosGraficos = respostasMultiplaEscolha.reduce((acc, current) => {
                const { pergunta, resposta } = current;
                if (!acc[pergunta.id]) {
                    acc[pergunta.id] = {
                        perguntaId: pergunta.id,
                        enunciado: pergunta.enunciado,
                        respostas: {}
                    };
                }
                acc[pergunta.id].respostas[resposta] = (acc[pergunta.id].respostas[resposta] || 0) + 1;
                return acc;
            }, {});

            // Formata os dados para o formato que o Recharts espera
            const dadosGraficosFormatados = Object.values(dadosGraficos).map(p => ({
                ...p,
                respostas: Object.entries(p.respostas).map(([name, value]) => ({ name, value }))
            }));


            // --- Resposta Final ---
            const dashboardData = {
                kpis: {
                    totalAvaliacoes,
                    totalRespondentes,
                    totalFinalizados,
                    taxaDeConclusao: parseFloat(taxaDeConclusao.toFixed(1))
                },
                graficos: dadosGraficosFormatados
            };

            return response.json(dashboardData);

        } catch (error) {
            console.error('[GetDashboardDataController]', error);
            return response.status(500).json({ message: "Erro ao buscar dados do dashboard." });
        }
    }
}