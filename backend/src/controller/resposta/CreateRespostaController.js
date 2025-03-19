import { prisma } from '../../database/client.js';

export class CreateRespostaController {
    async handle(request, response) {
        try {
            const { resposta, usuAval_id, pergunta_id } = request.body;

            if (!resposta || !usuAval_id || !pergunta_id) {
                return response.status(400).json({ error: 'Todos os campos são obrigatórios: resposta, usuAval_id e pergunta_id' });
            }

            const novaResposta = await prisma.resposta.create({
                data: {
                    resposta,
                    usuAvalId: usuAval_id,
                    perguntaId: pergunta_id
                }
            });

            return response.status(201).json(novaResposta);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Erro ao criar a resposta' });
        }
    }
}