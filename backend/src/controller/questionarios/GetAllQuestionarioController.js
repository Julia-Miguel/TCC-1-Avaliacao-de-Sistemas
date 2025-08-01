import { prisma } from '../../database/client.js';

export class GetAllQuestionarioController {
    async handle(request, response) {
        // A informação do usuário (incluindo a empresa) é extraída do token
        // que foi validado pelo middleware de autenticação.
        const { empresaId } = request.user;

        // Validação para garantir que a ID da empresa está presente no token.
        if (!empresaId) {
            return response.status(401).json({ message: "ID da Empresa não pôde ser identificado no token de autenticação." });
        }

        try {
            // A consulta busca todos os questionários que pertencem à empresa do usuário logado.
            // Esta é a lógica correta para a tela de administrador.
            const questionarios = await prisma.questionario.findMany({
                // Cláusula WHERE: Filtra os questionários.
                // A busca é feita através do relacionamento: Questionario -> Criador (Usuario) -> Empresa
                where: {
                    criador: {
                        empresaId: parseInt(empresaId)
                    }
                },
                
                // Cláusula INCLUDE: Traz dados de tabelas relacionadas.
                include: {
                    criador: { 
                        select: { id: true, nome: true, email: true } 
                    },
                    perguntas: {
                        // Ordena as perguntas pela ordem definida na tabela de relacionamento.
                        orderBy: { ordem: 'asc' }, 
                        include: {
                            pergunta: {
                                include: {
                                    opcoes: {
                                        orderBy: { id: 'asc' }
                                    }
                                }
                            }
                        }
                    },
                    _count: { 
                        select: { avaliacoes: true } 
                    }
                },

                // Cláusula ORDER BY: Define a ordenação da lista de questionários.
                orderBy: [
                    // 1. Prioriza a ordem customizada pelo usuário (drag-and-drop).
                    { ordem: 'asc' },
                    // 2. Como critério de desempate, os mais recentes aparecem primeiro.
                    { created_at: 'desc' }
                ]
            });
            
            return response.status(200).json(questionarios);

        } catch (error) {
            console.error("Erro ao listar questionários:", error);
            // Retorna uma mensagem de erro mais genérica e amigável para o frontend.
            return response.status(500).json({ message: "Ocorreu um erro interno ao buscar os questionários." });
        }
    }
}