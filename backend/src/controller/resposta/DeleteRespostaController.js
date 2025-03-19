import { prisma } from '../../database/client.js';
import { Prisma } from '@prisma/client';

export class DeleteRespostaController {

    async handle(request, response) {

        const { id } = request.body;

        try {
            const resposta = await prisma.resposta.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.json(resposta);

        } catch (error) {

            console.error(error);
            return response.status(400).json({
                message: error.message || 'Unexpected error.'
            });
        }
    }
}