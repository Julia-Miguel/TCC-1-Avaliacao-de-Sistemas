// backend/src/controller/avaliacao/UpdateAvaliacaoController.js
import { prisma } from '../../database/client.js';

export class UpdateAvaliacaoController {
  async handle(request, response) {
    const { id: avaliacaoIdFromBody, semestre, questionario_id, requerLoginCliente } = request.body;

    if (!request.user || !request.user.empresaId) {
        return response.status(401).json({ message: "Usuário não autenticado ou ID da empresa não encontrado no token." });
    }
    const { empresaId: adminEmpresaId } = request.user;
    const avaliacaoId = parseInt(avaliacaoIdFromBody);
    const questionarioId = parseInt(questionario_id);


    if (isNaN(avaliacaoId)) {
        return response.status(400).json({ message: "ID da avaliação inválido." });
    }
    if (!semestre || isNaN(questionarioId)) {
        return response.status(400).json({ message: "Semestre e ID do Questionário válidos são obrigatórios." });
    }

    try {
        // Verificar se a avaliação pertence à empresa do admin
        const avaliacaoExistente = await prisma.avaliacao.findFirst({
            where: {
                id: avaliacaoId,
                criador: {
                    empresaId: parseInt(adminEmpresaId)
                }
            }
        });

        if (!avaliacaoExistente) {
            return response.status(404).json({ error: "Avaliação não encontrada ou não pertence à sua empresa." });
        }

        // Verificar se o novo questionário (se alterado) pertence à empresa do admin
        if (questionarioId !== avaliacaoExistente.questionarioId) {
            const questionarioVinculado = await prisma.questionario.findFirst({
                where: {
                    id: questionarioId,
                    criador: {
                        empresaId: parseInt(adminEmpresaId)
                    }
                }
            });
            if (!questionarioVinculado) {
                return response.status(403).json({ message: "Novo questionário não encontrado ou não pertence à sua empresa." });
            }
        }

        const avaliacaoAtualizada = await prisma.avaliacao.update({
            where: { id: avaliacaoId }, // A verificação de propriedade já foi feita
            data: {
              semestre,
              requerLoginCliente: requerLoginCliente, // Atualiza o campo
              questionario: { connect: { id: questionarioId } },
              // criadorId não deve ser alterado aqui, geralmente.
            },
            include: {
              questionario: { select: { id: true, titulo: true } },
              // Mantenha o include de usuarios se necessário na resposta
            },
        });
        return response.json(avaliacaoAtualizada);
    } catch (error) {
        console.error("Erro ao atualizar a avaliação:", error);
        if (error.code === 'P2025') {
             return response.status(404).json({ message: "Erro ao atualizar: Avaliação não encontrada." });
        }
        return response.status(500).json({ error: "Erro ao atualizar a avaliação." });
    }
  }
}