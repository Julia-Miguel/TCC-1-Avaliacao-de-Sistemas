import { prisma } from '../../../database/client.js';

export class CheckAvaliacaoController {
  async handle(request, response) {
    const { avaliacaoId: token } = request.params;

    if (!token) {
      return response.status(400).json({ message: "Token da avaliação na URL é inválido." });
    }

    try {
      const avaliacao = await prisma.avaliacao.findUnique({
        where: { token },
        select: { 
          requerLoginCliente: true,
          questionario: { select: { eh_satisfacao: true } }
        }
      });

      if (!avaliacao) {
        return response.status(404).json({ message: "Avaliação não encontrada." });
      }

      return response.status(200).json({
        requerLoginCliente: avaliacao.requerLoginCliente,
        questionario: avaliacao.questionario
      });

    } catch (error) {
      console.error("Erro ao verificar avaliação:", error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}
