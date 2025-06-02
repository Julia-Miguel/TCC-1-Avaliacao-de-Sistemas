// backend/src/controller/quePerg/UpdateQuePergController.js
import { prisma } from '../../database/client.js';

export class UpdateQuePergController {
  async handle(request, response) {
    const { id: quePergId, pergunta_id, questionario_id } = request.body;

    if (!request.user || !request.user.empresaId) {
        return response.status(401).json({ error: "Usuário não autenticado ou ID da empresa não encontrado no token." });
    }
    const { empresaId: adminEmpresaId } = request.user;
    const id = parseInt(quePergId);
    const perguntaId = parseInt(pergunta_id);
    const questionarioId = parseInt(questionario_id);

    if (isNaN(id) || isNaN(perguntaId) || isNaN(questionarioId)) {
        return response.status(400).json({ message: "IDs inválidos." });
    }

    try {
        const questionarioTarget = await prisma.questionario.findFirst({
            where: {
                id: questionarioId,
                criador: {
                    empresaId: parseInt(adminEmpresaId)
                }
            }
        });

        if (!questionarioTarget) {
            return response.status(403).json({ message: "Questionário de destino não encontrado ou não pertence à sua empresa." });
        }

        const quePerg = await prisma.quePerg.update({
          where: { 
             id: id,
             questionario: {
                 criador: {
                     empresaId: parseInt(adminEmpresaId)
                 }
             }
          },
          data: {
            pergunta: { connect: { id: perguntaId } },
            questionario: { connect: { id: questionarioId } },
          },
          include: {
            pergunta: { select: { enunciado: true, tipos: true, opcoes: true } },
            questionario: { select: { titulo: true } },
          },
        });
        return response.json(quePerg);
    } catch (error) {
      console.error("Erro ao atualizar associação QuePerg:", error);
      if (error.code === 'P2025') {
         return response.status(404).json({ error: 'Associação QuePerg não encontrada ou não pertence à sua empresa.' });
      }
      return response.status(500).json({ error: 'Erro ao atualizar a associação.' });
    }
  }
}