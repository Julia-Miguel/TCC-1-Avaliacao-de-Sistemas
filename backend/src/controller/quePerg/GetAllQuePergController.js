// backend/src/controller/quePerg/GetAllQuePergController.js
import { prisma } from '../../database/client.js';

export class GetAllQuePergController {
  async handle(request, response) {
    const quePerg = await prisma.quePerg.findMany({
      include: {
        pergunta: {
          select: {
            enunciado: true, // Alterado de "descricao" para "enunciado"
            tipos: true,     // Alterado de "tipo" para "tipos"
          },
        },
        questionario: {
          select: {
            titulo: true,
          },
        },
      },
    });

    return response.json(quePerg);
  }
}