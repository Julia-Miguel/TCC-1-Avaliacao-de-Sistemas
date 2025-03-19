import { prisma } from '../../database/client.js';

export class GetByIdPerguntasController {

    async handle(request, response) {
        const { id } = request.params;
        const pergunta = await prisma.pergunta.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return response.json(pergunta);
    }
}