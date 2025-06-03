// backend/src/controller/respostas/SubmitRespostasController.js
import { prisma } from '../../database/client.js';

export class SubmitRespostasController {
  async handle(request, response) {
    const { avaliacaoId: avaliacaoIdParam } = request.params;
    const { respostas, usuarioId, anonymousSessionId } = request.body;
    // 'respostas' deve ser um array de objetos: [{ perguntaId: number, respostaTexto: string }]

    const avaliacaoId = parseInt(avaliacaoIdParam);

    // --- Validações Iniciais ---
    if (isNaN(avaliacaoId)) {
      return response.status(400).json({ message: "ID da Avaliação inválido." });
    }
    if (!Array.isArray(respostas) || respostas.length === 0) {
      return response.status(400).json({ message: "Nenhuma resposta fornecida." });
    }
    if (!usuarioId && !anonymousSessionId) {
      return response.status(400).json({ message: "Identificação do respondente (usuário ou sessão anônima) é obrigatória." });
    }
    if (usuarioId && anonymousSessionId) {
        return response.status(400).json({ message: "Forneça apenas usuarioId OU anonymousSessionId, não ambos."});
    }

    try {
      // 1. Buscar a Avaliação e verificar se ela existe e a política de login
      const avaliacao = await prisma.avaliacao.findUnique({
        where: { id: avaliacaoId },
      });

      if (!avaliacao) {
        return response.status(404).json({ message: "Avaliação não encontrada." });
      }

      if (avaliacao.requerLoginCliente && !usuarioId) {
        return response.status(403).json({ message: "Esta avaliação requer login para responder." });
      }

      // --- Gerenciamento do UsuAval (quem está respondendo) ---
      let usuAvalRecord;

      if (usuarioId) { // Cliente Logado
        const userIdInt = parseInt(usuarioId);
        // Verificar se este usuário já finalizou esta avaliação
        const existingUsuAval = await prisma.usuAval.findFirst({
          where: {
            avaliacaoId: avaliacaoId,
            usuarioId: userIdInt,
          }
        });

        if (existingUsuAval && existingUsuAval.isFinalizado) {
          return response.status(409).json({ message: "Você já finalizou esta avaliação." });
        }

        if (existingUsuAval) {
          usuAvalRecord = await prisma.usuAval.update({
            where: { id: existingUsuAval.id },
            data: { status: 'CONCLUIDO', isFinalizado: true } // Atualiza se já existia e não estava finalizado
          });
        } else {
          usuAvalRecord = await prisma.usuAval.create({
            data: {
              avaliacaoId: avaliacaoId,
              usuarioId: userIdInt,
              status: 'CONCLUIDO',
              isFinalizado: true,
            },
          });
        }
      } else if (anonymousSessionId) { // Cliente Anônimo
         const existingUsuAval = await prisma.usuAval.findFirst({
          where: {
            avaliacaoId: avaliacaoId,
            anonymousSessionId: anonymousSessionId,
          }
        });
        
        if (existingUsuAval && existingUsuAval.isFinalizado) {
          return response.status(409).json({ message: "Esta avaliação já foi respondida por esta sessão anônima." });
        }

        if (existingUsuAval) {
            usuAvalRecord = await prisma.usuAval.update({
                where: { id: existingUsuAval.id },
                data: { status: 'CONCLUIDO', isFinalizado: true }
            });
        } else {
            usuAvalRecord = await prisma.usuAval.create({
                data: {
                  avaliacaoId: avaliacaoId,
                  anonymousSessionId: anonymousSessionId,
                  status: 'CONCLUIDO',
                  isFinalizado: true,
                },
            });
        }
      } else {
        // Fallback, mas a validação inicial já deve pegar isso.
        return response.status(400).json({ message: "Identificação do respondente inválida." });
      }

      // --- Salvar as Respostas ---
      // Prepara os dados para createMany
      const respostasParaSalvar = respostas.map(r => {
        if (!r.perguntaId || typeof r.respostaTexto !== 'string') {
            throw new Error("Formato de resposta inválido. Cada resposta deve ter perguntaId e respostaTexto.");
        }
        return {
            usuAvalId: usuAvalRecord.id,
            perguntaId: parseInt(r.perguntaId),
            resposta: r.respostaTexto,
        };
      });
      
      // Deleta respostas antigas para este UsuAval (caso seja uma nova tentativa de submissão não finalizada antes)
      // e depois cria as novas. Isso garante que apenas o último conjunto de respostas seja salvo.
      await prisma.$transaction(async (tx) => {
        await tx.resposta.deleteMany({
            where: { usuAvalId: usuAvalRecord.id }
        });
        await tx.resposta.createMany({
            data: respostasParaSalvar,
        });
      });
      
      return response.status(201).json({ message: "Respostas submetidas com sucesso!" });

    } catch (error) {
      console.error("Erro ao submeter respostas:", error);
      if (error.message.includes("Formato de resposta inválido")) {
          return response.status(400).json({ message: error.message });
      }
      // Adicionar tratamento para P2003 (foreign key constraint) se perguntaId for inválido, etc.
      if (error.code === 'P2003') {
        return response.status(400).json({ message: "Erro de referência: uma das perguntas ou o usuário/avaliação não existe." });
      }
      return response.status(500).json({ message: "Erro interno ao salvar respostas." });
    }
  }
}