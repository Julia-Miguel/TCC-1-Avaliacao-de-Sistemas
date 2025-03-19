import { prisma } from '../../database/client.js';

export class GetAllQuePergController {
  async handle(request, response) {

    const quePerg = await prisma.quePerg.findMany({

      select: {
        id: true,
        pergunta: true,
        questionario: true
      },
    }); 
    
    return response.json(quePerg);
  }
}
