import { prisma } from '../../database/client.js';

export class GetDashboardDataController {
    async handle(request, response) {
        const empresaId = request.user.empresaId;
        const { questionarioId } = request.query;

        if (!empresaId) {
            return response.status(401).json({ message: "ID da empresa não encontrado no token de autenticação." });
        }

        try {
            // --- KPIs GLOBAIS (sem alterações) ---
            const whereGlobal = { criador: { empresaId: empresaId } };
            const globalTotalQuestionarios = await prisma.questionario.count({ where: whereGlobal });
            const globalTotalAvaliacoes = await prisma.avaliacao.count({ where: { questionario: whereGlobal } });
            const globalTotalIniciados = await prisma.usuAval.count({ where: { avaliacao: { questionario: whereGlobal } } });
            const globalTotalFinalizados = await prisma.usuAval.count({ where: { avaliacao: { questionario: whereGlobal }, isFinalizado: true } });
            const globalTaxaDeConclusao = globalTotalIniciados > 0 ? Math.round((globalTotalFinalizados / globalTotalIniciados) * 100) : 0;

            // --- Lógica para buscar dados de um questionário específico ---
            let targetQuestionario = null;
            if (questionarioId) {
                targetQuestionario = await prisma.questionario.findFirst({
                    where: { id: parseInt(questionarioId), criador: { empresaId: empresaId } },
                    // ✅ ADICIONADO CONTAGEM DE PERGUNTAS
                    include: { _count: { select: { avaliacoes: true, perguntas: true } } }
                });
            } else {
                targetQuestionario = await prisma.questionario.findFirst({
                    where: { criador: { empresaId: empresaId } },
                    orderBy: { updated_at: 'desc' },
                    // ✅ ADICIONADO CONTAGEM DE PERGUNTAS
                    include: { _count: { select: { avaliacoes: true, perguntas: true } } }
                });
            }

            let specificQuestionnaireData = null;
            if (targetQuestionario) {
                const currentQuestionarioId = targetQuestionario.id;
                const specificTotalIniciados = await prisma.usuAval.count({ where: { avaliacao: { questionarioId: currentQuestionarioId } } });
                const specificTotalFinalizados = await prisma.usuAval.count({ where: { avaliacao: { questionarioId: currentQuestionarioId }, isFinalizado: true } });
                const specificTaxaDeConclusao = specificTotalIniciados > 0 ? Math.round((specificTotalFinalizados / specificTotalIniciados) * 100) : 0;

                specificQuestionnaireData = {
                    info: {
                        id: targetQuestionario.id,
                        titulo: targetQuestionario.titulo,
                        avaliacoesCount: targetQuestionario._count.avaliacoes,
                        perguntasCount: targetQuestionario._count.perguntas, // ✅ NOVA INFORMAÇÃO
                        updated_at: targetQuestionario.updated_at,
                    },
                    kpis: {
                        totalAvaliacoes: targetQuestionario._count.avaliacoes,
                        totalRespondentes: specificTotalIniciados,
                        totalFinalizados: specificTotalFinalizados,
                        taxaDeConclusao: specificTaxaDeConclusao
                    }
                };
            }

            // --- Estrutura final da resposta ---
            return response.json({
                globalKpis: {
                    totalAvaliacoes: globalTotalAvaliacoes,
                    totalRespondentes: globalTotalIniciados,
                    totalFinalizados: globalTotalFinalizados,
                    taxaDeConclusao: globalTaxaDeConclusao,
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
