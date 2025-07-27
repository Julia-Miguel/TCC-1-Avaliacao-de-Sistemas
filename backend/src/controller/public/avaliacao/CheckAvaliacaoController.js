// backend/src/controller/public/avaliacao/CheckAvaliacaoController.js
import { prisma } from '../../../database/client.js';

export class CheckAvaliacaoController {
  async handle(request, response) {
    const { avaliacaoId: avaliacaoIdParam } = request.params;
    const avaliacaoId = parseInt(avaliacaoIdParam, 10);

    if (isNaN(avaliacaoId)) {
      return response.status(400).json({ message: "ID da avaliação na URL é inválido." });
    }

    try {
      const avaliacao = await prisma.avaliacao.findUnique({
        where: { id: avaliacaoId },
        select: { requerLoginCliente: true } // Seleciona apenas o campo necessário
      });

      if (!avaliacao) {
        return response.status(404).json({ message: "Avaliação não encontrada." });
      }

      // Retorna apenas a informação que o frontend precisa
      return response.status(200).json({ requerLoginCliente: avaliacao.requerLoginCliente });

    } catch (error) {
      console.error("Erro ao verificar avaliação:", error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}