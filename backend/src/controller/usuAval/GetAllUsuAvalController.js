// backend/src/controller/usuaval/GetAllUsuAvalController.js
import { prisma } from '../../database/client.js';

export class GetAllUsuAvalController {
  async handle(request, response) {
    try {
      const usuAvals = await prisma.usuAval.findMany({
        include: {
          usuario: { select: { nome: true } },
          avaliacao: { select: { semestre: true } },
        },
      });
      return response.json(usuAvals);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao buscar as associações usuário-avaliação." });
    }
  }
}