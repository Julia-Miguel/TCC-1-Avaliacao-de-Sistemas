// backend/src/controller/questionarios/GetQuestionarioAvaliacoesComRespostasController.js
import { prisma } from '../../database/client.js';

export class GetQuestionarioAvaliacoesComRespostasController {
  async handle(request, response) {
    const { questionarioId: questionarioIdParam } = request.params;
    const questionarioId = parseInt(questionarioIdParam);

    // Esta informação virá do token JWT decodificado pelo authMiddleware
    if (!request.user || !request.user.empresaId) {
      return response.status(401).json({ message: "Usuário não autenticado ou ID da empresa não encontrado no token." });
    }
    const { empresaId: adminEmpresaId } = request.user;

    if (isNaN(questionarioId)) {
      return response.status(400).json({ message: "ID do Questionário inválido." });
    }

    try {
      // 1. Verificar se o questionário pertence à empresa do admin logado
      const questionario = await prisma.questionario.findFirst({
        where: {
          id: questionarioId,
          criador: {
            empresaId: parseInt(adminEmpresaId)
          }
        },
        select: { id: true } // Só precisamos saber se existe e pertence
      });

      if (!questionario) {
        return response.status(404).json({ message: "Questionário não encontrado ou não pertence à sua empresa." });
      }

      // 2. Buscar todas as avaliações para este questionário, com detalhes
      const avaliacoesComRespostas = await prisma.avaliacao.findMany({
        where: {
          questionarioId: questionarioId,
          // Adicionalmente, garante que a avaliação também foi criada por um admin da mesma empresa
          // (Isso é redundante se o questionário já foi validado, mas adiciona uma camada de segurança)
          criador: {
            empresaId: parseInt(adminEmpresaId)
          }
        },
        orderBy: {
          created_at: 'desc' // Ou por semestre, etc.
        },
        include: {
          _count: { // Para saber quantos responderam
            select: { usuarios: true } 
          },
          criador: { // Quem criou/agendou a avaliação
            select: { id: true, nome: true, email: true }
          },
          usuarios: { // Estes são os registros UsuAval (respondentes)
            orderBy: { created_at: 'desc' },
            include: {
              usuario: { // Detalhes do respondente, se for um usuário logado
                select: { id: true, nome: true, email: true, tipo: true }
              },
              respostas: { // As respostas dadas por este respondente nesta avaliação
                orderBy: { perguntaId: 'asc' },
                include: {
                  pergunta: { // Detalhes da pergunta original para cada resposta
                    include: {
                      opcoes: { orderBy: { id: 'asc' } } // Opções da pergunta original
                    }
                  }
                }
              }
            }
          }
        }
      });

      return response.json(avaliacoesComRespostas);

    } catch (error) {
      console.error("Erro ao buscar avaliações com respostas:", error);
      return response.status(500).json({ message: "Erro interno ao buscar dados das respostas." });
    }
  }
}