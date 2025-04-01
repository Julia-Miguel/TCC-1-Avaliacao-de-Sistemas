// backend/src/controller/resposta/CreateRespostaController.js
import { prisma } from '../../database/client.js';

export class CreateRespostaController {
  async handle(request, response) {
    const { resposta, usuAvalId, perguntaId } = request.body;

    try {
      const novaResposta = await prisma.resposta.create({
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
      return response.json(novaResposta);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao criar a resposta." });
    }
  }
}