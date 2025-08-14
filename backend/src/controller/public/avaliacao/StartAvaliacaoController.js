import { prisma } from '../../../database/client.js';

export class StartAvaliacaoController {
  async handle(request, response) {
    const { avaliacaoId: token } = request.params;
    const { usuarioId, anonymousSessionId } = request.body;

    if (!token) {
      return response.status(400).json({ message: "Token da avaliação na URL é obrigatório." });
    }

    try {
      const avaliacaoPrincipal = await prisma.avaliacao.findUnique({
        where: { token },
        include: {
          criador: { 
            select: { 
              empresaId: true,
              empresa: { select: { nome: true } }
            } 
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

      if (!avaliacaoPrincipal) {
        return response.status(404).json({ message: "Avaliação não encontrada." });
      }

      const empresaIdDaAvaliacao = avaliacaoPrincipal.criador?.empresaId;
      if (!empresaIdDaAvaliacao) {
        return response.status(500).json({ message: "Não foi possível identificar a empresa desta avaliação." });
      }

      const avaliacaoIdInterno = avaliacaoPrincipal.id;
      const whereClause = usuarioId ? { usuarioId: parseInt(usuarioId, 10) } : { anonymousSessionId };

      let usuAval = await prisma.usuAval.findFirst({
        where: { avaliacaoId: avaliacaoIdInterno, ...whereClause }
      });

      if (!usuAval) {
        usuAval = await prisma.usuAval.create({
          data: {
            avaliacao: { connect: { id: avaliacaoIdInterno } },
            status: 'INICIADO',
            isFinalizado: false,
            started_at: new Date(),
            ...(usuarioId ? { usuario: { connect: { id: parseInt(usuarioId, 10) } } } : { anonymousSessionId })
          }
        });
      }

      if (usuAval.isFinalizado) {
        return response.status(200).json({ hasResponded: true, usuAval });
      }

      let perguntasFinais = (avaliacaoPrincipal.questionario.perguntas || [])
        .filter(quePerg => quePerg.pergunta)
        .map(quePerg => ({
          id: quePerg.pergunta.id,
          enunciado: quePerg.pergunta.enunciado,
          obrigatoria: quePerg.pergunta.obrigatoria,
          tipo: quePerg.pergunta.tipo || quePerg.pergunta.tipos,
          opcoes: quePerg.pergunta.opcoes || [],
          isSatisfactionQuestion: false,
        }));

      const questionarioSatisfacao = await prisma.questionario.findFirst({
        where: {
          eh_satisfacao: true,
          ativo: true,
          criador: { empresaId: empresaIdDaAvaliacao }
        },
        include: {
          perguntas: {
            orderBy: { ordem: 'asc' },
            include: {
              pergunta: { include: { opcoes: true } },
            },
          },
        },
      });
      
      if (questionarioSatisfacao) {
        const perguntasDeSatisfacao = (questionarioSatisfacao.perguntas || [])
          .filter(quePerg => quePerg.pergunta)
          .map(quePerg => ({
            id: quePerg.pergunta.id,
            enunciado: quePerg.pergunta.enunciado,
            obrigatoria: false,
            tipo: quePerg.pergunta.tipo || quePerg.pergunta.tipos,
            opcoes: quePerg.pergunta.opcoes || [],
            isSatisfactionQuestion: true,
          }));
        
        if (perguntasDeSatisfacao.length > 0 && perguntasFinais.length > 0) {
          perguntasFinais.push({
            id: -1,
            tipo: 'SEPARADOR',
            enunciado: 'Avaliação do Usuário',
            obrigatoria: false,
            opcoes: [],
            isSatisfactionQuestion: true,
          });
        }

        perguntasFinais.push(...perguntasDeSatisfacao);
      }

      const responseData = {
        tituloQuestionario: avaliacaoPrincipal.questionario.titulo,
        nomeEmpresa: avaliacaoPrincipal.criador.empresa?.nome || null,
        perguntas: perguntasFinais,
        hasResponded: usuAval.isFinalizado,
        usuAval
      };

      return response.status(200).json(responseData);

    } catch (error) {
      console.error("Erro crítico ao iniciar avaliação:", error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}
