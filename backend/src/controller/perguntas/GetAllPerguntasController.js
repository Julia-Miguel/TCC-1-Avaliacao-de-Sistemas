import { prisma } from '../../database/client.js';

export class GetAllPerguntasController {
  async handle(request, response) {
    const { empresaId } = request.user;

    if (!empresaId) {
      return response.status(401).json({ message: "ID da empresa não identificado no token." });
    }

    try {
      const perguntas = await prisma.pergunta.findMany({
        where: {
          questionarios: {
            some: {
              questionario: {
                criador: {
                  empresaId: parseInt(empresaId)
                }
              }
            }
          }
        },
        include: {
          opcoes: true,
        },
        orderBy: {
          created_at: 'desc'
        }
      }); 
      
      return response.json(perguntas);

    } catch (error) {
      console.error("Erro ao buscar perguntas da empresa:", error);
      return response.status(500).json({ message: "Erro interno ao buscar perguntas." });
    }
  }
}