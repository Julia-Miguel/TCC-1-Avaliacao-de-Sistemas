// src/controller/quePerg/DeleteQuePergController.js
import { prisma } from '../../database/client.js';

export class DeleteQuePergController {
    async handle(request, response) {
        const { id } = request.params;

        try {
            await prisma.quePerg.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.status(200).json({ message: "Associação removida com sucesso." });
        } catch (error) {
            if (error.code === 'P2025') {
                return response.status(404).json({ message: "Associação não encontrada." });
            }
            console.error(error);
            return response.status(500).json({ message: "Erro ao remover associação." });
        }
    }
}
