import { prisma } from '../../../database/client.js';

export class StartAvaliacaoController {
  async handle(request, response) {
    const { avaliacaoId: avaliacaoIdParam } = request.params;
    const { usuarioId, anonymousSessionId } = request.body;
    const avaliacaoId = parseInt(avaliacaoIdParam, 10);

    if (isNaN(avaliacaoId)) {
      return response.status(400).json({ message: "ID da avaliação na URL é inválido." });
    }

    if (!usuarioId && !anonymousSessionId) {
      return response.status(400).json({ message: "Identificação do respondente é necessária." });
    }

    try {
      // Etapa 1: Garantir que a sessão de avaliação exista.
      const whereClause = usuarioId
        ? { avaliacaoId, usuarioId }
        : { avaliacaoId, anonymousSessionId };

      const existingUsuAval = await prisma.usuAval.findFirst({ where: whereClause });

      if (!existingUsuAval) {
        await prisma.usuAval.create({
          data: {
            avaliacaoId,
            status: 'INICIADO',
            isFinalizado: false,
            ...(usuarioId ? { usuarioId } : { anonymousSessionId }),
          },
        });
      }

      // Etapa 2: Buscar os dados da avaliação com a inclusão correta.
      const avaliacao = await prisma.avaliacao.findUnique({
        where: { id: avaliacaoId },
        include: {
          criador: {
            include: {
              empresa: true,
            },
          },
          questionario: {
            include: {
              perguntas: {
                orderBy: { ordem: 'asc' },
                include: {
                  pergunta: { include: { opcoes: true } },
                },
              },
            },
          },
        },
      });

      if (!avaliacao) {
        return response.status(404).json({ message: "Nenhuma avaliação foi encontrada com o ID fornecido." });
      }
      if (!avaliacao.questionario) {
        return response.status(404).json({ message: "Configuração inválida: Questionário não encontrado." });
      }
      if (!avaliacao.criador || !avaliacao.criador.empresa) {
          return response.status(500).json({ message: "Configuração inválida: A avaliação não está associada a uma empresa." });
      }


      // Etapa 3: Montar a resposta final.
      const responseData = {
        avaliacaoId: avaliacao.id,
        semestreAvaliacao: avaliacao.semestre,
        requerLoginCliente: avaliacao.requer_login,
        nomeEmpresa: avaliacao.criador.empresa.nome,
        tituloQuestionario: avaliacao.questionario.titulo,
        perguntas: (avaliacao.questionario.perguntas || [])
          .filter(quePerg => quePerg.pergunta)
          .map(quePerg => ({
            id: quePerg.pergunta.id,
            enunciado: quePerg.pergunta.enunciado,
            obrigatoria: quePerg.pergunta.obrigatoria,
            // --- CORREÇÃO DEFINITIVA AQUI ---
            // Lendo do campo 'tipos' (plural) do banco de dados e enviando como 'tipo' (singular) para o frontend.
            tipo: quePerg.pergunta.tipos, 
            opcoes: quePerg.pergunta.opcoes || [],
          })),
      };

      return response.status(200).json(responseData);

    } catch (error) {
      console.error("Erro crítico ao iniciar e buscar avaliação:", error);
      return response.status(500).json({ message: "Erro interno do servidor ao processar a avaliação." });
    }
  }
}
