import { prisma } from '../../database/client.js';

export class GetAllQuePergController {
  async handle(request, response) {
    const { questionarioId } = request.query;

    const quePergs = await prisma.quePerg.findMany({
      where: {
        questionarioId: parseInt(questionarioId)
      },
      include: {
        pergunta: {
          include: {
            opcoes: true
          }
        }
      },
      orderBy: {
        pergunta: {
          ordem: 'asc'
        }
      }
    });

    return response.json(quePergs);
  }
}