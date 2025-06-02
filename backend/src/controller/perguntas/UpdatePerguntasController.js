// backend/src/controller/perguntas/UpdatePerguntasController.js
import { prisma } from '../../database/client.js';

export class UpdatePerguntasController {
    async handle(request, response) {
        const { id: perguntaIdToUpdate, enunciado, tipos, opcoes } = request.body;
        if (!request.user || !request.user.empresaId) {
            return response.status(401).json({ error: "Usuário não autenticado ou ID da empresa não encontrado no token." });
        }
        const { empresaId: adminEmpresaId } = request.user;
        const id = parseInt(perguntaIdToUpdate);
        if (isNaN(id)) {
            return response.status(400).json({ message: "ID da pergunta inválido." });
        }
        if (!enunciado || !tipos) {
            return response.status(400).json({ message: "Enunciado e tipo são obrigatórios." });
        }
        try {
            const perguntaExistente = await prisma.pergunta.findUnique({
                where: { id: id },
                include: {
                    questionarios: {
                        include: {
                            questionario: {
                                select: {
                                    criador: {
                                        select: {
                                            empresaId: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (!perguntaExistente) {
                return response.status(404).json({ message: "Pergunta não encontrada." });
            }
            const pertenceAEmpresa = perguntaExistente.questionarios.some(
                qp => qp.questionario?.criador?.empresaId === parseInt(adminEmpresaId)
            );

            if (!pertenceAEmpresa && perguntaExistente.questionarios.length > 0) { 
                return response.status(403).json({ message: "Você não tem permissão para editar esta pergunta." });
            }
            const updatedPergunta = await prisma.$transaction(async (tx) => {
                await tx.opcao.deleteMany({
                    where: { perguntaId: id },
                });

                const perguntaAtualizada = await tx.pergunta.update({
                    where: { id: id },
                    data: {
                        enunciado,
                        tipos,
                        opcoes: tipos === 'MULTIPLA_ESCOLHA' && opcoes && opcoes.length > 0
                            ? { create: opcoes.map(opt => ({ texto: opt.texto })) }
                            : undefined
                    },
                    include: {
                        opcoes: true 
                    }
                });
                return perguntaAtualizada;
            });

            return response.json(updatedPergunta);
        } catch (error) {
            console.error("Erro ao atualizar pergunta:", error);
            if (error.code === 'P2025') { // Prisma error for record not found during update
                return response.status(404).json({ message: "Pergunta não encontrada para atualização." });
            }
            return response.status(500).json({ message: "Erro ao atualizar pergunta: " + error.message });
        }
    }
}