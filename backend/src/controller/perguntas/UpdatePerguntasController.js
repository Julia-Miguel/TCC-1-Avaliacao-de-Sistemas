import { prisma } from '../../database/client.js';

export class UpdatePerguntasController {
    async handle(request, response) {
        const { id, enunciado, tipos, opcoes } = request.body;

        try {
            // Usamos uma transação para garantir que tudo aconteça ou nada aconteça
            const updatedPergunta = await prisma.$transaction(async (tx) => {
                // 1. Deletamos TODAS as opções antigas desta pergunta. É a forma mais segura de sincronizar.
                await tx.opcao.deleteMany({
                    where: { perguntaId: id },
                });

                // 2. Atualizamos a pergunta e, se for múltipla escolha, criamos as novas opções
                const perguntaAtualizada = await tx.pergunta.update({
                    where: { id: id },
                    data: {
                        enunciado,
                        tipos,
                        opcoes: tipos === 'MULTIPLA_ESCOLHA' && opcoes
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
            console.error(error);
            return response.status(400).json({ message: "Erro ao atualizar pergunta." });
        }
    }
}