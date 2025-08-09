import { prisma } from '../../database/client.js';

export class CreateQuestionarioController {
  async handle(request, response) {
    const { usuarioId: criadorId, empresaId: adminEmpresaId } = request.user;
    const { titulo, eh_satisfacao } = request.body;

    if (!criadorId || !adminEmpresaId) {
      return response.status(401).json({ message: "Usuário não autenticado ou ID da empresa não encontrado no token." });
    }
    if (!titulo || !titulo.trim()) {
      return response.status(400).json({ message: "Título é obrigatório." });
    }

    try {
      if (eh_satisfacao === true) {
        const satisfacaoExistente = await prisma.questionario.findFirst({
          where: {
            eh_satisfacao: true,
            criador: {
              empresaId: parseInt(adminEmpresaId)
            }
          },
        });

        if (satisfacaoExistente) {
          return response.status(409).json({ message: "Sua empresa já possui um questionário de satisfação. Apenas um é permitido." });
        }
      }

      // Cria o novo questionário no banco de dados
      const questionario = await prisma.questionario.create({
        data: {
          titulo: titulo.trim(),
          criadorId: parseInt(criadorId),
          eh_satisfacao: eh_satisfacao || false,
        }
      });
      
      return response.status(201).json(questionario);

    } catch (error) {
      console.error("Erro ao criar questionário no controller:", error);
      return response.status(500).json({ error: "Erro interno do servidor ao criar questionário." });
    }
  }
}
