// ✅ ARQUIVO CORRIGIDO: src/controller/avaliacao/CreateAvaliacaoController.js
import { prisma } from '../../database/client.js';

export class CreateAvaliacaoController {
    async handle(request, response) {
        // ✅ CORREÇÃO: Usando 'questionarioId' (camelCase) para corresponder ao frontend
        const { semestre, questionarioId, requerLoginCliente } = request.body;

        if (!request.user || !request.user.usuarioId) {
            return response.status(401).json({ message: "Usuário não autenticado." });
        }
        const { usuarioId: criadorId } = request.user;

        if (!semestre || !questionarioId) {
            return response.status(400).json({ message: "Semestre e ID do Questionário são obrigatórios." });
        }

        try {
            // A sua lógica de verificação de permissão já está ótima aqui.
            const questionarioVinculado = await prisma.questionario.findFirst({
                where: {
                    id: parseInt(questionarioId),
                    criador: {
                        id: parseInt(criadorId)
                    }
                }
            });

            if (!questionarioVinculado) {
                return response.status(403).json({ message: "Questionário não encontrado ou não pertence à sua empresa." });
            }

            const avaliacao = await prisma.avaliacao.create({
                data: {
                    semestre,
                    requerLoginCliente: !!requerLoginCliente, // Garante que é booleano
                    questionarioId: parseInt(questionarioId),
                    criadorId: parseInt(criadorId)
                }
            });
            return response.status(201).json(avaliacao);
        } catch (error) {
            console.error("Erro ao criar avaliação:", error);
            return response.status(500).json({ error: "Erro interno ao criar avaliação." });
        }
    }
}
