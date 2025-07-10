import { prisma } from '../../database/client.js';

export class GetDashboardDataController {
    async handle(request, response) {
        // ✅ CORREÇÃO: Acessando o empresaId corretamente.
        const empresaId = request.user.empresaId;
        const { questionarioId } = request.query;

        if (!empresaId) {
            return response.status(401).json({ message: "ID da empresa não encontrado no token de autenticação." });
        }

        try {
            // --- KPIs GLOBAIS (para toda a empresa) ---

            const whereGlobal = { criador: { empresaId: empresaId } };

            const globalTotalQuestionarios = await prisma.questionario.count({ where: whereGlobal });
            const globalTotalAvaliacoes = await prisma.avaliacao.count({ where: { questionario: whereGlobal } });
            
            // ✅ CORREÇÃO: Cálculo correto para KPIs globais
            const globalTotalIniciados = await prisma.usuAval.count({
                where: { avaliacao: { questionario: whereGlobal } }
            });
            const globalTotalFinalizados = await prisma.usuAval.count({
                where: { avaliacao: { questionario: whereGlobal }, isFinalizado: true }
            });
            const globalTaxaDeConclusao = globalTotalIniciados > 0 ? (globalTotalFinalizados / globalTotalIniciados) * 100 : 0;


            // --- Lógica para buscar dados de um questionário específico ---
            let targetQuestionario = null;
            if (questionarioId) {
                targetQuestionario = await prisma.questionario.findFirst({
                    where: { id: parseInt(questionarioId), criador: { empresaId: empresaId } },
                });
            } else {
                targetQuestionario = await prisma.questionario.findFirst({
                    where: { criador: { empresaId: empresaId } },
                    orderBy: { updated_at: 'desc' },
                });
            }

            let specificQuestionnaireData = null;
            if (targetQuestionario) {
                const currentQuestionarioId = targetQuestionario.id;

                // --- KPIs específicos do questionário alvo ---
                const specificAvaliacoesCount = await prisma.avaliacao.count({
                    where: { questionarioId: currentQuestionarioId }
                });

                // ✅ CORREÇÃO: Cálculo correto para KPIs específicos
                const specificTotalIniciados = await prisma.usuAval.count({
                    where: { avaliacao: { questionarioId: currentQuestionarioId } }
                });
                const specificTotalFinalizados = await prisma.usuAval.count({
                    where: { avaliacao: { questionarioId: currentQuestionarioId }, isFinalizado: true }
                });
                const specificTaxaDeConclusao = specificTotalIniciados > 0 ? (specificTotalFinalizados / specificTotalIniciados) * 100 : 0;

                // --- O resto da sua lógica para buscar dados de gráficos (mantida como está) ---
                const specificRespostasMultiplaEscolha = await prisma.resposta.findMany({
                    where: {
                        usuAval: { avaliacao: { questionarioId: currentQuestionarioId } },
                        pergunta: { tipos: 'MULTIPLA_ESCOLHA' }
                    },
                    select: {
                        resposta: true,
                        pergunta: { select: { id: true, enunciado: true } }
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

                const textQuestionsData = await prisma.pergunta.findMany({
                    where: {
                        questionarios: { some: { questionarioId: currentQuestionarioId } },
                        tipos: 'TEXTO'
                    },
                    select: { id: true, enunciado: true, tipos: true }
                });

                const allMultiChoiceResponses = await prisma.resposta.findMany({
                    where: {
                        usuAval: { avaliacao: { questionarioId: currentQuestionarioId } },
                        pergunta: { tipos: 'MULTIPLA_ESCOLHA' }
                    },
                    select: { resposta: true }
                });

                const overallDistribution = allMultiChoiceResponses.reduce((acc, current) => {
                    acc[current.resposta] = (acc[current.resposta] || 0) + 1;
                    return acc;
                }, {});

                const overallDistributionFormatted = Object.entries(overallDistribution).map(([name, value]) => ({ name, value }));

                specificQuestionnaireData = {
                    info: {
                        id: targetQuestionario.id,
                        titulo: targetQuestionario.titulo,
                        avaliacoesCount: specificAvaliacoesCount,
                        updated_at: targetQuestionario.updated_at,
                        textQuestions: textQuestionsData
                    },
                    kpis: {
                        totalAvaliacoes: specificAvaliacoesCount,
                        totalRespondentes: specificTotalIniciados, // "Respondentes" agora significa "Iniciados"
                        totalFinalizados: specificTotalFinalizados,
                        taxaDeConclusao: parseFloat(specificTaxaDeConclusao.toFixed(1))
                    },
                    graficos: specificDadosGraficosFormatados,
                    overallMultiChoiceDistribution: overallDistributionFormatted
                };
            }

            // --- Estrutura final da resposta ---
            return response.json({
                globalKpis: {
                    totalAvaliacoes: globalTotalAvaliacoes,
                    totalRespondentes: globalTotalIniciados,
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
