import { prisma } from '../../database/client.js';

export class CreateUsuAvalController {

    async handle(request, response) {

        const { usuario_id, avaliacao_id, status, isFinalizado } = request.body;

        const usuAval = await prisma.usuAval.create({
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