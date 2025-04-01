// backend/src/controller/avaliacao/GetAllAvaliacaoController.js
import { prisma } from '../../database/client.js';

export class GetAllAvaliacaoController {
  async handle(request, response) {
    try {
      const avaliacoes = await prisma.avaliacao.findMany({
        include: {
          questionario: {
            select: {
              titulo: true,
            },
          },
          usuarios: {
            include: {
              usuario: {
                select: {
                  nome: true,
                },
              },
            },
          },
        },
      });
      return response.json(avaliacoes);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao buscar as avaliações." });
    }
  }
}