import { prisma } from '../../database/client.js';

async function validateRequiredQuestions(avaliacaoId, respostas) {
  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id: avaliacaoId },
    include: {
      questionario: {
        include: {
          perguntas: {
            where: {
              pergunta: {
                obrigatoria: true, 
              },
            },
            include: {
              pergunta: true,
            },
          },
        },
      },
    },
  });

  if (!avaliacao) {
    return { error: true, status: 404, message: "Avaliação não encontrada." };
  }

  for (const quePerg of avaliacao.questionario.perguntas) {
    const perguntaObrigatoria = quePerg.pergunta;
    const respostaEnviada = respostas.find(r => r.perguntaId === perguntaObrigatoria.id);

    if (!respostaEnviada || !respostaEnviada.respostaTexto || respostaEnviada.respostaTexto.trim() === '') {
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
      return response.status(400).json({ message: "Dados de entrada inválidos." });
    }

    try {
      const validationResult = await validateRequiredQuestions(avaliacaoId, respostas);
      if (validationResult.error) {
        return response.status(validationResult.status).json({ message: validationResult.message });
      }
      const whereClause = usuarioId
        ? { avaliacaoId_usuarioId: { avaliacaoId, usuarioId } }
        : { avaliacaoId_anonymousSessionId: { avaliacaoId, anonymousSessionId } };

      const dataPayload = { status: 'CONCLUIDO', isFinalizado: true };

      const createClause = usuarioId
        ? { avaliacaoId, usuarioId, ...dataPayload }
        : { avaliacaoId, anonymousSessionId, ...dataPayload };

      const usuAvalRecord = await prisma.usuAval.upsert({
        where: whereClause,
        update: dataPayload,
        create: createClause,  
      });

      await prisma.resposta.deleteMany({
        where: { usuAvalId: usuAvalRecord.id }
      });

      const respostasParaSalvar = respostas
        .filter(r => r.respostaTexto && r.respostaTexto.trim() !== '')
        .map(r => ({
          usuAvalId: usuAvalRecord.id,
          perguntaId: parseInt(r.perguntaId, 10),
          resposta: r.respostaTexto,
        }));

      if (respostasParaSalvar.length > 0) {
        await prisma.resposta.createMany({
          data: respostasParaSalvar,
        });
      }

      return response.status(201).json({ message: "Respostas enviadas com sucesso!" });

    } catch (error) {
      console.error("Erro ao submeter respostas:", error);
      if (error.code === 'P2002') {
        return response.status(409).json({ message: "Esta avaliação já foi finalizada." });
      }
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}
