// controllers/CreateQuestionarioController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CreateQuestionarioController {
  async handle(req, res) {
    try {
      const { titulo, perguntas, avaliacoes } = req.body;
      // Exemplo de body:
      // {
      //   "titulo": "Questionário de Exemplo",
      //   "perguntas": [1, 2, 3],
      //   "avaliacoes": [
      //      { "semestre": "2025.1" },
      //      { "semestre": "2025.2" }
      //   ]
      // }

      const questionario = await prisma.questionario.create({
        data: {
          titulo,
          perguntas: {
            create: perguntas.map(perguntaId => ({
              pergunta: { connect: { id: perguntaId } },
            })),
          },
          avaliacoes: {
            create: avaliacoes.map(avaliacao => ({
              semestre: avaliacao.semestre,
            })),
          },
        },
        include: { perguntas: true, avaliacoes: true },
      });

      res.status(201).json(questionario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
