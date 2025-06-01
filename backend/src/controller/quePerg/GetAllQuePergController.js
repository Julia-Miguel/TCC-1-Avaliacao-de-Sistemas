import { prisma } from '../../database/client.js';

export class GetAllQuePergController {
  async handle(request, response) {
    const { questionarioId } = request.query;

    const where = {};
    if (questionarioId) {
      where.questionarioId = parseInt(questionarioId, 10);
    }

    const quePerg = await prisma.quePerg.findMany({
      where: where,
      include: {
        questionario: {
          select: {
            titulo: true,
          },
        },
        // A MÁGICA ACONTECE AQUI
        pergunta: {
          include: {
            opcoes: true, // Dizemos ao Prisma para INCLUIR as opções da pergunta
          },
        },
      },
    });

    return response.json(quePerg);
  }
}