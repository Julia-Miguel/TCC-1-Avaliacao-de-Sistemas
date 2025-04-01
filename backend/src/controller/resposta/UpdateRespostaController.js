// backend/src/controller/resposta/UpdateRespostaController.js
import { prisma } from '../../database/client.js';

export class UpdateRespostaController {
  async handle(request, response) {
    const { id, resposta, usuAvalId, perguntaId } = request.body;

    try {
      const respostaAtualizada = await prisma.resposta.update({
        where: { id: parseInt(id) },
        data: {
          resposta,
          usuAval: { connect: { id: parseInt(usuAvalId) } },
          pergunta: { connect: { id: parseInt(perguntaId) } },
        },
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
      return response.json(respostaAtualizada);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao atualizar a resposta." });
    }
  }
}