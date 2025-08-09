import { prisma } from '../../database/client.js';

export class GetTimeDashboardController {
  async handle(request, response) {
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

      const totalDurationInSeconds = completedResponses.reduce((acc, res) => {
        const start = new Date(res.started_at);
        const end = new Date(res.finished_at);
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
