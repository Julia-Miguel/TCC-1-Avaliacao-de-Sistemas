import { prisma } from '../../database/client.js';

export class GetTimeDashboardController {
  async handle(request, response) {
    // A autenticação é garantida pelo authMiddleware
    const { empresaId } = request.user;
    const { questionarioId } = request.query;

    if (!questionarioId) {
      return response.status(400).json({ message: "O 'questionarioId' é obrigatório na query." });
    }

    try {
      const intQuestionarioId = parseInt(questionarioId, 10);
      const intEmpresaId = parseInt(empresaId, 10);

      if (isNaN(intQuestionarioId) || isNaN(intEmpresaId)) {
        return response.status(400).json({ message: "IDs inválidos." });
      }

      // Busca todas as participações (usuAval) finalizadas para um questionário específico
      const completedResponses = await prisma.usuAval.findMany({
        where: {
          isFinalizado: true,
          started_at: { not: null },
          finished_at: { not: null },
          avaliacao: {
            questionarioId: intQuestionarioId,
            criador: {
              empresaId: intEmpresaId
            }
          },
        },
        select: {
          started_at: true,
          finished_at: true,
        },
      });

      if (completedResponses.length === 0) {
        return response.json({ estimatedTime: 'Dados insuficientes' });
      }

      // Calcula a duração de cada resposta em segundos
      const totalDurationInSeconds = completedResponses.reduce((acc, res) => {
        const start = new Date(res.started_at);
        const end = new Date(res.finished_at);
        // getTime() retorna milissegundos, então dividimos por 1000 para obter segundos
        const duration = (end.getTime() - start.getTime()) / 1000;
        return acc + duration;
      }, 0);

      // Calcula a média
      const averageDurationInSeconds = totalDurationInSeconds / completedResponses.length;

      // Formata para "Xm Ys"
      const minutes = Math.floor(averageDurationInSeconds / 60);
      const seconds = Math.round(averageDurationInSeconds % 60);

      return response.json({
        estimatedTime: `${minutes}m ${seconds}s`,
      });

    } catch (error) {
      console.error('[GetTimeDashboardController]', error);
      return response.status(500).json({ message: "Erro ao calcular o tempo estimado." });
    }
  }
}
