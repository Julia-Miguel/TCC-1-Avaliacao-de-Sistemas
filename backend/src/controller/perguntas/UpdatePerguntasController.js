import { prisma } from '../../database/client.js';

export class UpdatePerguntasController {
    async handle(request, response) {
        
        const { id, enunciado, tipos } = request.body;

        const perguntaAtualizada = await prisma.pergunta.update({
            where: {
                id: parseInt(id)
            },
            data: {
                enunciado,
                tipos
            }
        });
        return response.json(perguntaAtualizada);
    }
}