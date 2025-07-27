import { prisma } from '../../database/client.js';

/**
 * Valida se todas as perguntas obrigatórias de uma avaliação foram respondidas.
 * @param {number} avaliacaoId - O ID da avaliação.
 * @param {Array<{perguntaId: number, textoResposta: string}>} respostas - A lista de respostas enviadas.
 * @returns {Promise<{error: boolean, status?: number, message?: string}>} - Objeto de resultado da validação.
 */
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
    return { error: true, status: 404, message: "Avaliação ou questionário não encontrado." };
  }

  for (const quePerg of avaliacao.questionario.perguntas) {
    const perguntaObrigatoria = quePerg.pergunta;
    const respostaEnviada = respostas.find(r => r.perguntaId === perguntaObrigatoria.id);

    if (!respostaEnviada || !respostaEnviada.textoResposta || respostaEnviada.textoResposta.trim() === '') {
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
    const { avaliacaoId: avaliacaoIdParam } = request.params;
    const { respostas, usuarioId, anonymousSessionId } = request.body;
    const avaliacaoId = parseInt(avaliacaoIdParam, 10);

    if (isNaN(avaliacaoId) || !Array.isArray(respostas) || (!usuarioId && !anonymousSessionId)) {
      return response.status(400).json({ message: "Dados de entrada inválidos ou incompletos." });
    }

    try {
      const validationResult = await validateRequiredQuestions(avaliacaoId, respostas);

      if (validationResult.error) {
        return response.status(validationResult.status).json({ message: validationResult.message });
      }
      
      const whereClause = usuarioId
        ? { avaliacaoId_usuarioId: { avaliacaoId, usuarioId: parseInt(usuarioId) } }
        : { avaliacaoId_anonymousSessionId: { avaliacaoId, anonymousSessionId } };

      const usuAvalRecord = await prisma.usuAval.findUnique({ where: whereClause });

      if (!usuAvalRecord) {
        return response.status(404).json({ message: "Sessão de avaliação não encontrada. Recarregue a página e tente novamente." });
      }

      if (usuAvalRecord.isFinalizado) {
        return response.status(400).json({ message: "Esta avaliação já foi finalizada." });
      }

      await prisma.$transaction(async (tx) => {
        await tx.resposta.deleteMany({ where: { usuAvalId: usuAvalRecord.id } });

        // CORREÇÃO: Usa 'textoResposta' e o schema do banco espera o campo 'resposta'
        const respostasParaSalvar = respostas
          .filter(r => r.textoResposta && r.textoResposta.trim() !== '')
          .map(r => ({
            usuAvalId: usuAvalRecord.id,
            perguntaId: parseInt(r.perguntaId, 10),
            resposta: r.textoResposta, // Salva o valor de 'textoResposta' no campo 'resposta' do DB
          }));

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

      return response.status(201).json({ message: "Respostas enviadas com sucesso!" });

    } catch (error) {
      console.error("Erro ao submeter respostas:", error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}