import { prisma } from '../../database/client.js';

// Função auxiliar para validar as perguntas obrigatórias
async function validateRequiredQuestions(avaliacaoId, respostas) {
  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id: avaliacaoId },
    include: {
      questionario: {
        include: {
          perguntas: {
            where: {
              pergunta: {
                obrigatoria: true, // Busca apenas as perguntas marcadas como obrigatórias
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

  // Itera SOMENTE sobre as perguntas que o Prisma retornou (as obrigatórias)
  for (const quePerg of avaliacao.questionario.perguntas) {
    const perguntaObrigatoria = quePerg.pergunta;
    const respostaEnviada = respostas.find(r => r.perguntaId === perguntaObrigatoria.id);

    // Verifica se a resposta não foi enviada ou está vazia
    if (!respostaEnviada || !respostaEnviada.respostaTexto || respostaEnviada.respostaTexto.trim() === '') {
      return {
        error: true,
        status: 400,
        message: `A pergunta "${perguntaObrigatoria.enunciado}" é obrigatória.`,
      };
    }
  }

  // Se passou por todas, está tudo certo
  return { error: false };
}


export class SubmitRespostasController {
  async handle(request, response) {
    const { avaliacaoId: avaliacaoIdParam } = request.params;
    const { respostas, usuarioId, anonymousSessionId } = request.body;
    const avaliacaoId = parseInt(avaliacaoIdParam, 10);

    // 1. Validação inicial dos dados recebidos
    if (isNaN(avaliacaoId) || !Array.isArray(respostas) || (!usuarioId && !anonymousSessionId)) {
        return response.status(400).json({ message: "Dados de entrada inválidos. Verifique os parâmetros enviados." });
    }

    try {
      // 2. Validação das perguntas obrigatórias
      const validationResult = await validateRequiredQuestions(avaliacaoId, respostas);
      if (validationResult.error) {
        return response.status(validationResult.status).json({ message: validationResult.message });
      }

      // 3. Cria ou atualiza o registro de quem respondeu (UsuAval)
      let usuAvalRecord;
      if (usuarioId) {
        // Lógica para usuário logado (se aplicável)
        usuAvalRecord = await prisma.usuAval.upsert({
            where: { avaliacaoId_usuarioId: { avaliacaoId, usuarioId } },
            update: { status: 'CONCLUIDO', isFinalizado: true },
            create: { avaliacaoId, usuarioId, status: 'CONCLUIDO', isFinalizado: true }
        });
      } else {
        // Lógica para usuário anônimo
         usuAvalRecord = await prisma.usuAval.upsert({
            where: { avaliacaoId_anonymousSessionId: { avaliacaoId, anonymousSessionId } },
            update: { status: 'CONCLUIDO', isFinalizado: true },
            create: { avaliacaoId, anonymousSessionId, status: 'CONCLUIDO', isFinalizado: true }
        });
      }

      // 4. Deleta respostas antigas para garantir que não haja duplicatas
      await prisma.resposta.deleteMany({
        where: { usuAvalId: usuAvalRecord.id }
      });

      // 5. Salva as novas respostas
      const respostasParaSalvar = respostas
        .filter(r => r.respostaTexto && r.respostaTexto.trim() !== '') // Salva apenas respostas que não estão vazias
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
      // Tratamento de erro para respostas já finalizadas
      if (error.code === 'P2002') { // Código de erro do Prisma para Unique constraint failed
        return response.status(409).json({ message: "Esta avaliação já foi finalizada." });
      }
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}
