// backend/src/controller/questionarios/UpdateQuestionarioController.js

import { prisma } from '../../database/client.js';

export class UpdateQuestionarioController {
  async handle(request, response) {
    const { id: questionarioIdParam } = request.params;
    const { titulo, perguntas: perguntasPayload } = request.body; // <-- AGORA PEGAMOS 'perguntas'
    const { empresaId } = request.user; // ID da empresa do admin logado
    const questionarioId = parseInt(questionarioIdParam);

    if (isNaN(questionarioId)) {
      return response.status(400).json({ message: "ID do questionário inválido." });
    }
    if (!empresaId) {
        return response.status(401).json({ message: "ID da empresa não encontrado no token." });
    }

    try {
        // Inicia uma transação para garantir que todas as operações sejam atômicas
        // Se algo falhar, tudo é revertido.
        const result = await prisma.$transaction(async (tx) => {
            // 1. Verificar e atualizar o questionário principal
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

            // Atualiza o título do questionário
            await tx.questionario.update({
                where: { id: questionarioId },
                data: { titulo }
            });

            const existingQuePergs = questionario.perguntas;
            const existingPerguntaIds = existingQuePergs.map(qp => qp.perguntaId);
            const payloadPerguntaIds = perguntasPayload.map(p => p.id).filter(Boolean); // IDs das perguntas existentes no payload

            // 2. Deletar associações QuePerg e perguntas órfãs removidas do frontend
            const quePergsToDelete = existingQuePergs.filter(existingQp => {
                // Se a pergunta existente não está mais no payload ou não tem ID, consideramos para exclusão
                return !perguntasPayload.some(p => p.id === existingQp.perguntaId);
            });

            for (const qpToDelete of quePergsToDelete) {
                // Deleta a associação QuePerg
                await tx.quePerg.delete({ where: { id: qpToDelete.id } });
                
                // Verifica se a pergunta (que estava associada) é órfã agora (não associada a nenhum outro questionário)
                const otherAssociations = await tx.quePerg.count({
                    where: { perguntaId: qpToDelete.perguntaId }
                });

                if (otherAssociations === 0) {
                    // Se a pergunta não tem mais associações, deleta a pergunta e suas opções
                    await tx.opcao.deleteMany({ where: { perguntaId: qpToDelete.perguntaId } });
                    await tx.pergunta.delete({ where: { id: qpToDelete.perguntaId } });
                }
            }


            // 3. Processar perguntas do payload: criar novas, atualizar existentes
            for (const [index, pData] of perguntasPayload.entries()) {
                if (pData.id) { // É uma pergunta existente
                    const existingPergunta = existingQuePergs.find(qp => qp.perguntaId === pData.id)?.pergunta;

                    if (!existingPergunta) {
                        // Isso não deveria acontecer se o frontend está correto e o banco consistente
                        console.warn(`Pergunta ID ${pData.id} no payload não encontrada no questionário existente.`);
                        continue; 
                    }

                    // Atualiza a pergunta
                    await tx.pergunta.update({
                        where: { id: pData.id },
                        data: {
                            enunciado: pData.enunciado,
                            tipos: pData.tipos,
                            obrigatoria: pData.obrigatoria,
                            ordem: index, // Atualiza a ordem da pergunta
                        }
                    });

                    // Gerencia opções (apenas para múltipla escolha)
                    if (pData.tipos === 'MULTIPLA_ESCOLHA') {
                        // Deleta todas as opções antigas e recria
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
                        // Se mudou de MULTIPLA_ESCOLHA para TEXTO, deleta as opções antigas
                        await tx.opcao.deleteMany({ where: { perguntaId: pData.id } });
                    }

                    // Atualiza a ordem da associação QuePerg existente
                    await tx.quePerg.updateMany({
                        where: { questionarioId: questionarioId, perguntaId: pData.id },
                        data: { ordem: index }
                    });

                } else { // É uma nova pergunta (não tem ID)
                    const novaPergunta = await tx.pergunta.create({
                        data: {
                            enunciado: pData.enunciado,
                            tipos: pData.tipos,
                            obrigatoria: pData.obrigatoria,
                            ordem: index, // Define a ordem da nova pergunta
                            opcoes: pData.tipos === 'MULTIPLA_ESCOLHA' && pData.opcoes && pData.opcoes.length > 0
                                ? { create: pData.opcoes.map(opt => ({ texto: opt.texto })) }
                                : undefined,
                        }
                    });

                    // Cria a associação QuePerg para a nova pergunta
                    await tx.quePerg.create({
                        data: {
                            questionarioId: questionarioId,
                            perguntaId: novaPergunta.id,
                            ordem: index, // Define a ordem na associação também
                        }
                    });
                }
            }

            // Retorna o questionário atualizado com suas perguntas (opcional, para feedback no frontend)
            const updatedQuestionario = await tx.questionario.findUnique({
                where: { id: questionarioId },
                include: {
                    perguntas: {
                        orderBy: { ordem: 'asc' }, // Garante que as perguntas sejam retornadas na nova ordem
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