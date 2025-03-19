import { prisma } from '../../database/client.js';

export class CreateUsuarioController {

    async handle(request, response) {

        const { nome, email, tipo } = request.body;

        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                tipo,
            }
        });
        

        return response.json(usuario);
    }
}