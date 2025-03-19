import { prisma } from '../../database/client.js';

export class GetByIdUsuarioController {

    async handle(request, response) {
        const { id } = request.params;
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return response.json(usuario);
    }
}