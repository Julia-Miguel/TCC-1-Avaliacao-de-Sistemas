import { prisma } from '../../database/client.js';

export class GetAllAvaliacaoController {
  async handle(request, response) {

    const avaliacao = await prisma.avaliacao.findMany({

      select: {
        id: true,
        semestre: true,
        questionario: true
      },
    }); 
    
    return response.json(avaliacao);
  }
}
