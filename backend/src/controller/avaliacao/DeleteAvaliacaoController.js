import { prisma } from '../../database/client.js';
import { Prisma } from '@prisma/client';

export class DeleteAvaliacaoController {

    async handle(request, response) {

        const { id } = request.body;

        try {
            const avaliacao = await prisma.avaliacao.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.json(avaliacao);

        } catch (error) {

            console.error(error);
            return response.status(400).json({
                message: error.message || 'Unexpected error.'
            });
        }
    }
}