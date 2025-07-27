// ✅ ARQUIVO REATORADO: backend/src/controller/dashboard/GetDashboardDataController.js
import { prisma } from '../../database/client.js';

/**
 * Busca os dados para o dashboard principal (KPIs globais e último questionário).
 */
async function getPrincipalDashboardData(intEmpresaId) {
    // 1. KPIs Globais
    const questionariosDaEmpresa = await prisma.questionario.findMany({
        where: { criador: { empresaId: intEmpresaId } },
        select: { id: true }
    });
    const questionarioIds = questionariosDaEmpresa.map(q => q.id);

    const avaliacaoWhere = { questionarioId: { in: questionarioIds } };

    const totalAvaliacoes = await prisma.avaliacao.count({ where: avaliacaoWhere });
    const totalQuestionarios = questionarioIds.length;
    const totalRespondentes = await prisma.usuAval.count({ where: { avaliacao: avaliacaoWhere } });
    const totalFinalizados = await prisma.usuAval.count({ where: { avaliacao: avaliacaoWhere, isFinalizado: true } });
    const taxaDeConclusao = totalRespondentes > 0 ? parseFloat(((totalFinalizados / totalRespondentes) * 100).toFixed(1)) : 0;

    // 2. Último Questionário Modificado
    const lastQuestionnaire = await prisma.questionario.findFirst({
        where: { criador: { empresaId: intEmpresaId } },
        orderBy: { updated_at: 'desc' },
        include: { _count: { select: { perguntas: true } } }
    });

    let lastQuestionnaireData = null;
    if (lastQuestionnaire) {
        const totalEvaluations = await prisma.avaliacao.count({ where: { questionarioId: lastQuestionnaire.id } });
        const respondents = await prisma.usuAval.count({ where: { avaliacao: { questionarioId: lastQuestionnaire.id } } });
        const finalizadosLQ = await prisma.usuAval.count({ where: { avaliacao: { questionarioId: lastQuestionnaire.id }, isFinalizado: true } });
        const completionRate = respondents > 0 ? `${parseFloat(((finalizadosLQ / respondents) * 100).toFixed(1))}%` : '0%';
        const estimatedTime = `${Math.ceil(lastQuestionnaire._count.perguntas * 0.5)} min`;

        lastQuestionnaireData = {
            id: lastQuestionnaire.id,
            title: lastQuestionnaire.titulo,
            totalQuestions: lastQuestionnaire._count.perguntas,
            totalRespondents: respondents,
            totalEvaluations: totalEvaluations,
            completionRate: completionRate,
            estimatedTime: estimatedTime,
            updated_at: lastQuestionnaire.updated_at.toISOString(),
        };
    }

    return {
        kpis: { totalAvaliacoes, totalRespondentes, totalFinalizados, taxaDeConclusao, totalQuestionarios },
        lastQuestionnaire: lastQuestionnaireData
    };
}

/**
 * Busca os dados para o dashboard de um questionário específico (KPIs, gráficos, etc.).
 */
async function getSpecificDashboardData(questionarioIds, semestre) {
    const avaliacaoWhere = {
        questionarioId: { in: questionarioIds }
    };
    if (semestre && semestre !== 'todos') {
        avaliacaoWhere.semestre = semestre;
    }

    // 1. KPIs
    const totalAvaliacoes = await prisma.avaliacao.count({ where: avaliacaoWhere });
    const totalQuestionarios = questionarioIds.length; // Neste contexto, será sempre 1
    const totalRespondentes = await prisma.usuAval.count({ where: { avaliacao: avaliacaoWhere } });
    const totalFinalizados = await prisma.usuAval.count({ where: { avaliacao: avaliacaoWhere, isFinalizado: true } });
    const taxaDeConclusao = totalRespondentes > 0 ? parseFloat(((totalFinalizados / totalRespondentes) * 100).toFixed(1)) : 0;

    // 2. Gráficos
    const perguntasMultiplaEscolha = await prisma.pergunta.findMany({
        where: {
            tipos: 'MULTIPLA_ESCOLHA',
            questionarios: { some: { questionarioId: { in: questionarioIds } } }
        },
    });
    const graficos = [];
    for (const pergunta of perguntasMultiplaEscolha) {
        const contagemRespostas = await prisma.resposta.groupBy({
            by: ['resposta'],
            where: { perguntaId: pergunta.id, usuAval: { avaliacao: avaliacaoWhere } },
            _count: { _all: true },
        });
        if (contagemRespostas.length > 0) {
            graficos.push({
                perguntaId: pergunta.id,
                enunciado: pergunta.enunciado,
                respostas: contagemRespostas.map(item => ({ name: item.resposta, value: item._count._all })),
            });
        }
    }

    // 3. Perguntas de Texto
    const textQuestions = await prisma.pergunta.findMany({
        where: {
            tipos: 'TEXTO',
            questionarios: { some: { questionarioId: { in: questionarioIds } } }
        },
        select: { id: true, enunciado: true }
    });
    
    return {
        kpis: { totalAvaliacoes, totalRespondentes, totalFinalizados, taxaDeConclusao, totalQuestionarios },
        graficos,
        textQuestions,
    };
}


// --- CONTROLLER PRINCIPAL (AGORA MUITO MAIS SIMPLES) ---
export class GetDashboardDataController {
    async handle(request, response) {
        const { empresaId } = request.user;
        const { questionarioId, semestre } = request.query;

        if (!empresaId) {
            return response.status(401).json({ message: "ID da empresa não encontrado no token." });
        }

        try {
            const intEmpresaId = parseInt(empresaId);

            if (questionarioId) {
                // Cenário 2: Dashboard de um questionário específico
                const intQuestionarioId = parseInt(questionarioId);
                const questionario = await prisma.questionario.findFirst({
                    where: { id: intQuestionarioId, criador: { empresaId: intEmpresaId } },
                    select: { id: true }
                });

                if (!questionario) {
                    return response.status(404).json({ message: "Questionário não encontrado ou não pertence à sua empresa." });
                }
                
                const data = await getSpecificDashboardData([questionario.id], semestre);
                return response.json(data);

            } else {
                // Cenário 1: Dashboard Principal
                const data = await getPrincipalDashboardData(intEmpresaId);
                return response.json(data);
            }

        } catch (error) {
            console.error('[GetDashboardDataController]', error);
            return response.status(500).json({ message: "Erro ao buscar dados do dashboard." });
        }
    }
}