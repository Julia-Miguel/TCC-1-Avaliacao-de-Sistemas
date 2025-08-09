// src/controller/perguntas/UpdatePerguntasController.js
import { prisma } from '../../database/client.js';

export class UpdatePerguntasController {
    async handle(request, response) {
        const { id } = request.params;
        const { enunciado, tipos, obrigatoria } = request.body;

        try {
            const pergunta = await prisma.pergunta.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    enunciado,
                    tipos,
                    obrigatoria
                }
            });
            return response.json(pergunta);
        } catch (error) {
            if (error.code === 'P2025') {
                return response.status(404).json({ message: "Pergunta não encontrada." });
            }
            return response.status(400).json({ message: "Erro ao atualizar pergunta.", error: error.message });
        }
    }
}
