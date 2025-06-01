import { prisma } from '../../database/client.js';

export class CreatePerguntasController {
    async handle(request, response) {
        const { enunciado, tipos, opcoes } = request.body; // 'opcoes' vem do frontend

        try {
            const pergunta = await prisma.pergunta.create({
                data: {
                    enunciado,
                    tipos,
                    // Se for múltipla escolha, cria as opções junto com a pergunta
                    opcoes: tipos === 'MULTIPLA_ESCOLHA' && opcoes
                        ? { create: opcoes.map(opt => ({ texto: opt.texto })) }
                        : undefined
                },
                include: {
                    opcoes: true 
                }
            });
            return response.json(pergunta);
        } catch (error) {
            console.error(error);
            return response.status(400).json({ message: "Erro ao criar pergunta." });
        }
    }
}