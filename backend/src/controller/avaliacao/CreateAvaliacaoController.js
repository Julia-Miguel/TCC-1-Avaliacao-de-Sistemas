// backend/src/controller/avaliacao/CreateAvaliacaoController.js
import { prisma } from '../../database/client.js';

export class CreateAvaliacaoController {
    async handle(request, response) {
        const { semestre, questionario_id, requerLoginCliente } = request.body; // Adicionado requerLoginCliente

        if (!request.user || !request.user.usuarioId || !request.user.empresaId) {
            return response.status(401).json({ message: "Usuário não autenticado ou dados de usuário/empresa incompletos no token." });
        }
        const { usuarioId: criadorId, empresaId: adminEmpresaId } = request.user;

        if (!semestre || !questionario_id) {
            return response.status(400).json({ message: "Semestre e ID do Questionário são obrigatórios." });
        }

        const questionarioId = parseInt(questionario_id);

        try {
            // Verificar se o questionário selecionado pertence à empresa do admin
            const questionarioVinculado = await prisma.questionario.findFirst({
                where: {
                    id: questionarioId,
                    criador: {
                        empresaId: parseInt(adminEmpresaId)
                    }
                }
            });

            if (!questionarioVinculado) {
                return response.status(403).json({ message: "Questionário não encontrado ou não pertence à sua empresa." });
            }

            const avaliacao = await prisma.avaliacao.create({
                data: {
                    semestre,
                    requerLoginCliente: requerLoginCliente || false, // Valor padrão se não enviado
                    questionario: {
                        connect: { id: questionarioId }
                    },
                    criador: { // Conecta ao admin logado como criador da avaliação
                        connect: { id: parseInt(criadorId) }
                    }
                }
            });
            return response.status(201).json(avaliacao);
        } catch (error) {
            console.error("Erro ao criar avaliação:", error);
            if (error.code === 'P2003') { // Foreign key constraint failed
                 return response.status(400).json({ message: "Questionário ou Usuário criador não encontrado." });
            }
            return response.status(500).json({ error: "Erro interno ao criar avaliação." });
        }
    }
}