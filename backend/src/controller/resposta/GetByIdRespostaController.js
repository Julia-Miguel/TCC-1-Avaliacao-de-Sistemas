// backend/src/controller/resposta/GetByIdRespostaController.js
import { prisma } from '../../database/client.js';

export class GetByIdRespostaController {
  async handle(request, response) {
    const { id } = request.params;
    try {
      const resposta = await prisma.resposta.findUnique({
        where: { id: parseInt(id) },
        include: {
          pergunta: {
            select: {
              enunciado: true,
              tipos: true,
            },
          },
          usuAval: {
            select: {
              status: true,
              isFinalizado: true,
              usuario: {
                select: {
                  nome: true,
                  email: true,
                  tipo: true,
                },
              },
              avaliacao: {
                select: {
                  semestre: true,
                  questionarioId: true,
                },
              },
            },
          },
        },
      });
      if (!resposta) {
        return response.status(404).json({ error: "Resposta não encontrada" });
      }
      return response.json(resposta);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao buscar a resposta." });
    }
  }
}