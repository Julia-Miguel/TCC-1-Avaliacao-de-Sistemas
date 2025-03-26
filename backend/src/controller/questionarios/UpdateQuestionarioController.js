// controllers/UpdateQuestionarioController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UpdateQuestionarioController {
  async handle(req, res) {
    try {
      const { id, titulo, perguntas = [], avaliacoes = [] } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID do questionário é obrigatório" });
      }

      const questionario = await prisma.questionario.update({
        where: { id: parseInt(id) },
        data: {
          titulo,
          perguntas: {
            connect: perguntas.length > 0 ? perguntas.map(perguntaId => ({ id: perguntaId })) : [],
          },
          avaliacoes: {
            connect: avaliacoes.length > 0 ? avaliacoes.map(avaliacaoId => ({ id: avaliacaoId })) : [],
          },
        },
        include: { perguntas: true, avaliacoes: true },
      });

      res.json(questionario);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar questionário: " + error.message });
    }
  }
}
