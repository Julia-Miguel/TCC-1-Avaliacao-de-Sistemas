// backend/src/controller/questionarios/DeleteQuestionarioController.js
import { prisma } from '../../database/client.js';

export class DeleteQuestionarioController {
  async handle(request, response) {
    const { id: questionarioIdFromBody } = request.body; 

    // Dados do usuário vêm do authMiddleware
    if (!request.user || !request.user.empresaId || !request.user.usuarioId) {
        console.log('[DeleteQuestionario] Falha: Usuário não autenticado ou dados incompletos no token.', request.user);
        return response.status(401).json({ error: "Usuário não autenticado ou dados de usuário/empresa incompletos no token." });
    }
    const { empresaId: adminEmpresaId, usuarioId: adminUserId } = request.user;
    
    const questionarioId = parseInt(questionarioIdFromBody);

    console.log(`[DeleteQuestionario] Tentando deletar questionário ID: ${questionarioId}`);
    console.log(`[DeleteQuestionario] Admin User ID: ${adminUserId}, Admin Empresa ID: ${adminEmpresaId}`);

    if (isNaN(questionarioId)) {
      console.log('[DeleteQuestionario] Falha: ID do questionário inválido.');
      return response.status(400).json({ error: "ID do questionário é obrigatório e deve ser um número." });
    }

    try {
      // 1. Verifica se o questionário existe E pertence à empresa do admin logado
      const questionarioExistente = await prisma.questionario.findFirst({
        where: {
          id: questionarioId,
          criador: {
            empresaId: parseInt(adminEmpresaId)
            // Se quiser que apenas o CRIADOR ORIGINAL possa deletar, adicione:
            // id: parseInt(adminUserId) 
          }
        }
      });

      console.log('[DeleteQuestionario] Questionário encontrado para deletar:', questionarioExistente);

      if (!questionarioExistente) {
        console.log('[DeleteQuestionario] Falha: Questionário não encontrado ou sem permissão.');
        return response.status(404).json({ error: "Questionário não encontrado, não pertence à sua empresa ou você não tem permissão para deletá-lo." });
      }

      // 2. Deletar o questionário e suas dependências em uma transação
      // A ordem importa para evitar erros de constraint de chave estrangeira
      await prisma.$transaction(async (tx) => {
        console.log(`[DeleteQuestionario] Iniciando transação para deletar questionário ID: ${questionarioId}`);
        
        // a. Deletar Respostas associadas (via UsuAval -> Avaliacao -> Questionario)
        //    Isso pode ser complexo. Se `onDelete: Cascade` estiver bem configurado no schema,
        //    deletar UsuAval ou Avaliacao pode cuidar disso.
        //    Por ora, vamos focar nas dependências diretas e assumir que o schema cuida do resto em cascata.
        //    Ou que não há respostas ainda.

        // b. Deletar associações UsuAval ligadas às Avaliações deste Questionário
        const avaliacoesDoQuestionario = await tx.avaliacao.findMany({
            where: { questionarioId: questionarioId },
            select: { id: true }
        });
        const avaliacaoIds = avaliacoesDoQuestionario.map(a => a.id);

        if (avaliacaoIds.length > 0) {
            await tx.usuAval.deleteMany({
                where: { avaliacaoId: { in: avaliacaoIds } }
            });
            console.log(`[DeleteQuestionario] Deletados UsuAval para avaliações IDs: ${avaliacaoIds.join(', ')}`);
        }
        
        // c. Deletar Avaliacoes deste Questionário
        await tx.avaliacao.deleteMany({
          where: { questionarioId: questionarioId }
        });
        console.log(`[DeleteQuestionario] Deletadas Avaliações para questionário ID: ${questionarioId}`);

        // d. Deletar associações QuePerg
        await tx.quePerg.deleteMany({
          where: { questionarioId: questionarioId }
        });
        console.log(`[DeleteQuestionario] Deletadas QuePerg para questionário ID: ${questionarioId}`);
        
        // e. Finalmente, deletar o Questionário
        await tx.questionario.delete({
          where: { id: questionarioId },
        });
        console.log(`[DeleteQuestionario] Questionário ID: ${questionarioId} deletado com sucesso.`);
      });

      return response.json({ message: "Questionário e todas as suas associações foram deletados com sucesso." });

    } catch (error) {
      console.error("[DeleteQuestionario] Erro ao deletar questionário:", error);
      if (error.code === 'P2025') { // Erro do Prisma para "Record to delete does not exist."
          return response.status(404).json({ message: "Erro: Questionário não encontrado durante a operação de deleção (P2025)." });
      }
      // Erro P2003 é foreign key constraint violation, mas a transação deve minimizar isso.
      if (error.code === 'P2003') {
        return response.status(409).json({ message: "Conflito: Não é possível deletar. Questionário possui dados relacionados que não puderam ser removidos automaticamente.", details: error.meta?.field_name });
      }
      return response.status(500).json({ error: "Erro interno do servidor ao deletar questionário: " + error.message });
    }
  }
}