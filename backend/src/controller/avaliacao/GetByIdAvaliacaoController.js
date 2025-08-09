// src/controller/avaliacao/GetByIdAvaliacaoController.js
import { prisma } from '../../database/client.js';

export class GetByIdAvaliacaoController {
    async handle(request, response) {
        const { id } = request.params;
        const { empresaId } = request.user; // Pega o ID da empresa do token

        try {
            const avaliacao = await prisma.avaliacao.findFirst({
                where: {
                    id: parseInt(id),
                    criador: {
                        empresaId: parseInt(empresaId)
                    }
                },
                include: {
                    questionario: true
                }
            });

            if (!avaliacao) {
                return response.status(404).json({ message: "Avaliação não encontrada ou não pertence à sua empresa." });
            }

            return response.json(avaliacao);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro ao buscar avaliação." });
        }
    }
}
