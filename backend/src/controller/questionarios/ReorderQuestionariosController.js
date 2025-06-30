// backend/src/controller/questionarios/ReorderQuestionariosController.js

import { prisma } from '../../database/client.js';

export class ReorderQuestionariosController {
  async handle(request, response) {
    const { orderedIds } = request.body;
    const { empresaId } = request.user;

    if (!Array.isArray(orderedIds)) {
      return response.status(400).json({ error: 'O corpo da requisição deve conter um array de IDs.' });
    }

    try {
      await prisma.$transaction(
        orderedIds.map((id, index) =>
          prisma.questionario.update({
            where: {
              id: Number(id),
              // Segurança: Garante que o usuário só pode reordenar questionários da sua própria empresa
              criador: { empresaId: Number(empresaId) }
            },
            data: { ordem: index },
          })
        )
      );

      return response.status(200).json({ message: 'Ordem dos questionários atualizada com sucesso.' });
    } catch (error) {
      console.error("Erro ao reordenar questionários:", error);
      return response.status(500).json({ error: 'Erro interno ao reordenar os questionários.' });
    }
  }
}