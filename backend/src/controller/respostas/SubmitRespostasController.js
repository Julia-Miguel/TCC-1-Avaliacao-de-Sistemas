import { prisma } from '../../database/client.js';

async function validateRequiredQuestions(avaliacaoId, respostas) {
  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id: avaliacaoId },
    include: {
      questionario: {
        include: {
          perguntas: {
            where: { pergunta: { obrigatoria: true } },
            include: { pergunta: true },
          },
        },
      },
    },
  });

  if (!avaliacao || !avaliacao.questionario) {
    return { error: true, status: 404, message: "Avaliação ou questionário não encontrado para validação." };
  }

  for (const quePerg of avaliacao.questionario.perguntas) {
    const perguntaObrigatoria = quePerg.pergunta;
    const respostaEnviada = respostas.find(r => {
      const pid = parseInt(r.perguntaId, 10);
      return pid === perguntaObrigatoria.id;
    });

    const texto = respostaEnviada ? (respostaEnviada.textoResposta ?? respostaEnviada.resposta) : null;

    if (!respostaEnviada || !texto || texto.trim() === '') {
      return {
        error: true,
        status: 400,
        message: `A pergunta "${perguntaObrigatoria.enunciado}" é obrigatória.`,
      };
    }
  }
  return { error: false };
}

export class SubmitRespostasController {
  async handle(request, response) {
    const { avaliacaoId: token } = request.params;
    const { respostas, usuarioId, anonymousSessionId, usuAvalId } = request.body;

    if (!token || !Array.isArray(respostas) || (!usuarioId && !anonymousSessionId && !usuAvalId)) {
      return response.status(400).json({ message: "Dados de entrada inválidos ou incompletos." });
    }

    try {
      const avaliacao = await prisma.avaliacao.findUnique({
        where: { token: token },
        select: { id: true }
      });

      if (!avaliacao) {
        return response.status(404).json({ message: "Avaliação para submissão não encontrada." });
      }
      const avaliacaoId = avaliacao.id;
      const validationResult = await validateRequiredQuestions(avaliacaoId, respostas);

      if (validationResult.error) {
        return response.status(validationResult.status).json({ message: validationResult.message });
      }

      let usuAvalRecord = null;

      if (usuAvalId) {
        usuAvalRecord = await prisma.usuAval.findUnique({
          where: { id: parseInt(usuAvalId, 10) }
        });
      } else {
        const whereClause = usuarioId
          ? { avaliacaoId_usuarioId: { avaliacaoId, usuarioId: parseInt(usuarioId, 10) } }
          : { avaliacaoId_anonymousSessionId: { avaliacaoId, anonymousSessionId } };

        usuAvalRecord = await prisma.usuAval.findUnique({ where: whereClause });
      }

      if (!usuAvalRecord) {
        return response.status(404).json({ message: "Sessão de avaliação não encontrada. Recarregue a página e tente novamente." });
      }

      if (usuAvalRecord.isFinalizado) {
        return response.status(400).json({ message: "Esta avaliação já foi finalizada." });
      }

      await prisma.$transaction(async (tx) => {
        await tx.resposta.deleteMany({ where: { usuAvalId: usuAvalRecord.id } });

        const respostasParaSalvar = respostas
          .map(r => {
            const textoResposta = r.textoResposta ?? r.resposta;
            return {
              usuAvalId: usuAvalRecord.id,
              perguntaId: parseInt(r.perguntaId, 10),
              resposta: textoResposta,
            };
          })
          .filter(r => r.resposta && r.resposta.toString().trim() !== '');

        if (respostasParaSalvar.length > 0) {
          await tx.resposta.createMany({ data: respostasParaSalvar });
        }

        await tx.usuAval.update({
          where: { id: usuAvalRecord.id },
          data: {
            status: 'CONCLUIDO',
            isFinalizado: true,
            finished_at: new Date(),
          },
        });
      });

      return response.status(200).json({ message: "Respostas salvas com sucesso" });

    } catch (error) {
      console.error("Erro ao submeter respostas:", error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}
