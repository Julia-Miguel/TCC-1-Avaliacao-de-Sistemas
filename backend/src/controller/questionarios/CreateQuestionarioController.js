import { prisma } from '../../database/client.js';

export class CreateQuestionarioController {

    async handle(request, response) {

        const { titulo, perguntas, avaliacoes } = request.body;

        const questionario = await prisma.questionario.create({
            data: {
                titulo,
            }
        });

        return response.json(questionario);
    }
}