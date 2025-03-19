import { prisma } from '../../database/client.js';

export class GetByIdQuestionarioController {

    async handle(request, response) {
        const { id } = request.params;
        const questionario = await prisma.questionario.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return response.json(questionario);
    }
}