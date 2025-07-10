import { prisma } from '../../../database/client.js';

export class StartAvaliacaoController {
  async handle(request, response) {
    const { avaliacaoId: avaliacaoIdParam } = request.params;
    const { usuarioId, anonymousSessionId } = request.body;
    const avaliacaoId = parseInt(avaliacaoIdParam, 10);

    // Validação básica
    if (isNaN(avaliacaoId) || (!usuarioId && !anonymousSessionId)) {
      return response.status(400).json({ message: "Dados de entrada inválidos." });
    }

    try {
      const whereClause = usuarioId
        ? { avaliacaoId_usuarioId: { avaliacaoId, usuarioId } }
        : { avaliacaoId_anonymousSessionId: { avaliacaoId, anonymousSessionId } };

      const createClause = usuarioId
        ? { avaliacaoId, usuarioId, status: 'INICIADO', isFinalizado: false }
        : { avaliacaoId, anonymousSessionId, status: 'INICIADO', isFinalizado: false };

      // O upsert é perfeito aqui:
      // - Tenta encontrar um registro com base no 'where'.
      // - Se encontrar, não faz nada (o 'update' está vazio).
      // - Se NÃO encontrar, cria um novo registro com os dados do 'create'.
      await prisma.usuAval.upsert({
        where: whereClause,
        update: {}, // Não fazemos nada se já existir
        create: createClause,
      });

      // Retorna sucesso. Não precisamos enviar dados de volta.
      return response.status(200).json({ message: "Sessão de avaliação iniciada." });

    } catch (error) {
      // O código P2002 (unique constraint failed) pode acontecer em uma condição de corrida.
      // Nesse caso, o registro já existe, o que é o comportamento desejado.
      if (error.code === 'P2002') {
        return response.status(200).json({ message: "Sessão já existente." });
      }
      console.error("Erro ao iniciar avaliação:", error);
      return response.status(500).json({ message: "Erro interno ao iniciar a avaliação." });
    }
  }
}
