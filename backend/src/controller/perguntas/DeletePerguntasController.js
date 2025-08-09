// src/controller/perguntas/DeletePerguntasController.js
import { prisma } from '../../database/client.js';

export class DeletePerguntasController {
    async handle(request, response) {
        const { id } = request.params;

        try {
            await prisma.pergunta.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.status(200).json({ message: 'Pergunta excluída com sucesso.' });
        } catch (error) {
            if (error.code === 'P2025') {
                return response.status(404).json({ message: "Pergunta não encontrada." });
            }
            return response.status(500).json({ message: "Erro interno ao deletar pergunta.", error: error.message });
        }
    }
}
