// backend/src/controller/quePerg/GetByIdQuePergController.js
import { prisma } from '../../database/client.js';

export class GetByIdQuePergController {
  async handle(request, response) {
    const { id } = request.params;
    const quePerg = await prisma.quePerg.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        pergunta: {
          select: {
            enunciado: true,
            tipos: true,
          },
        },
        questionario: {
          select: {
            titulo: true,
          },
        },
      },
    });
    return response.json(quePerg);
  }
}