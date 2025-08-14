import { prisma } from '../../../database/client.js';

export class GetPublicAvaliacaoByIdController {
  async handle(request, response) {
    const { avaliacaoId: token } = request.params;

    if (!token) {
      return response.status(400).json({ message: "Token inválido." });
    }

    try {
      const avaliacao = await prisma.avaliacao.findUnique({
        where: { token },
        include: {
          criador: {
            include: {
              empresa: { select: { nome: true } }
            }
          },
          questionario: {
            include: {
              perguntas: {
                include: {
                  pergunta: {
                    include: { opcoes: true }
                  }
                },
                orderBy: { ordem: 'asc' }
              }
            }
          }
        }
      });

      if (!avaliacao) {
        return response.status(404).json({ message: "Avaliação não encontrada." });
      }

      if (!avaliacao.criador) {
        return response.status(500).json({ message: "Configuração inválida: Avaliação sem criador." });
      }
      if (!avaliacao.questionario) {
        return response.status(500).json({ message: "Configuração inválida: Avaliação sem questionário." });
      }

      const perguntasDoQuestionario = avaliacao.questionario.perguntas || [];
      const perguntas = perguntasDoQuestionario
        .filter(quePerg => quePerg.pergunta)
        .map(quePerg => ({
          id: quePerg.pergunta.id,
          enunciado: quePerg.pergunta.enunciado,
          obrigatoria: quePerg.pergunta.obrigatoria,
          tipo: quePerg.pergunta.tipo || quePerg.pergunta.tipos,
          opcoes: quePerg.pergunta.opcoes || [],
        }));

      const responseData = {
        id: avaliacao.id,
        semestreAvaliacao: avaliacao.semestre,
        requerLoginCliente: avaliacao.requerLoginCliente,
        nomeEmpresa: avaliacao.criador.empresa?.nome || null,
        tituloQuestionario: avaliacao.questionario.titulo,
        questionario: avaliacao.questionario,
        perguntas
      };

      return response.status(200).json(responseData);

    } catch (error) {
      console.error("Erro detalhado ao buscar dados da avaliação:", error);
      return response.status(500).json({ message: "Erro interno ao buscar dados da avaliação." });
    }
  }
}
