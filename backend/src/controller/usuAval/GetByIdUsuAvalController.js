import { prisma } from '../../database/client.js';

export class GetByIdUsuAvalController {
    async handle(request, response) {
        const { id } = request.params;
        const usuAval = await prisma.usuAval.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                usuario: true,
                avaliacao: true
            }
        });
        return response.json(usuAval);
    }
}