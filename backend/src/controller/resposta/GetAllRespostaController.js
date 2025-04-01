// backend/src/controller/resposta/GetAllRespostaController.js
import { prisma } from '../../database/client.js';

export class GetAllRespostaController {
  async handle(request, response) {
    try {
      const respostas = await prisma.resposta.findMany({
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
      return response.json(respostas);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Erro ao buscar as respostas." });
    }
  }
}