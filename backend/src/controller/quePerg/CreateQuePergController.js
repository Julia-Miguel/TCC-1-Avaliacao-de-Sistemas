// ✅ ARQUIVO CORRIGIDO: src/controller/quePerg/CreateQuePergController.js
import { prisma } from '../../database/client.js';

export class CreateQuePergController {
  async handle(request, response) {
    // ✅ CORREÇÃO: Usando camelCase para corresponder ao teste
    const { perguntaId, questionarioId } = request.body;

    if (!perguntaId || !questionarioId) {
        return response.status(400).json({ message: "perguntaId e questionarioId são obrigatórios." });
    }

    try {
        const quePerg = await prisma.quePerg.create({
          data: {
            // O Prisma espera os IDs para a conexão
            questionarioId: parseInt(questionarioId),
            perguntaId: parseInt(perguntaId)
          }
        });
        return response.status(201).json(quePerg);
    } catch (error) {
        console.error(error);
        return response.status(400).json({ message: "Erro ao associar pergunta." });
    }
  }
}
