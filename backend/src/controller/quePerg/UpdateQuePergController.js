import { parse } from 'path';
import { prisma } from '../../database/client.js';

export class UpdateQuePergController {

    async handle(request, response) {

        const { id, pergunta_id, questionario_id } = request.body;

        const quePerg = await prisma.quePerg.update({
            where: {
                id: parseInt(id)
            },
            data: {
                pergunta: {
                    connect: { id: pergunta_id }
                },
                questionario: {
                    connect: { id: questionario_id }
                }
            }
        });

        return response.json(quePerg);
    }
}