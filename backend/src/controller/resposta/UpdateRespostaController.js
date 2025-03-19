import { parse } from 'path';
import { prisma } from '../../database/client.js';

export class UpdateRespostaController {

    async handle(request, response) {

        const { id, resposta, usuAval_id, pergunta_id } = request.body;

        const respostas = await prisma.resposta.update({
            where: {
                id: parseInt(id)
            },
            data: {
                resposta,
                usuAval: {
                    connect: { id: usuAval_id }
                },
                pergunta: {
                    connect: { id: pergunta_id }
                }
            }
        });

        return response.json(respostas);
    }
}