import { prisma } from '../../database/client.js';
import { Prisma } from '@prisma/client';

export class DeleteQuePergController {

    async handle(request, response) {

        const { id } = request.body;

        try {
            const quePerg = await prisma.quePerg.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.json(quePerg);

        } catch (error) {

            console.error(error);
            return response.status(400).json({
                message: error.message || 'Unexpected error.'
            });
        }
    }
}