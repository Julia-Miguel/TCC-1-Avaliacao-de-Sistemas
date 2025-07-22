// ✅ CONTROLLER SIMPLIFICADO: src/controller/questionarios/DeleteQuestionarioController.js

import { prisma } from "../../database/client.js";

export class DeleteQuestionarioController {
  async handle(request, response) {
    const { id } = request.params;

    try {
      // Com 'onDelete: Cascade', o Prisma e o banco de dados
      // deletam automaticamente as avaliações e QuePerg relacionadas.
      await prisma.questionario.delete({
        where: {
          id: parseInt(id),
        },
      });

      return response.status(200).json({ message: "Questionário deletado com sucesso" });
      
    } catch (error) {
      // O Prisma retorna o código P2025 quando o registro a ser deletado não existe.
      if (error.code === 'P2025') {
        return response.status(404).json({ message: "Erro: Questionário não encontrado." });
      }
      
      console.error("[DeleteQuestionario] Erro ao deletar questionário:", error);
      return response.status(500).json({ error: "Erro interno do servidor ao deletar questionário." });
    }
  }
}
