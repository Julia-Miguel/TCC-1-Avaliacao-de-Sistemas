// backend/src/controller/dashboard/GetDashboardDataController.js
import { prisma } from '../../database/client.js';

export class GetDashboardDataController {
    async handle(request, response) {
        const { empresaId } = request.user;

        try {
            // --- Global KPIs for the entire company ---
            const globalTotalQuestionarios = await prisma.questionario.count({
                where: { criador: { empresaId: parseInt(empresaId) } }
            });

            // Adicione esta linha para definir globalTotalAvaliacoes
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

            // --- Most Recently Updated Questionario for the company ---
            const mostRecentQuestionario = await prisma.questionario.findFirst({
                where: {
                    criador: {
                        empresaId: parseInt(empresaId)
                    }
                },
                orderBy: { updated_at: 'desc' }, // Order by most recent update
                include: {
                    _count: { select: { avaliacoes: true } },
                    perguntas: { // Get related questions to identify text types
                        where: {
                            pergunta: { tipos: 'TEXTO' }
                        },
                        select: {
                            pergunta: {
                                select: { id: true, enunciado: true, tipos: true }
                            }
                        }
                    }
                }
            });

            let specificQuestionnaireData = null;
            if (mostRecentQuestionario) {
                const recentQuestionarioId = mostRecentQuestionario.id;

                // --- KPIs specific to the most recent questionnaire ---
                const specificAvaliacoesCount = await prisma.avaliacao.count({
                    where: { questionarioId: recentQuestionarioId }
                });

                const specificUsuAvalRecords = await prisma.usuAval.findMany({
                    where: { avaliacao: { questionarioId: recentQuestionarioId } },
                    select: { isFinalizado: true }
                });

                const specificTotalRespondentes = specificUsuAvalRecords.length;
                const specificTotalFinalizados = specificUsuAvalRecords.filter(r => r.isFinalizado).length;
                const specificTaxaDeConclusao = specificTotalRespondentes > 0 ? (specificTotalFinalizados / specificTotalRespondentes) * 100 : 0;

                // --- Aggregated data for charts (multiple choice) specific to the most recent questionnaire ---
                const specificRespostasMultiplaEscolha = await prisma.resposta.findMany({
                    where: {
                        usuAval: { avaliacao: { questionarioId: recentQuestionarioId } },
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

                specificQuestionnaireData = {
                    info: {
                        id: mostRecentQuestionario.id,
                        titulo: mostRecentQuestionario.titulo,
                        avaliacoesCount: mostRecentQuestionario._count.avaliacoes,
                        updated_at: mostRecentQuestionario.updated_at,
                        textQuestions: mostRecentQuestionario.perguntas.map(qp => qp.pergunta)
                    },
                    kpis: {
                        totalAvaliacoes: specificAvaliacoesCount,
                        totalRespondentes: specificTotalRespondentes,
                        totalFinalizados: specificTotalFinalizados,
                        taxaDeConclusao: parseFloat(specificTaxaDeConclusao.toFixed(1))
                    },
                    graficos: specificDadosGraficosFormatados
                };
            }


            // --- Final Response Structure ---
            return response.json({
                globalKpis: {
                    totalAvaliacoes: globalTotalAvaliacoes, // Agora globalTotalAvaliacoes está definido
                    totalRespondentes: globalTotalRespondentes,
                    totalFinalizados: globalTotalFinalizados,
                    taxaDeConclusao: parseFloat(globalTaxaDeConclusao.toFixed(1)),
                    totalQuestionarios: globalTotalQuestionarios
                },
                latestQuestionnaire: specificQuestionnaireData
            });

        } catch (error) {
            console.error('[GetDashboardDataController]', error);
            return response.status(500).json({ message: "Erro ao buscar dados do dashboard." });
        }
    }
}