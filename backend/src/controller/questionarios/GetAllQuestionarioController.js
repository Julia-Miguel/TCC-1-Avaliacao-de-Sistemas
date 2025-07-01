// backend/src/controller/questionarios/GetAllQuestionarioController.js
import { prisma } from '../../database/client.js';

export class GetAllQuestionarioController {
    async handle(request, response) {
        // Esta informação virá do token JWT decodificado pelo authMiddleware
        const { empresaId } = request.user; // Assumindo que o middleware adiciona req.user

        if (!empresaId) {
            // Isso não deveria acontecer se o authMiddleware estiver funcionando
            return response.status(400).json({ message: "ID da Empresa não identificado no token do usuário." });
        }

        try {
            const questionarios = await prisma.questionario.findMany({
                where: {
                    criador: {
                        empresaId: parseInt(empresaId)
                    }
                },
                include: {
                    criador: { select: { id: true, nome: true, email: true } },
                    perguntas: {
                        orderBy: { perguntaId: 'asc' }, // Opcional: ordenar as perguntas
                        include: {
                            pergunta: {
                                include: {
                                    opcoes: {
                                        orderBy: { id: 'asc' } // Opcional: ordenar as opções
                                    }
                                }
                            }
                        }
                    },
                    _count: { select: { avaliacoes: true } }
                },
                orderBy: [
                    { ordem: 'asc' }, // Prioriza a ordem definida pelo usuário
                    { updated_at: 'desc' } // Fallback para ordenação por data de atualização
                ]
            });
            return response.json(questionarios);
        } catch (error) {
            console.error("Erro ao listar questionários:", error);
            return response.status(500).json({ error: "Erro ao listar questionários: " + error.message });
        }
    }
}