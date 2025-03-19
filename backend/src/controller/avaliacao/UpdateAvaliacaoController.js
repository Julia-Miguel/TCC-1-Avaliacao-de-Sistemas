import { parse } from 'path';
import { prisma } from '../../database/client.js';

export class UpdateAvaliacaoController {

    async handle(request, response) {

        const { id, semestre, questionario_id } = request.body;

        const avaliacao = await prisma.avaliacao.update({
            where: {
                id: parseInt(id)
            },
            data: {
                semestre,
                questionario: {
                    connect: { id: questionario_id }
                }
            }
        });

        return response.json(avaliacao);
    }
}