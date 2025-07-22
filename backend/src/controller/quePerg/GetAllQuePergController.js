// backend/src/controller/quePerg/GetAllQuePergController.js
import { prisma } from '../../database/client.js';

export class GetAllQuePergController {
    async handle(request, response) {
        const { questionarioId } = request.query;

        // Validação para garantir que o ID do questionário foi fornecido
        if (!questionarioId) {
            return response.status(400).json({ 
                message: "O ID do questionário é obrigatório para buscar as associações." 
            });
        }

        try {
            const quePergs = await prisma.quePerg.findMany({
                where: {
                    // Garante que o ID seja tratado como número
                    questionarioId: Number(questionarioId),
                },
                orderBy: {
                    id: 'asc' // Ordena por ID para consistência
                },
                // ----- ESTA É A CORREÇÃO -----
                // Inclui os dados completos do questionário e da pergunta relacionados
                include: {
                    questionario: true,
                    pergunta: true
                }
                // -----------------------------
            });

            return response.json(quePergs);

        } catch (error) {
            console.error(error);
            return response.status(500).json({
                 message: "Erro ao buscar associações.", 
                 error: error.message 
            });
        }
    }
}