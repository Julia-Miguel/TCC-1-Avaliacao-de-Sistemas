// backend/src/controller/perguntas/GetByIdPerguntasController.js

import { prisma } from '../../database/client.js';

export class GetByIdPerguntasController {
    async handle(request, response) {
        const { id } = request.params;
        const { empresaId } = request.user;

        try {
            const pergunta = await prisma.pergunta.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            if (!pergunta) {
                return response.status(404).json({ message: "Pergunta não encontrada." });
            }
            const belongsToEmpresa = await prisma.quePerg.count({
                where: {
                    perguntaId: pergunta.id,
                    questionario: {
                        criador: {
                            empresaId: parseInt(empresaId)
                        }
                    }
                }
            });

            if (belongsToEmpresa === 0) {
                return response.status(404).json({ message: "Pergunta não encontrada ou não pertence à sua empresa." });
            }

            return response.json(pergunta);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro interno ao buscar pergunta." });
        }
    }
}