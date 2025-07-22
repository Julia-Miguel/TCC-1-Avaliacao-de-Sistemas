// src/controller/perguntas/DeletePerguntasController.js
import { prisma } from '../../database/client.js';

export class DeletePerguntasController {
    async handle(request, response) {
        // ✅ CORREÇÃO: Pegando o 'id' dos parâmetros da URL
        const { id } = request.params;

        try {
            await prisma.pergunta.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.status(200).json({ message: 'Pergunta excluída com sucesso.' });
        } catch (error) {
            if (error.code === 'P2025') { // Código de erro do Prisma para "não encontrado"
                return response.status(404).json({ message: "Pergunta não encontrada." });
            }
            return response.status(500).json({ message: "Erro interno ao deletar pergunta.", error: error.message });
        }
    }
}
