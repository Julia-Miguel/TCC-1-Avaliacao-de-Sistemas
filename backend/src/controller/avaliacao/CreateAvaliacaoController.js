import { prisma } from '../../database/client.js';

export class CreateAvaliacaoController {

    async handle(request, response) {

        const { semestre, questionario_id } = request.body;

        const avaliacao = await prisma.avaliacao.create({
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