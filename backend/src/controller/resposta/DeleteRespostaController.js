// backend/src/controller/resposta/DeleteRespostaController.js
import { prisma } from '../../database/client.js';

export class DeleteRespostaController {
  async handle(request, response) {
    const { id } = request.body;

    try {
      await prisma.resposta.delete({
        where: { id: parseInt(id) },
      });
      return response.json({ message: "Resposta excluída com sucesso." });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao excluir a resposta." });
    }
  }
}