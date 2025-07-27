// src/controller/questionarios/CreateQuestionarioController.js
import { prisma } from '../../database/client.js';

export class CreateQuestionarioController {
  async handle(request, response) {
    if (!request.user || !request.user.usuarioId) { 
        return response.status(401).json({ message: "Usuário não autenticado ou ID do usuário não encontrado no token." });
    }
    const { usuarioId: criadorId } = request.user; 
    const { titulo } = request.body;

    if (!titulo || !titulo.trim()) {
      return response.status(400).json({ message: "Título é obrigatório." });
    }

    try {
      const criadorExiste = await prisma.usuario.findUnique({
        where: { id: parseInt(criadorId) }
      });

      if (!criadorExiste) {
        return response.status(400).json({ message: "Usuário criador não encontrado. Verifique o token." });
      }

      const questionario = await prisma.questionario.create({
        data: {
          titulo: titulo.trim(),
          criadorId: parseInt(criadorId)
        }
      });
      return response.status(201).json(questionario);
    } catch (error) {
      console.error("Erro ao criar questionário no controller:", error);
      return response.status(500).json({ error: "Erro interno do servidor ao criar questionário." });
    }
  }
}
