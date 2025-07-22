// ✅ ARQUIVO CORRIGIDO: src/controller/avaliacao/DeleteAvaliacaoController.js
import { prisma } from '../../database/client.js';

export class DeleteAvaliacaoController {
    async handle(request, response) {
        const { id } = request.params; // Correção aqui

        try {
            await prisma.avaliacao.delete({
                where: { id: parseInt(id) }
            });
            return response.status(200).json({ message: "Avaliação deletada com sucesso." });
        } catch (error) {
            if (error.code === 'P2025') {
                return response.status(404).json({ message: "Avaliação não encontrada." });
            }
            return response.status(500).json({ message: "Erro ao deletar avaliação." });
        }
    }
}