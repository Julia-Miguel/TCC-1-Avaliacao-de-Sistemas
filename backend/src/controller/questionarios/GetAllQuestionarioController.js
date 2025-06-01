// backend/src/controller/questionarios/GetAllQuestionariosController.js
import { prisma } from '../../database/client.js';

export class GetAllQuestionarioController {
    async handle(request, response) {
        // ASSUMINDO AUTH MIDDLEWARE
        // const { empresaId } = request.user; // Descomente quando o authMiddleware estiver pronto

        // PARA TESTES SEM AUTH, você pode receber o empresaId como query param
        const { empresaId_para_teste } = request.query;
        const empresaId = empresaId_para_teste; // SUBSTITUA QUANDO O AUTH ESTIVER PRONTO

        if (!empresaId) {
            return response.status(400).json({ message: "empresaId é obrigatório para listar questionários (será automático com login)." });
        }

        try {
            const questionarios = await prisma.questionario.findMany({
                where: {
                    criador: { // Filtra pelos questionários cujo criador...
                        empresaId: Number(empresaId) // ...pertence a esta empresa.
                    }
                },
                include: {
                    criador: {
                        select: { nome: true, email: true } // Para mostrar quem criou
                    }
                    // Poderia incluir QuePerg e Perguntas aqui se necessário na listagem
                }
            });
            return response.json(questionarios);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Erro interno ao listar questionários." });
        }
    }
}