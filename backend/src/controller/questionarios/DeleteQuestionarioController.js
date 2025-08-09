// src/controller/questionarios/DeleteQuestionarioController.js

import { prisma } from "../../database/client.js";

export class DeleteQuestionarioController {
  async handle(request, response) {
    const { id } = request.params;

    try {
      await prisma.questionario.delete({
        where: {
          id: parseInt(id),
        },
      });

      return response.status(200).json({ message: "Questionário deletado com sucesso" });
      
    } catch (error) {
      if (error.code === 'P2025') {
        return response.status(404).json({ message: "Erro: Questionário não encontrado." });
      }
      
      console.error("[DeleteQuestionario] Erro ao deletar questionário:", error);
      return response.status(500).json({ error: "Erro interno do servidor ao deletar questionário." });
    }
  }
}
