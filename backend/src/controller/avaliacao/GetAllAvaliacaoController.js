// backend/src/controller/avaliacao/GetAllAvaliacaoController.js
import { prisma } from '../../database/client.js';

export class GetAllAvaliacaoController {
  async handle(request, response) {
    if (!request.user || !request.user.empresaId) {
        return response.status(401).json({ message: "Usuário não autenticado ou ID da empresa não encontrado no token." });
    }
    const { empresaId: adminEmpresaId } = request.user;

    try {
      const avaliacoes = await prisma.avaliacao.findMany({
        where: {
            criador: {
                empresaId: parseInt(adminEmpresaId)
            }
        },
        include: {
          questionario: {
            select: {
              id: true,
              titulo: true,
            },
          },
          criador: {
            select: { id: true, nome: true, email: true }
          },
          usuarios: {
            select: {
              id: true,
              status: true,
              isFinalizado: true,
              usuario: { select: { id: true, nome: true } },
              anonymousSessionId: true
            }
          },
          _count: {
            select: { usuarios: true }
          }
        },
        orderBy: {
            created_at: 'desc'
        }
      });
      return response.json(avaliacoes);
    } catch (error) {
      console.error("Erro ao buscar as avaliações:", error);
      return response.status(500).json({ error: "Erro ao buscar as avaliações." });
    }
  }
}