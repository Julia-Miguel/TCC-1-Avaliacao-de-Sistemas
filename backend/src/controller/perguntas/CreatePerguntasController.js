import { prisma } from '../../database/client.js';

export class CreatePerguntasController {

    async handle(request, response) {

        const { enunciado, tipos } = request.body;

        const pergunta = await prisma.pergunta.create({
            data: {
                enunciado,
                tipos,
            }
        });
        

        return response.json(pergunta);
    }
}