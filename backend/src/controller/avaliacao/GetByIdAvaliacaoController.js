import { prisma } from '../../database/client.js';

export class GetByIdAvaliacaoController {
    async handle(request, response) {
        const { id } = request.params;
        const avaliacao = await prisma.avaliacao.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                questionario: true
            }
        });
        return response.json(avaliacao);
    }
}