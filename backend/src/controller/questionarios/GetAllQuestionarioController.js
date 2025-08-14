import { prisma } from '../../database/client.js';

export class GetAllQuestionarioController {
    async handle(request, response) {
        const { empresaId } = request.user;

        if (!empresaId) {
            return response.status(401).json({ message: "ID da Empresa não pôde ser identificado no token de autenticação." });
        }

        try {
            const questionarios = await prisma.questionario.findMany({
                where: {
                    criador: {
                        empresaId: parseInt(empresaId)
                    }
                },
                include: {
                    criador: { 
                        select: { id: true, nome: true, email: true } 
                    },
                    perguntas: {
                        orderBy: { ordem: 'asc' },
                        take: 3, // 🔹 limita para exibir apenas as 3 primeiras perguntas
                        select: {
                            pergunta: {
                                select: {
                                    id: true,
                                    enunciado: true,
                                    // 🔹 Se não precisa das opções na listagem, remova este bloco
                                    opcoes: {
                                        orderBy: { id: 'asc' },
                                        select: { id: true, texto: true }
                                    }
                                }
                            }
                        }
                    },
                    _count: { 
                        select: { avaliacoes: true } 
                    }
                },
                orderBy: [
                    { ordem: 'asc' },
                    { created_at: 'desc' }
                ]
            });

            return response.status(200).json(questionarios);

        } catch (error) {
            console.error("Erro ao listar questionários:", error);
            return response.status(500).json({ message: "Ocorreu um erro interno ao buscar os questionários." });
        }
    }
}
