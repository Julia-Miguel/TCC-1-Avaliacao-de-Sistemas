// controllers/DeleteQuestionarioController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeleteQuestionarioController {
  async handle(req, res) {
    try {
      const { id } = req.body;

      await prisma.questionario.delete({
        where: { id },
      });

      res.json({ message: "Questionário deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
