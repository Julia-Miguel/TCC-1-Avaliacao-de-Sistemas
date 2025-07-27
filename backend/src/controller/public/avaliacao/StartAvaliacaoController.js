// ✅ ARQUIVO CORRIGIDO FINAL: backend/src/controller/public/avaliacao/StartAvaliacaoController.js
import { prisma } from '../../../database/client.js';

export class StartAvaliacaoController  {
  async handle(request, response) {
    const { avaliacaoId: avaliacaoIdParam } = request.params;
    const { usuarioId, anonymousSessionId } = request.body;
    const avaliacaoId = parseInt(avaliacaoIdParam, 10);

    if (isNaN(avaliacaoId)) {
      return response.status(400).json({ message: "ID da avaliação na URL é inválido." });
    }

    try {
      // ETAPA 1: BUSCAR A AVALIAÇÃO E VERIFICAR A REGRA DE ACESSO
      const avaliacao = await prisma.avaliacao.findUnique({
        where: { id: avaliacaoId },
        // ✅ CORREÇÃO 1: Usando o nome correto do campo do schema
        select: { requerLoginCliente: true } 
      });

      if (!avaliacao) {
        return response.status(404).json({ message: "Avaliação não encontrada." });
      }

      // ✅ CORREÇÃO 2: Usando a variável com o nome correto
      if (avaliacao.requerLoginCliente && !usuarioId) {
        return response.status(401).json({ 
            message: "Esta avaliação requer login.",
            code: 'LOGIN_REQUIRED'
        });
      }

      if (!avaliacao.requerLoginCliente && !anonymousSessionId) {
        return response.status(400).json({ message: "Identificação do respondente anônimo é necessária." });
      }

      // ETAPA 2: CRIAR OU BUSCAR A SESSÃO
      const whereClause = usuarioId
        ? { avaliacaoId, usuarioId: parseInt(usuarioId) }
        : { avaliacaoId, anonymousSessionId };
        
      const usuAval = await prisma.usuAval.findFirst({ where: whereClause });

      if (!usuAval) {
        await prisma.usuAval.create({
          data: {
            avaliacaoId,
            status: 'INICIADO',
            isFinalizado: false,
            started_at: new Date(),
            ...(usuarioId ? { usuarioId: parseInt(usuarioId) } : { anonymousSessionId }),
          },
        });
      }

      // ETAPA 3: BUSCAR DADOS COMPLETOS PARA ENVIAR AO FRONTEND
      const avaliacaoCompleta = await prisma.avaliacao.findUnique({
        where: { id: avaliacaoId },
        include: {
          criador: { include: { empresa: true } },
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

      // Montar a resposta final
      const responseData = {
        avaliacaoId: avaliacaoCompleta.id,
        semestreAvaliacao: avaliacaoCompleta.semestre,
        requerLoginCliente: avaliacaoCompleta.requerLoginCliente, // Usando o nome correto aqui também
        nomeEmpresa: avaliacaoCompleta.criador.empresa.nome,
        tituloQuestionario: avaliacaoCompleta.questionario.titulo,
        perguntas: (avaliacaoCompleta.questionario.perguntas || [])
          .filter(quePerg => quePerg.pergunta)
          .map(quePerg => ({
            id: quePerg.pergunta.id,
            enunciado: quePerg.pergunta.enunciado,
            obrigatoria: quePerg.pergunta.obrigatoria,
            tipo: quePerg.pergunta.tipos,
            opcoes: quePerg.pergunta.opcoes || [],
          })),
      };

      return response.status(200).json(responseData);

    } catch (error) {
      console.error("Erro crítico ao iniciar avaliação:", error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}