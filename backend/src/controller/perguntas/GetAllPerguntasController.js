import { prisma } from '../../database/client.js';

export class GetAllPerguntasController {
  async handle(request, response) {

    const pergunta = await prisma.pergunta.findMany({
      select: {
        id: true,
        enunciado: true,
        tipos: true,
        created_at: true,
        updated_at: true,
      },
    }); 
    
    return response.json(pergunta);
  }
}