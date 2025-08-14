// backend/src/controller/questionarios/UpdateQuestionarioController.js

import { prisma } from '../../database/client.js';

export class UpdateQuestionarioController {
  async handle(request, response) {
    const { id: questionarioIdParam } = request.params;
    const { titulo, perguntas: perguntasPayload } = request.body;
    const { empresaId } = request.user;
    const questionarioId = parseInt(questionarioIdParam);

    if (isNaN(questionarioId)) {
      return response.status(400).json({ message: "ID do questionário inválido." });
    }
    if (!empresaId) {
        return response.status(401).json({ message: "ID da empresa não encontrado no token." });
    }

    try {
        // Helper functions to reduce complexity
        async function deleteOrphanPerguntas(tx, quePergsToDelete) {
            for (const qpToDelete of quePergsToDelete) {
                await tx.quePerg.delete({ where: { id: qpToDelete.id } });
                const otherAssociations = await tx.quePerg.count({
                    where: { perguntaId: qpToDelete.perguntaId }
                });
                if (otherAssociations === 0) {
                    await tx.opcao.deleteMany({ where: { perguntaId: qpToDelete.perguntaId } });
                    await tx.pergunta.delete({ where: { id: qpToDelete.perguntaId } });
                }
            }
        }

        async function updateExistingPergunta(tx, pData, existingPergunta, index, questionarioId) {
            await tx.pergunta.update({
                where: { id: pData.id },
                data: {
                    enunciado: pData.enunciado,
                    tipos: pData.tipos,
                    obrigatoria: pData.obrigatoria,
                    ordem: index,
                }
            });

            if (pData.tipos === 'MULTIPLA_ESCOLHA') {
                await tx.opcao.deleteMany({ where: { perguntaId: pData.id } });
                if (pData.opcoes && pData.opcoes.length > 0) {
                    await tx.opcao.createMany({
                        data: pData.opcoes.map(opt => ({
                            texto: opt.texto,
                            perguntaId: pData.id
                        }))
                    });
                }
            } else if (existingPergunta.tipos === 'MULTIPLA_ESCOLHA' && pData.tipos === 'TEXTO') {
                await tx.opcao.deleteMany({ where: { perguntaId: pData.id } });
            }

            await tx.quePerg.updateMany({
                where: { questionarioId: questionarioId, perguntaId: pData.id },
                data: { ordem: index }
            });
        }

        async function createNewPerguntaAndAssociation(tx, pData, index, questionarioId) {
            const novaPergunta = await tx.pergunta.create({
                data: {
                    enunciado: pData.enunciado,
                    tipos: pData.tipos,
                    obrigatoria: pData.obrigatoria,
                    ordem: index,
                    opcoes: pData.tipos === 'MULTIPLA_ESCOLHA' && pData.opcoes && pData.opcoes.length > 0
                        ? { create: pData.opcoes.map(opt => ({ texto: opt.texto })) }
                        : undefined,
                }
            });

            await tx.quePerg.create({
                data: {
                    questionarioId: questionarioId,
                    perguntaId: novaPergunta.id,
                    ordem: index,
                }
            });
        }

        async function processPerguntasPayload(tx, perguntasPayload, existingQuePergs, questionarioId) {
            // Deletar associações QuePerg e perguntas órfãs removidas do frontend
            const quePergsToDelete = existingQuePergs.filter(existingQp => {
                return !perguntasPayload.some(p => p.id === existingQp.perguntaId);
            });
            await deleteOrphanPerguntas(tx, quePergsToDelete);

            // Processar perguntas do payload: criar novas, atualizar existentes
            for (const [index, pData] of perguntasPayload.entries()) {
                if (pData.id) {
                    const existingPergunta = existingQuePergs.find(qp => qp.perguntaId === pData.id)?.pergunta;
                    if (!existingPergunta) {
                        console.warn(`Pergunta ID ${pData.id} no payload não encontrada no questionário existente.`);
                        continue;
                    }
                    await updateExistingPergunta(tx, pData, existingPergunta, index, questionarioId);
                } else {
                    await createNewPerguntaAndAssociation(tx, pData, index, questionarioId);
                }
            }
        }

        const result = await prisma.$transaction(async (tx) => {
            const questionario = await tx.questionario.findFirst({
                where: {
                    id: questionarioId,
                    criador: { empresaId: parseInt(empresaId) }
                },
                include: {
                    perguntas: {
                        include: {
                            pergunta: {
                                include: {
                                    opcoes: true
                                }
                            }
                        }
                    }
                }
            });

            if (!questionario) {
                throw new Error("Questionário não encontrado ou não pertence à sua empresa.");
            }

            await tx.questionario.update({
                where: { id: questionarioId },
                data: { titulo: titulo || questionario.titulo }
            });

            const existingQuePergs = questionario.perguntas;

            if (perguntasPayload !== undefined) {
                await processPerguntasPayload(tx, perguntasPayload, existingQuePergs, questionarioId);
            }

            const updatedQuestionario = await tx.questionario.findUnique({
                where: { id: questionarioId },
                include: {
                    perguntas: {
                        orderBy: { ordem: 'asc' },
                        include: {
                            pergunta: {
                                include: {
                                    opcoes: true
                                }
                            }
                        }
                    }
                }
            });

            return updatedQuestionario;
        });

        // Retorna a resposta de sucesso com os dados atualizados
        return response.json(result);

    } catch (error) {
      console.error("[UpdateQuestionarioController] Erro ao salvar questionário e perguntas:", error);
      if (error.message.includes("Questionário não encontrado")) {
        return response.status(404).json({ message: error.message });
      }
      return response.status(500).json({ message: "Erro interno ao salvar questionário.", error: error.message });
    }
  }
}