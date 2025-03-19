import { prisma } from '../../database/client.js';
import { Prisma } from '@prisma/client';

export class DeleteQuestionarioController {
    async handle(request, response) {
        const { id } = request.body;

        try {
            const questionario = await prisma.questionario.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.json(questionario);
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return response.status(400).json({ 
                    message: `[DeleteQuestionarioController] Questionario id: ${id} não existe.` 
                });
            } else {
                return response.status(500).json({ 
                    message: `[DeleteQuestionarioController] ${error.message}` 
                });
            }
        }
    }
}
