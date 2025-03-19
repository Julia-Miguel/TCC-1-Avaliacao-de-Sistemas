import { parse } from 'path';
import { prisma } from '../../database/client.js';

export class UpdateUsuAvalController {

    async handle(request, response) {

        const { id, usuario_id, avaliacao_id, status, isFinalizado } = request.body;

        const usuAval = await prisma.usuAval.update({
            where: {
                id: parseInt(id)
            },
            data: {
                status,
                isFinalizado,
                usuario: {
                    connect: { id: usuario_id }
                },
                avaliacao: {
                    connect: { id: avaliacao_id }
                }
            }
        });

        return response.json(usuAval);
    }
}