// backend/src/controller/quePerg/GetAllQuePergController.js
import { prisma } from '../../database/client.js';

export class GetAllQuePergController {
    async handle(request, response) {
        const { questionarioId } = request.query;

        if (!questionarioId) {
            return response.status(400).json({ 
                message: "O ID do questionário é obrigatório para buscar as associações." 
            });
        }

        try {
            const quePergs = await prisma.quePerg.findMany({
                where: {
                    questionarioId: Number(questionarioId),
                },
                orderBy: {
                    id: 'asc'
                },
                include: {
                    questionario: true,
                    pergunta: true
                }
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