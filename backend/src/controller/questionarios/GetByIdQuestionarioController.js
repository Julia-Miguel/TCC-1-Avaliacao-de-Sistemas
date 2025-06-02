// backend/src/controller/questionarios/GetByIdQuestionarioController.js
import { prisma } from '../../database/client.js';

export class GetByIdQuestionarioController {
    async handle(request, response) {
        const { id: questionarioIdParam } = request.params;
        const questionarioId = parseInt(questionarioIdParam);

        // Esta informação virá do token JWT decodificado pelo authMiddleware
        const { empresaId } = request.user; // Assumindo que o middleware adiciona req.user

        if (!empresaId) {
            return response.status(400).json({ message: "ID da Empresa não identificado no token do usuário." });
        }
        if (isNaN(questionarioId)) {
            return response.status(400).json({ message: "ID do Questionário inválido." });
        }

        try {
            const questionario = await prisma.questionario.findFirst({
                where: {
                    id: questionarioId,
                    criador: { // Garante que o questionário pertence à empresa do admin logado
                        empresaId: parseInt(empresaId)
                    }
                },
                include: {
                    criador: { select: { id: true, nome: true, email: true } },
                    perguntas: {
                        include: {
                            pergunta: {
                                include: {
                                    opcoes: true
                                }
                            }
                        }
                    }
                },
            });

            if (!questionario) {
                return response.status(404).json({ error: "Questionário não encontrado ou não pertence à sua empresa." });
            }
            return response.json(questionario);
        } catch (error) {
            console.error("Erro ao buscar questionário:", error);
            return response.status(500).json({ error: "Erro ao buscar questionário: " + error.message });
        }
    }
}