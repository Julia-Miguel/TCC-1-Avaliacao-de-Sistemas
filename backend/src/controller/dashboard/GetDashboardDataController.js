import { prisma } from "../../database/client.js";

// Função auxiliar para formatar o tempo
const formatTime = (milliseconds) => {
  if (milliseconds <= 0) {
    return 'N/A';
  }
  const totalSeconds = milliseconds / 1000;
  const roundedSeconds = Math.round(totalSeconds / 30) * 30;
  const minutes = Math.floor(roundedSeconds / 60);
  const seconds = roundedSeconds % 60;
  if (minutes === 0 && seconds === 0 && totalSeconds > 0) {
    return '30 seg';
  }
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
};

async function getPrincipalDashboardData(empresaId) {
    const [totalQuestionarios, totalAvaliacoes, totalRespondentes, totalFinalizados] = await Promise.all([
        prisma.questionario.count({ where: { criador: { empresaId } } }),
        prisma.avaliacao.count({ where: { criador: { empresaId } } }),
        prisma.usuAval.count({ where: { avaliacao: { criador: { empresaId } } } }),
        prisma.usuAval.count({ where: { avaliacao: { criador: { empresaId } }, finished_at: { not: null } } })
    ]);

    const taxaDeConclusao = totalRespondentes > 0 ? (totalFinalizados / totalRespondentes) * 100 : 0;

    const kpis = {
        totalAvaliacoes,
        totalRespondentes,
        totalFinalizados,
        taxaDeConclusao: parseFloat(taxaDeConclusao.toFixed(1)),
        totalQuestionarios,
    };

    const lastQuestionnaire = await prisma.questionario.findFirst({
        where: { criador: { empresaId } },
        orderBy: { updated_at: 'desc' },
        include: {
        _count: {
            select: { perguntas: true },
        },
        avaliacoes: {
            include: {
            _count: {
                select: { usuarios: true },
            },
            },
        },
        },
    });

    let lastQuestionnaireInfo = null;
    if (lastQuestionnaire) {
        const totalQuestions = lastQuestionnaire._count.perguntas;
        const totalEvaluations = lastQuestionnaire.avaliacoes.length;
        const totalRespondents = lastQuestionnaire.avaliacoes.reduce((sum, aval) => sum + aval._count.usuarios, 0);

        const completedEvaluations = await prisma.usuAval.findMany({
        where: {
            avaliacao: { questionarioId: lastQuestionnaire.id },
            finished_at: { not: null },
            started_at: { not: null },
        },
        });

        const totalCompleted = completedEvaluations.length;
        const completionRate = totalRespondents > 0 ? (totalCompleted / totalRespondents) * 100 : 0;

        let estimatedTime = 'N/A';
        if (completedEvaluations.length > 0) {
        const totalTimeInMillis = completedEvaluations.reduce((acc, curr) => {
            const diff = new Date(curr.finished_at).getTime() - new Date(curr.started_at).getTime();
            return acc + diff;
        }, 0);
        
        const averageTimeInMillis = totalTimeInMillis / completedEvaluations.length;
        estimatedTime = formatTime(averageTimeInMillis);
        }

        lastQuestionnaireInfo = {
        id: lastQuestionnaire.id,
        title: lastQuestionnaire.titulo,
        totalQuestions,
        totalRespondents,
        totalEvaluations,
        completionRate: `${completionRate.toFixed(1)}%`,
        estimatedTime,
        updated_at: lastQuestionnaire.updated_at,
        };
    }

    return { kpis, lastQuestionnaire: lastQuestionnaireInfo };
}

async function getSpecificDashboardData({ questionarioId, empresaId, semestre }) {
    const perguntasDoQuestionario = await prisma.pergunta.findMany({
        where: { questionarios: { some: { questionarioId } } },
        select: { id: true, tipos: true, enunciado: true }
    });
    const idsDasPerguntas = perguntasDoQuestionario.map(p => p.id);

    if (idsDasPerguntas.length === 0) {
        return { kpis: { totalAvaliacoes: 0, totalRespondentes: 0, totalFinalizados: 0, taxaDeConclusao: 0, estimatedTime: 'N/A' }, graficos: [], textQuestions: [] };
    }

    let baseWhere = {
        avaliacao: {
            criador: { empresaId },
            questionarioId: questionarioId
        },
        finished_at: { not: null }
    };
    
    if (semestre && semestre !== 'todos') {
        baseWhere.avaliacao.semestre = semestre;
    }
    
    const finalizadosComTempo = await prisma.usuAval.findMany({
        where: { ...baseWhere, started_at: { not: null } },
        select: { started_at: true, finished_at: true }
    });

    const totalFinalizados = finalizadosComTempo.length;
    const totalRespondentes = await prisma.usuAval.count({ where: { ...baseWhere, finished_at: undefined } });
    const taxaDeConclusao = totalRespondentes > 0 ? parseFloat(((totalFinalizados / totalRespondentes) * 100).toFixed(1)) : 0;
    const totalAvaliacoes = await prisma.avaliacao.count({ where: { questionarioId, criador: { empresaId } } });

    let estimatedTime = 'N/A';
    if (totalFinalizados > 0) {
        const totalTimeInMillis = finalizadosComTempo.reduce((acc, curr) => {
            const diff = new Date(curr.finished_at).getTime() - new Date(curr.started_at).getTime();
            return acc + diff;
        }, 0);
        const averageTimeInMillis = totalTimeInMillis / totalFinalizados;
        estimatedTime = formatTime(averageTimeInMillis);
    }

    const perguntasMultiplaEscolha = perguntasDoQuestionario.filter(p => p.tipos === 'MULTIPLA_ESCOLHA');
    const graficos = [];

    for (const pergunta of perguntasMultiplaEscolha) {
        const contagemRespostas = await prisma.resposta.groupBy({
            by: ['resposta'],
            where: {
                perguntaId: pergunta.id,
                usuAval: {
                    finished_at: { not: null },
                    avaliacao: {
                        criador: { empresaId },
                        questionarioId: questionarioId,
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
    
    const textQuestions = perguntasDoQuestionario.filter(p => p.tipos === 'TEXTO').map(p => ({ id: p.id, enunciado: p.enunciado }));

    return {
        kpis: { totalAvaliacoes, totalRespondentes, totalFinalizados, taxaDeConclusao, estimatedTime },
        graficos,
        textQuestions,
    };
}

export class GetDashboardDataController {
  async handle(request, response) {
    const { empresaId } = request.user;
    const { questionarioId, semestre } = request.query;

    try {
      const intEmpresaId = parseInt(empresaId);

      if (questionarioId) {
          const intQuestionarioId = parseInt(questionarioId);
          const questionario = await prisma.questionario.findFirst({
              where: { id: intQuestionarioId, criador: { empresaId: intEmpresaId } }
          });

          if (!questionario) {
              return response.status(404).json({ message: "Questionário não encontrado ou não pertence à sua empresa." });
          }
          
          const data = await getSpecificDashboardData({
              questionarioId: intQuestionarioId,
              empresaId: intEmpresaId,
              semestre,
          });
          return response.json(data);

      } else {
          const data = await getPrincipalDashboardData(intEmpresaId);
          return response.json(data);
      }

    } catch (error) {
      console.error("[GetDashboardDataController]", error);
      return response.status(500).json({ message: "Erro interno do servidor ao buscar dados do dashboard." });
    }
  }
}
