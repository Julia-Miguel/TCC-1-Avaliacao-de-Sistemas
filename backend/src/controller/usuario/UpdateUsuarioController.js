import { prisma } from '../../database/client.js';

export class UpdateUsuarioController {
    async handle(request, response) {
        
        const { id, nome, email, tipo } = request.body;

        const usuarioAtualizado = await prisma.usuario.update({
            where: {
                id: parseInt(id)
            },
            data: {
                nome,
                email,
                tipo
            }
        });
        return response.json(usuarioAtualizado);
    }
}