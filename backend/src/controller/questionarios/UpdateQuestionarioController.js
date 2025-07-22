// ✅ ARQUIVO CORRIGIDO: src/controller/questionarios/UpdateQuestionarioController.js

import { prisma } from '../../database/client.js';

export class UpdateQuestionarioController {
  async handle(request, response) {
    const { id } = request.params;
    const { titulo, ordem } = request.body; // Pega apenas os campos que podem ser atualizados

    try {
      const questionario = await prisma.questionario.update({
        where: { id: parseInt(id) },
        // O Prisma ignora campos 'undefined', então só atualiza o que foi enviado
        data: {
          titulo,
          ordem,
        },
      });
      return response.json(questionario);
    } catch (error) {
      if (error.code === 'P2025') {
        return response.status(404).json({ message: "Questionário não encontrado." });
      }
      return response.status(400).json({ message: "Erro ao atualizar questionário.", error: error.message });
    }
  }
}