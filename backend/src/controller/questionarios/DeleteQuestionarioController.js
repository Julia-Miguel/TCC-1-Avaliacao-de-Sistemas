import { prisma } from "../../database/client.js";

export class DeleteQuestionarioController {
  async handle(request, response) {
    const { id } = request.params;
    const questionarioId = parseInt(id);

    try {
      // 1. Verifica se há avaliações ativas
      const avaliacoesAtivas = await prisma.avaliacao.findMany({
        where: { questionarioId },
        select: { id: true }
      });

      if (avaliacoesAtivas.length > 0) {
        return response
          .status(409) // Conflict
          .json({ message: "Não é possível excluir questionário com avaliações ativas." });
      }

      // 2. Deleta questionário
      await prisma.questionario.delete({ where: { id: questionarioId } });

      return response.status(200).json({ message: "Questionário deletado com sucesso" });

    } catch (error) {
      if (error.code === 'P2025') {
        return response.status(404).json({ message: "Questionário não encontrado." });
      }

      console.error("[DeleteQuestionario] Erro ao deletar questionário:", error);
      return response.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}
