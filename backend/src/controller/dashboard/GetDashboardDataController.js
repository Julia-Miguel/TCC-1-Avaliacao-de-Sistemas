// backend/src/controller/dashboard/GetDashboardDataController.js
import { prisma } from '../../database/client.js'; // Certifique-se de que o Prisma Client está importado

export class GetDashboardDataController {
    // O construtor não precisa mais de repositórios externos se usarmos Prisma diretamente
    // Você pode remover os repositórios injetados se não forem usados em outros lugares deste controller.
    // Para manter a compatibilidade mínima com a estrutura existente, vamos apenas usar o prisma.
    constructor() {} // Construtor simplificado

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
            const taxaDeConclusaoGlobal = totalRespondentes > 0 ? parseFloat(((totalFinalizados / totalRespondentes) * 100).toFixed(1)) : 0;

            // --- 2. GRÁFICOS DE MÚLTIPLA ESCOLHA (dados agregados) ---
            const perguntasMultiplaEscolha = await prisma.pergunta.findMany({
                where: {
                    tipos: 'MULTIPLA_ESCOLHA',
                    questionarios: { some: { questionarioId: { in: questionarioIds } } }
                },
                include: {
                    opcoes: true // Inclui opções para mapeamento correto, se necessário
                }
            });

            const graficos = [];
            for (const pergunta of perguntasMultiplaEscolha) {
                const contagemRespostas = await prisma.resposta.groupBy({
                    by: ['resposta'],
                    where: { 
                        perguntaId: pergunta.id,
                        usuAval: {
                            avaliacao: {
                                questionarioId: { in: questionarioIds } // Garante que as respostas são da empresa do admin
                            }
                        }
                    },
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

            // --- 4. Dados do Último Questionário Acessado ---
            let lastQuestionnaireData = null;
            const lastQuestionnaire = await prisma.questionario.findFirst({
                where: { criador: { empresaId: intEmpresaId } },
                orderBy: { updated_at: 'desc' }, // Ou 'created_at' se preferir por criação
                include: {
                    _count: { // Conta as avaliações diretamente vinculadas a este questionário
                        select: { avaliacoes: true }
                    }
                }
            });

            if (lastQuestionnaire) {
                const totalQuestionsInLast = await prisma.quePerg.count({
                    where: { questionarioId: lastQuestionnaire.id }
                });

                // Contar respondentes únicos para este questionário (através de todas as suas avaliações)
                const usuAvalsForLastQuestionnaire = await prisma.usuAval.findMany({
                    where: {
                        avaliacao: {
                            questionarioId: lastQuestionnaire.id
                        }
                    },
                    select: {
                        usuarioId: true,
                        anonymousSessionId: true,
                        isFinalizado: true
                    },
                });

                const uniqueRespondents = new Set();
                let completedRespondents = 0;
                usuAvalsForLastQuestionnaire.forEach(ua => {
                    if (ua.usuarioId) {
                        uniqueRespondents.add(`user-${ua.usuarioId}`);
                    } else if (ua.anonymousSessionId) {
                        uniqueRespondents.add(`anon-${ua.anonymousSessionId}`);
                    }
                    if (ua.isFinalizado) {
                        completedRespondents++;
                    }
                });

                const totalRespondentsForLast = uniqueRespondents.size;
                const completionRateForLast = totalRespondentsForLast > 0 
                    ? parseFloat(((completedRespondents / totalRespondentsForLast) * 100).toFixed(1)) 
                    : 0;

                lastQuestionnaireData = {
                    id: lastQuestionnaire.id,
                    title: lastQuestionnaire.titulo,
                    totalQuestions: totalQuestionsInLast,
                    totalRespondents: totalRespondentsForLast,
                    totalEvaluations: lastQuestionnaire._count?.avaliacoes || 0, // Total de avaliações agendadas com este questionário
                    completionRate: `${completionRateForLast}%`, // Formatado como string para exibição
                    estimatedTime: '5-10 minutos', // Valor estático, pois não há dados para calcular
                    updated_at: lastQuestionnaire.updated_at.toISOString(),
                };
            }

            return response.json({
                kpis: {
                    totalAvaliacoes,
                    totalRespondentes,
                    totalFinalizados,
                    taxaDeConclusao: taxaDeConclusaoGlobal,
                    totalQuestionarios
                },
                graficos,
                textQuestions,
                lastQuestionnaire: lastQuestionnaireData // Adicionado o último questionário aqui
            });

        } catch (error) {
            console.error('[GetDashboardDataController]', error);
            return response.status(500).json({ message: "Erro ao buscar dados do dashboard." });
        }
    }
}