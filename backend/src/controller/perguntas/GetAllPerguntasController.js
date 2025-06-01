import { prisma } from '../../database/client.js';

export class GetAllPerguntasController {
  async handle(request, response) {

    const perguntas = await prisma.pergunta.findMany({
      include: {
        opcoes: true, // Isso diz ao Prisma: "Traga também todas as opções desta pergunta"
      },
    }); 
    
    return response.json(perguntas);
  }
}