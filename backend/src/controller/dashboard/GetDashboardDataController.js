// backend/src/controller/dashboard/GetDashboardDataController.js
import { prisma } from '../../database/client.js';

export class GetDashboardDataController {
    async handle(request, response) {
        const { empresaId } = request.user; // Obtido pelo authMiddleware

        if (!empresaId) {
            return response.status(401).json({ message: "ID da empresa não encontrado no token." });
        }

        try {
            const intEmpresaId = parseInt(empresaId);

            // --- 1. KPIs GLOBAIS ---
            const questionariosDaEmpresa = await prisma.questionario.findMany({
                where: { criador: { empresaId: intEmpresaId } },
                select: { id: true }
            });
            const questionarioIds = questionariosDaEmpresa.map(q => q.id);

            const totalQuestionarios = questionarioIds.length;
            const totalAvaliacoes = await prisma.avaliacao.count({ where: { questionarioId: { in: questionarioIds } } });
            const totalRespondentes = await prisma.usuAval.count({ where: { avaliacao: { questionarioId: { in: questionarioIds } } } });
            const totalFinalizados = await prisma.usuAval.count({ where: { avaliacao: { questionarioId: { in: questionarioIds } }, isFinalizado: true } });
            const taxaDeConclusao = totalRespondentes > 0 ? Math.round((totalFinalizados / totalRespondentes) * 100) : 0;

            // --- 2. GRÁFICOS DE MÚLTIPLA ESCOLHA ---
            const perguntasMultiplaEscolha = await prisma.pergunta.findMany({
                where: {
                    tipos: 'MULTIPLA_ESCOLHA',
                    questionarios: { some: { questionarioId: { in: questionarioIds } } }
                },
                include: {
                    opcoes: true
                }
            });

            const graficos = [];
            for (const pergunta of perguntasMultiplaEscolha) {
                const contagemRespostas = await prisma.resposta.groupBy({
                    by: ['resposta'],
                    where: { perguntaId: pergunta.id },
                    _count: { _all: true },
                });

                if (contagemRespostas.length > 0) {
                    graficos.push({
                        perguntaId: pergunta.id,
                        enunciado: pergunta.enunciado,
                        respostas: contagemRespostas.map(item => ({
                            name: item.resposta,
                            value: item._count._all,
                        })),
                    });
                }
            }

            // --- 3. PERGUNTAS DE TEXTO PARA NUVEM DE PALAVRAS ---
            const textQuestions = await prisma.pergunta.findMany({
                where: {
                    tipos: 'TEXTO',
                    questionarios: { some: { questionarioId: { in: questionarioIds } } }
                },
                select: { id: true, enunciado: true }
            });

            return response.json({
                kpis: {
                    totalAvaliacoes,
                    totalRespondentes,
                    totalFinalizados,
                    taxaDeConclusao,
                    totalQuestionarios
                },
                graficos,
                textQuestions
            });

        } catch (error) {
            console.error('[GetDashboardDataController]', error);
            return response.status(500).json({ message: "Erro ao buscar dados do dashboard." });
        }
    }
}