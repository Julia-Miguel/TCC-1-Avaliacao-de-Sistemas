import { prisma } from '../../database/client.js';

export class GetAllQuestionarioController {
    async handle(request, response) {
        
    const questionarios = await prisma.questionario.findMany();
        include: {
            perguntas: true
        }
        return response.json(questionarios);
    }
}