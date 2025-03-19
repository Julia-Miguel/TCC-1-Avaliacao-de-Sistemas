import { stat } from 'fs';
import { prisma } from '../../database/client.js';

export class GetAllUsuAvalController {
  async handle(request, response) {

    const usuAval = await prisma.usuAval.findMany({

      select: {
        id: true,
        status: true,
        isFinalizado: true,
        usuario: true,
        avaliacao: true
      },
    }); 
    
    return response.json(usuAval);
  }
}
