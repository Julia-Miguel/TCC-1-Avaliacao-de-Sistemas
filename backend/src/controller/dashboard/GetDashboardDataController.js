// backend/src/controller/dashboard/GetDashboardDataController.js

import { prisma } from '../../database/client.js';

export class GetDashboardDataController {
    async handle(request, response) {
        const { empresaId } = request.user;
        const { questionarioId } = request.query;

        try {
            // --- Global KPIs for the entire company ---
            const globalTotalQuestionarios = await prisma.questionario.count({
                where: { criador: { empresaId: parseInt(empresaId) } }
            });

            const globalTotalAvaliacoes = await prisma.avaliacao.count({
                where: {
                    questionario: {
                        criador: { empresaId: parseInt(empresaId) }
                    }
                }
            });

            const globalAvaliacoesComRespostas = await prisma.usuAval.findMany({
                where: {
                    avaliacao: {
                        questionario: {
                            criador: { empresaId: parseInt(empresaId) }
                        }
                    }
                },
                select: { isFinalizado: true }
            });

            const globalTotalRespondentes = globalAvaliacoesComRespostas.length;
            const globalTotalFinalizados = globalAvaliacoesComRespostas.filter(r => r.isFinalizado).length;
            const globalTaxaDeConclusao = globalTotalRespondentes > 0 ? (globalTotalFinalizados / globalTotalRespondentes) * 100 : 0;

            // --- Determine the target questionnaire for specific data ---
            let targetQuestionario = null;
            if (questionarioId) {
                targetQuestionario = await prisma.questionario.findUnique({
                    where: {
                        id: parseInt(questionarioId)
                    },
                    include: {
                        _count: { select: { avaliacoes: true } }
                    }
                });

                if (targetQuestionario && targetQuestionario.criadorId !== parseInt(empresaId)) {
                    targetQuestionario = null;
                }
            } else {
                targetQuestionario = await prisma.questionario.findFirst({
                    where: {
                        criador: {
                            empresaId: parseInt(empresaId)
                        }
                    },
                    orderBy: { updated_at: 'desc' },
                    include: {
                        _count: { select: { avaliacoes: true } }
                    }
                });
            }


            let specificQuestionnaireData = null;
            if (targetQuestionario) {
                const currentQuestionarioId = targetQuestionario.id;

                // --- KPIs specific to the target questionnaire ---
                const specificAvaliacoesCount = await prisma.avaliacao.count({
                    where: { questionarioId: currentQuestionarioId }
                });

                const specificUsuAvalRecords = await prisma.usuAval.findMany({
                    where: { avaliacao: { questionarioId: currentQuestionarioId } },
                    select: { isFinalizado: true }
                });

                const specificTotalRespondentes = specificUsuAvalRecords.length;
                const specificTotalFinalizados = specificUsuAvalRecords.filter(r => r.isFinalizado).length;
                const specificTaxaDeConclusao = specificTotalRespondentes > 0 ? (specificTotalFinalizados / specificTotalRespondentes) * 100 : 0;

                // --- Aggregated data for charts (multiple choice) specific to the target questionnaire ---
                const specificRespostasMultiplaEscolha = await prisma.resposta.findMany({
                    where: {
                        usuAval: { avaliacao: { questionarioId: currentQuestionarioId } },
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

                const specificDadosGraficos = specificRespostasMultiplaEscolha.reduce((acc, current) => {
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

                const specificDadosGraficosFormatados = Object.values(specificDadosGraficos).map(p => ({
                    ...p,
                    respostas: Object.entries(p.respostas).map(([name, value]) => ({ name, value }))
                }));

                const textQuestionsData = await prisma.quePerg.findMany({
                    where: {
                        questionarioId: currentQuestionarioId,
                        pergunta: {
                            tipos: 'TEXTO'
                        }
                    },
                    select: {
                        pergunta: {
                            select: {
                                id: true,
                                enunciado: true,
                                tipos: true
                            }
                        }
                    }
                });
                const textQuestions = textQuestionsData.map(qp => qp.pergunta);

                // NOVO: Agregação de todas as respostas de múltipla escolha para um gráfico geral
                const allMultiChoiceResponses = await prisma.resposta.findMany({
                    where: {
                        usuAval: { avaliacao: { questionarioId: currentQuestionarioId } },
                        pergunta: { tipos: 'MULTIPLA_ESCOLHA' }
                    },
                    select: {
                        resposta: true // Precisamos apenas do texto da resposta
                    }
                });

                const overallDistribution = allMultiChoiceResponses.reduce((acc, current) => {
                    acc[current.resposta] = (acc[current.resposta] || 0) + 1;
                    return acc;
                }, {});

                // Formatar para o gráfico (ex: { name: 'Muito Satisfeito', value: 100 })
                const overallDistributionFormatted = Object.entries(overallDistribution).map(([name, value]) => ({ name, value }));
                // FIM NOVO

                specificQuestionnaireData = {
                    info: {
                        id: targetQuestionario.id,
                        titulo: targetQuestionario.titulo,
                        avaliacoesCount: targetQuestionario._count.avaliacoes,
                        updated_at: targetQuestionario.updated_at,
                        textQuestions: textQuestions
                    },
                    kpis: {
                        totalAvaliacoes: specificAvaliacoesCount,
                        totalRespondentes: specificTotalRespondentes,
                        totalFinalizados: specificTotalFinalizados,
                        taxaDeConclusao: parseFloat(specificTaxaDeConclusao.toFixed(1))
                    },
                    graficos: specificDadosGraficosFormatados,
                    overallMultiChoiceDistribution: overallDistributionFormatted // NOVO: Adiciona ao objeto de resposta
                };
            }


            // --- Final Response Structure ---
            return response.json({
                globalKpis: {
                    totalAvaliacoes: globalTotalAvaliacoes,
                    totalRespondentes: globalTotalRespondentes,
                    totalFinalizados: globalTotalFinalizados,
                    taxaDeConclusao: parseFloat(globalTaxaDeConclusao.toFixed(1)),
                    totalQuestionarios: globalTotalQuestionarios
                },
                latestQuestionnaire: specificQuestionnaireData
            });

        } catch (error) {
            console.error('[GetDashboardDataController]', error);
            if (error.name === 'PrismaClientValidationError') {
                 console.error("PrismaClientValidationError details:", error.message);
            }
            return response.status(500).json({ message: "Erro ao buscar dados do dashboard." });
        }
    }
}