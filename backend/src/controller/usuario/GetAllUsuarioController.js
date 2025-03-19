import { prisma } from '../../database/client.js';

export class GetAllUsuarioController {
  async handle(request, response) {

    const usuario = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        created_at: true,
        updated_at: true,
      },
    }); 
    
    return response.json(usuario);
  }
}