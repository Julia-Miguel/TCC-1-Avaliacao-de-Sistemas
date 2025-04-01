// backend/src/controller/quePerg/CreateQuePergController.js
import { prisma } from '../../database/client.js';

export class CreateQuePergController {
  async handle(request, response) {
    const { pergunta_id, questionario_id } = request.body;

    const quePerg = await prisma.quePerg.create({
      data: {
        pergunta: {
          connect: { id: pergunta_id }
        },
        questionario: {
          connect: { id: questionario_id }
        }
      },
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