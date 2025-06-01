// backend/src/controller/questionarios/CreateQuestionarioController.js
import { prisma } from '../../database/client.js';

export class CreateQuestionarioController {
    async handle(request, response) {
        // ASSUMINDO QUE O AUTH MIDDLEWARE JÁ FOI IMPLEMENTADO E POPULOU req.user
        // const { id: criadorId, empresaId } = request.user; // Descomente quando o authMiddleware estiver pronto

        // PARA TESTES SEM AUTH, você pode precisar simular ou receber o criadorId no body
        const { titulo, criadorId_para_teste } = request.body;
        const criadorId = criadorId_para_teste; // SUBSTITUA QUANDO O AUTH ESTIVER PRONTO

        if (!titulo) {
            return response.status(400).json({ message: "Título é obrigatório." });
        }
        if (!criadorId) {
            return response.status(400).json({ message: "CriadorId é obrigatório (será automático com login)." });
        }

        try {
            // Verificar se o criadorId (Usuario) realmente existe e pertence à empresa correta
            // (Essa verificação de empresa é implícita se o criadorId vem do token de um admin já validado para aquela empresa)

            const questionario = await prisma.questionario.create({
                data: {
                    titulo,
                    criadorId: Number(criadorId) // Garante que é um número
                }
            });
            return response.status(201).json(questionario);
        } catch (error) {
            console.error(error);
            // Adicionar verificação se o erro é por criadorId inválido (foreign key constraint)
            if (error.code === 'P2003' && error.meta?.field_name?.includes('criadorId')) {
                 return response.status(400).json({ message: "Usuário criador não encontrado." });
            }
            return response.status(500).json({ message: "Erro interno ao criar questionário." });
        }
    }
}