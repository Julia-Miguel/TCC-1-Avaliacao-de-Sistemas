import { prisma } from '../../database/client.js';

export class ToggleAtivoQuestionarioController {
  async handle(request, response) {
    const { id } = request.params;
    try {
      const questionario = await prisma.questionario.findUnique({
        where: { id: parseInt(id) },
      });

      if (!questionario || !questionario.eh_satisfacao) {
        return response.status(403).json({ message: 'Apenas o questionário de satisfação pode ser ativado ou desativado.' });
      }

      const questionarioAtualizado = await prisma.questionario.update({
        where: { id: parseInt(id) },
        data: { ativo: !questionario.ativo },
      });

      return response.status(200).json(questionarioAtualizado);
    } catch (error) {
      return response.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }
}