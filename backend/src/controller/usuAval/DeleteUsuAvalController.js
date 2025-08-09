import { prisma } from '../../database/client.js';

export class DeleteUsuAvalController {

    async handle(request, response) {

        const { id } = request.body;

        try {
            const usuAval = await prisma.usuAval.delete({
                where: {
                    id: parseInt(id)
                }
            });
            return response.json(usuAval);

        } catch (error) {

            console.error(error);
            return response.status(400).json({
                message: error.message || 'Unexpected error.'
            });
        }
    }
}