import { prisma } from '../../database/client.js';

// Função auxiliar para dados do dashboard principal (sem alterações)
async function getPrincipalDashboardData(intEmpresaId) {
    // ... (seu código original aqui dentro está correto)
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


// ✅ FUNÇÃO ATUALIZADA PARA O DASHBOARD ESPECÍFICO
async function getSpecificDashboardData({ questionarioId, ehSatisfacao, empresaId, semestre }) {
    
    // Pega os IDs de todas as perguntas do questionário em questão
    const perguntasDoQuestionario = await prisma.pergunta.findMany({
        where: { questionarios: { some: { questionarioId } } },
        select: { id: true, tipos: true, enunciado: true }
    });
    const idsDasPerguntas = perguntasDoQuestionario.map(p => p.id);

    if (idsDasPerguntas.length === 0) {
        return { kpis: { totalAvaliacoes: 0, totalRespondentes: 0, totalFinalizados: 0, taxaDeConclusao: 0, totalQuestionarios: 1 }, graficos: [], textQuestions: [] };
    }

    // Monta a base do filtro. A lógica muda se for de satisfação.
    let baseWhere = {
        isFinalizado: true,
        avaliacao: {
            criador: { empresaId }
        }
    };
    
    if (semestre && semestre !== 'todos') {
        baseWhere.avaliacao.semestre = semestre;
    }
    
    // Se for de satisfação, a busca por respondentes é em todas as avaliações.
    // Se não, é apenas nas avaliações deste questionário.
    if (ehSatisfacao) {
        baseWhere.respostas = { some: { perguntaId: { in: idsDasPerguntas } } };
    } else {
        baseWhere.avaliacao.questionarioId = questionarioId;
    }
    
    // 1. KPIs
    const totalFinalizados = await prisma.usuAval.count({ where: baseWhere });
    // Para 'totalRespondentes', consideramos também os não finalizados no mesmo filtro
    const totalRespondentes = await prisma.usuAval.count({ where: { ...baseWhere, isFinalizado: undefined } });
    const taxaDeConclusao = totalRespondentes > 0 ? parseFloat(((totalFinalizados / totalRespondentes) * 100).toFixed(1)) : 0;
    const totalAvaliacoes = await prisma.avaliacao.count({ where: ehSatisfacao ? baseWhere.avaliacao : { questionarioId, criador: { empresaId } } });

    // 2. Gráficos (Múltipla Escolha)
    const perguntasMultiplaEscolha = perguntasDoQuestionario.filter(p => p.tipos === 'MULTIPLA_ESCOLHA');
    const graficos = [];

    for (const pergunta of perguntasMultiplaEscolha) {
        const contagemRespostas = await prisma.resposta.groupBy({
            by: ['resposta'],
            where: {
                perguntaId: pergunta.id,
                usuAval: {
                    isFinalizado: true,
                    avaliacao: {
                        criador: { empresaId },
                        ...(semestre && semestre !== 'todos' && { semestre: semestre })
                    }
                }
            },
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
    const textQuestions = perguntasDoQuestionario.filter(p => p.tipos === 'TEXTO').map(p => ({ id: p.id, enunciado: p.enunciado }));

    return {
        kpis: { totalAvaliacoes, totalRespondentes, totalFinalizados, taxaDeConclusao, totalQuestionarios: 1 },
        graficos,
        textQuestions,
    };
}


// --- CONTROLLER PRINCIPAL ATUALIZADO ---
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
                const intQuestionarioId = parseInt(questionarioId);
                const questionario = await prisma.questionario.findFirst({
                    where: { id: intQuestionarioId, criador: { empresaId: intEmpresaId } },
                    select: { id: true, eh_satisfacao: true } // Pega a flag eh_satisfacao
                });

                if (!questionario) {
                    return response.status(404).json({ message: "Questionário não encontrado ou não pertence à sua empresa." });
                }
                
                const data = await getSpecificDashboardData({
                    questionarioId: questionario.id,
                    ehSatisfacao: questionario.eh_satisfacao, // Passa a flag para a função
                    empresaId: intEmpresaId,
                    semestre,
                });
                return response.json(data);

            } else {
                const data = await getPrincipalDashboardData(intEmpresaId);
                return response.json(data);
            }

        } catch (error) {
            console.error('[GetDashboardDataController]', error);
            return response.status(500).json({ message: "Erro ao buscar dados do dashboard." });
        }
    }
}