// ✅ ARQUIVO CORRIGIDO: src/controller/avaliacao/UpdateAvaliacaoController.js
import { prisma } from '../../database/client.js';

export class UpdateAvaliacaoController {
    async handle(request, response) {
        const { id } = request.params; // Correção aqui
        const { semestre } = request.body;

        try {
            const avaliacao = await prisma.avaliacao.update({
                where: { id: parseInt(id) },
                data: { semestre }
            });
            return response.json(avaliacao);
        } catch (error) {
            if (error.code === 'P2025') {
                return response.status(404).json({ message: "Avaliação não encontrada." });
            }
            return response.status(400).json({ message: "Erro ao atualizar avaliação." });
        }
    }
}