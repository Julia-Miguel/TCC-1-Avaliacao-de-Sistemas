// controllers/GetByIdQuestionarioController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetByIdQuestionarioController {
  async handle(req, res) {
    try {
      const id = parseInt(req.params.id);

      const questionario = await prisma.questionario.findUnique({
        where: { id },
        include: { perguntas: true, avaliacoes: true },
      });

      if (!questionario) {
        return res.status(404).json({ error: "Questionário não encontrado" });
      }

      res.json(questionario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
