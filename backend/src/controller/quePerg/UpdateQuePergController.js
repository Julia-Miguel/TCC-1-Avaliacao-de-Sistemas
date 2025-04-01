// backend/src/controller/quePerg/UpdateQuePergController.js
import { prisma } from '../../database/client.js';

export class UpdateQuePergController {
  async handle(request, response) {
    const { id, pergunta_id, questionario_id } = request.body;

    try {
      const quePerg = await prisma.quePerg.update({
        where: { id: parseInt(id) },
        data: {
          pergunta: { connect: { id: parseInt(pergunta_id) } },
          questionario: { connect: { id: parseInt(questionario_id) } },
        },
        include: {
          pergunta: { select: { enunciado: true, tipos: true } },
          questionario: { select: { titulo: true } },
        },
      });
      return response.json(quePerg);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao atualizar a associação.' });
    }
  }
}