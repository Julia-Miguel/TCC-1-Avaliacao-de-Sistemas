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
            criador: { // Filtra pelas avaliações cujo criador...
                empresaId: parseInt(adminEmpresaId) // ...pertence a esta empresa.
            }
        },
        include: {
          questionario: {
            select: {
              id: true, // Adicionado ID para consistência
              titulo: true,
            },
          },
          criador: { // Adicionado para ver quem criou a avaliação
            select: { id: true, nome: true, email: true }
          },
          // A inclusão de 'usuarios' (UsuAval) pode trazer muitos dados.
          // Considere se é realmente necessário na listagem principal ou se busca sob demanda.
          // Para agora, manterei como estava no seu código, mas com _count pode ser melhor.
          usuarios: { // Relação UsuAval
            select: {
              id: true,
              status: true,
              isFinalizado: true,
              usuario: { select: { id: true, nome: true } }, // Respondente logado
              anonymousSessionId: true // Para respondentes anônimos
            }
          },
          _count: { // Contagem de respondentes
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