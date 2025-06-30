// backend/src/controller/questionarios/UpdateQuestionarioController.js

import { prisma } from '../../database/client.js';

export class UpdateQuestionarioController {
  async handle(request, response) {
    const { id: questionarioIdParam } = request.params;
    const { titulo, perguntas } = request.body;
    const questionarioId = parseInt(questionarioIdParam);

    // ... (as validações iniciais continuam as mesmas)
    if (isNaN(questionarioId) || !titulo || !Array.isArray(perguntas) || !request.user) {
        return response.status(400).json({ error: 'Dados inválidos ou usuário não autenticado.' });
    }

    try {
      await prisma.$transaction(async (tx) => {
        // --- 1. DELETAR PERGUNTAS REMOVIDAS ---
        const questionarioAtual = await tx.questionario.findUnique({
          where: { id: questionarioId },
          select: { perguntas: { select: { perguntaId: true } } }
        });

        if (!questionarioAtual) {
          // Lança um erro para que a transação inteira seja revertida
          throw new Error('Questionário não encontrado.'); 
        }

        const idsPerguntasAtuais = questionarioAtual.perguntas.map(qp => qp.perguntaId);
        const idsPerguntasRecebidas = perguntas.map(p => p.id).filter(id => id);
        const idsParaDeletar = idsPerguntasAtuais.filter(id => !idsPerguntasRecebidas.includes(id));

        if (idsParaDeletar.length > 0) {
          await tx.quePerg.deleteMany({ where: { perguntaId: { in: idsParaDeletar } } });
          await tx.opcao.deleteMany({ where: { perguntaId: { in: idsParaDeletar } } });
          await tx.pergunta.deleteMany({ where: { id: { in: idsParaDeletar } } });
        }

        // --- 2. ATUALIZAR O TÍTULO ---
        await tx.questionario.update({
          where: { id: questionarioId },
          data: { titulo },
        });

        // --- 3. ATUALIZAR PERGUNTAS EXISTENTES E CRIAR NOVAS ---
        for (const pergunta of perguntas) {
          if (pergunta.id) {
            // LÓGICA DE ATUALIZAÇÃO para uma pergunta que JÁ EXISTE
            await tx.pergunta.update({
              where: { id: pergunta.id },
              data: {
                enunciado: pergunta.enunciado,
                tipos: pergunta.tipos,
                ordem: pergunta.ordem,
                opcoes: {
                  // AQUI SIM, deleteMany é válido para limpar as opções antigas
                  deleteMany: {}, 
                  create: pergunta.opcoes?.map(opt => ({ texto: opt.texto })) || [],
                },
              },
            });
          } else {
            // LÓGICA DE CRIAÇÃO para uma pergunta NOVA
            await tx.pergunta.create({
              data: {
                enunciado: pergunta.enunciado,
                tipos: pergunta.tipos,
                ordem: pergunta.ordem,
                opcoes: {
                  // AQUI NÃO PODE TER deleteMany, apenas o create
                  create: pergunta.opcoes?.map(opt => ({ texto: opt.texto })) || [],
                },
                // Cria o "link" com o questionário na tabela QuePerg
                questionarios: {
                  create: [{ questionarioId: questionarioId }],
                },
              },
            });
          }
        }
      });

      // --- 4. BUSCAR E RETORNAR O RESULTADO FINAL ---
      const questionarioFinal = await prisma.questionario.findUnique({
        where: { id: questionarioId },
        include: { 
            perguntas: {
                include: {
                    pergunta: {
                        include: { opcoes: true }
                    }
                },
                orderBy: {
                    pergunta: { ordem: 'asc' }
                }
            }
         },
      });

      return response.json(questionarioFinal);

    } catch (error) {
      console.error('Erro ao sincronizar questionário:', error);
      // Verifica se o erro foi o que nós lançamos (Questionário não encontrado)
      if (error.message === 'Questionário não encontrado.') {
        return response.status(404).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno ao salvar o questionário.' });
    }
  }
}