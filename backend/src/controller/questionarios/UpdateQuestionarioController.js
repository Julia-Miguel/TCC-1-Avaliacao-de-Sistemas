import { prisma } from '../../database/client.js';

export class UpdateQuestionarioController {

    async handle(request, response) {
        
        const { id, titulo } = request.body;

        const questionario = await prisma.questionario.update({
            where: {
                id: parseInt(id)
            },
            data: {
                titulo,
                updated_at: new Date()
            }
        });

        return response.json(questionario);
    }
}