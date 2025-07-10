import { prisma } from '../../database/client.js';

export class UpdateQuestionarioController {
  async handle(request, response) {
    console.log("PAYLOAD RECEBIDO NO BACKEND:", JSON.stringify(request.body, null, 2));

    const { id: questionarioIdParam } = request.params;
    const { titulo, perguntas } = request.body;
    const questionarioId = parseInt(questionarioIdParam, 10);

    if (isNaN(questionarioId) || !titulo || !Array.isArray(perguntas)) {
      return response.status(400).json({ error: 'Dados inválidos.' });
    }

    try {
      await prisma.$transaction(async (tx) => {
        // --- 1. DELETAR PERGUNTAS REMOVIDAS ---
        const questionarioAtual = await tx.questionario.findUnique({
          where: { id: questionarioId },
          select: { perguntas: { select: { perguntaId: true } } }
        });

        if (!questionarioAtual) throw new Error('Questionário não encontrado.');
        
        const idsPerguntasAtuais = questionarioAtual.perguntas.map(qp => qp.perguntaId);
        const idsPerguntasRecebidas = perguntas.map(p => p.id).filter(id => id);
        const idsParaDeletar = idsPerguntasAtuais.filter(id => !idsPerguntasRecebidas.includes(id));

        if (idsParaDeletar.length > 0) {
          await tx.quePerg.deleteMany({ where: { perguntaId: { in: idsParaDeletar }, questionarioId: questionarioId } });
          await tx.opcao.deleteMany({ where: { perguntaId: { in: idsParaDeletar } } });
          await tx.pergunta.deleteMany({ where: { id: { in: idsParaDeletar } } });
        }

        // --- 2. ATUALIZAR O TÍTULO ---
        await tx.questionario.update({
          where: { id: questionarioId },
          data: { titulo },
        });

        // --- 3. ATUALIZAR PERGUNTAS EXISTENTES E CRIAR NOVAS ---
        for (const [index, pergunta] of perguntas.entries()) {
          const ordemAtual = index;

          if (pergunta.id) {
            await tx.pergunta.update({
              where: { id: pergunta.id },
              data: {
                enunciado: pergunta.enunciado,
                tipos: pergunta.tipos,
                obrigatoria: pergunta.obrigatoria, 
                ordem: ordemAtual,
                opcoes: {
                  deleteMany: {},
                  create: pergunta.opcoes?.map(opt => ({ texto: opt.texto })) || [],
                },
              },
            });
          } else {
            const novaPergunta = await tx.pergunta.create({
              data: {
                enunciado: pergunta.enunciado,
                tipos: pergunta.tipos,
                ordem: ordemAtual,
                obrigatoria: typeof pergunta.obrigatoria === 'boolean' ? pergunta.obrigatoria : true,
                opcoes: {
                  create: pergunta.opcoes?.map(opt => ({ texto: opt.texto })) || [],
                },
              },
            });
            await tx.quePerg.create({
                data: {
                    questionarioId: questionarioId,
                    perguntaId: novaPergunta.id,
                    ordem: ordemAtual
                }
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
            // ✅ A CORREÇÃO ESTÁ AQUI:
            // Ordenando pelo campo 'ordem' que está dentro da relação 'pergunta'
            orderBy: {
              pergunta: {
                ordem: 'asc'
              }
            }
          }
        },
      });
      
      return response.json(questionarioFinal);

    } catch (error) {
      console.error('Erro ao sincronizar questionário:', error);
      if (error.message === 'Questionário não encontrado.') {
        return response.status(404).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Erro interno ao salvar o questionário.' });
    }
  }
}