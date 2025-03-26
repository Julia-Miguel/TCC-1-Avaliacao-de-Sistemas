// controllers/GetAllQuestionarioController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetAllQuestionarioController {
  async handle(req, res) {
    try {
      const questionarios = await prisma.questionario.findMany({
        include: { perguntas: true, avaliacoes: true },
      });
      res.json(questionarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
