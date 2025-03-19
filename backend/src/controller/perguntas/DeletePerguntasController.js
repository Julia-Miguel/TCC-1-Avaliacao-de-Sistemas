import { prisma } from '../../database/client.js';
import { Prisma } from '@prisma/client';

export class DeletePerguntasController {
    async handle(request, response) {
        const { id } = request.body;

        try {
            const pergunta = await prisma.pergunta.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.json(pergunta);
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return response.status(400).json({ 
                    message: `[DeletePerguntaController] Pergunta id: ${id} não existe.` 
                });
            } else {
                return response.status(500).json({ 
                    message: `[DeletePerguntaController] ${error.message}` 
                });
            }
        }
    }
}
