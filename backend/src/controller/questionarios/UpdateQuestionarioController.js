// backend/src/controller/questionarios/UpdateQuestionarioController.js
import { prisma } from '../../database/client.js';

export class UpdateQuestionarioController {
  async handle(request, response) {
    const { id: questionarioIdFromBody, titulo } = request.body;
    
    // Verificando se request.user e suas propriedades esperadas existem
    if (!request.user || !request.user.empresaId || !request.user.usuarioId) { // <<< CORREÇÃO AQUI: request.user.usuarioId
        return response.status(401).json({ error: "Usuário não autenticado ou dados de usuário incompletos no token." });
    }
    // Usando os dados do usuário logado (fornecidos pelo authMiddleware)
    const { usuarioId: adminUserId, empresaId } = request.user; // <<< CORREÇÃO AQUI: usuarioId renomeado para adminUserId

    const questionarioId = parseInt(questionarioIdFromBody);

    if (isNaN(questionarioId)) {
      return response.status(400).json({ error: "ID do questionário inválido." });
    }
    if (!titulo) {
      return response.status(400).json({ error: "Título é obrigatório." });
    }

    try {
      // Verifica se o questionário existe E pertence à empresa do admin logado
      const questionarioExistente = await prisma.questionario.findFirst({
        where: {
          id: questionarioId,
          criador: { 
            empresaId: parseInt(empresaId), // Garante que empresaId seja número
            // Se você quisesse que apenas o CRIADOR ORIGINAL pudesse editar:
            // id: parseInt(adminUserId) 
          }
        }
      });

      if (!questionarioExistente) {
        return response.status(404).json({ error: "Questionário não encontrado, não pertence à sua empresa ou você não tem permissão para editá-lo." });
      }

      const questionarioAtualizado = await prisma.questionario.update({
        where: { 
            id: questionarioId 
        },
        data: {
          titulo,
        },
      });

      return response.json(questionarioAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar questionário:", error);
      return response.status(500).json({ error: "Erro ao atualizar questionário: " + error.message });
    }
  }
}