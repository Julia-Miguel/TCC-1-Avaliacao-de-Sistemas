// backend/src/controller/avaliacao/UpdateAvaliacaoController.js
import { prisma } from '../../database/client.js';

export class UpdateAvaliacaoController {
  async handle(request, response) {
    const { id, semestre, questionario_id } = request.body;

    try {
      const avaliacao = await prisma.avaliacao.update({
        where: { id: parseInt(id) },
        data: {
          semestre,
          questionario: { connect: { id: parseInt(questionario_id) } },
        },
        include: {
          questionario: { select: { titulo: true } },
          usuarios: {
            include: {
              usuario: { select: { nome: true } },
            },
          },
        },
      });
      return response.json(avaliacao);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao atualizar a avaliação." });
    }
  }
}