import { prisma } from '../../database/client.js';

export class GetByIdRespostaController {
    async handle(request, response) {
        const { id } = request.params;
        const respostas = await prisma.resposta.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                usuAval: true,
                pergunta: true
            }
        });
        return response.json(respostas);
    }
}