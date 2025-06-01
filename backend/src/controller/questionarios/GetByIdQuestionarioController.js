// backend/src/controller/questionarios/GetByIdQuestionarioController.js
import { prisma } from '../../database/client.js';

export class GetByIdQuestionarioController {
    async handle(request, response) {
        // ASSUMINDO AUTH MIDDLEWARE
        // const { empresaId } = request.user; // Descomente quando o authMiddleware estiver pronto
        const { id: questionarioId } = request.params;

        // PARA TESTES SEM AUTH
        const { empresaId_para_teste } = request.query;
        const empresaId = empresaId_para_teste; // SUBSTITUA QUANDO O AUTH ESTIVER PRONTO
        
        if (!empresaId) {
            return response.status(400).json({ message: "empresaId é obrigatório (será automático com login)." });
        }

        try {
            const questionario = await prisma.questionario.findFirst({
                where: {
                    id: Number(questionarioId),
                    criador: {
                        empresaId: Number(empresaId)
                    }
                },
                include: {
                    criador: { select: { nome: true } },
                    perguntas: { // Trazendo as perguntas e suas opções
                        include: {
                            pergunta: {
                                include: {
                                    opcoes: true
                                }
                            }
                        }
                    }
                }
            });

            if (!questionario) {
                return response.status(404).json({ message: "Questionário não encontrado ou não pertence a esta empresa." });
            }
            return response.json(questionario);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro interno ao buscar questionário." });
        }
    }
}