import { prisma } from '../../database/client.js';

export class GetQuestionarioAvaliacoesComRespostasController {
    async handle(request, response) {
        const { questionarioId: questionarioIdParam } = request.params;
        const questionarioId = parseInt(questionarioIdParam);
        const { empresaId: adminEmpresaId } = request.user;

        if (!request.user || !adminEmpresaId) {
            return response.status(401).json({ message: "Usuário não autenticado ou ID da empresa não encontrado." });
        }

        if (isNaN(questionarioId)) {
            return response.status(400).json({ message: "ID do Questionário inválido." });
        }

        try {
            const questionario = await prisma.questionario.findFirst({
                where: {
                    id: questionarioId,
                    criador: { empresaId: parseInt(adminEmpresaId) }
                },
                select: { id: true, titulo: true, eh_satisfacao: true }
            });

            if (!questionario) {
                return response.status(404).json({ message: "Questionário não encontrado ou não pertence à sua empresa." });
            }

            const perguntasDoQuestionario = await prisma.pergunta.findMany({
                where: {
                    questionarios: {
                        some: {
                            questionarioId: questionarioId
                        }
                    }
                },
                select: {
                    id: true
                }
            });
            const idsDasPerguntas = perguntasDoQuestionario.map(p => p.id);

            if (idsDasPerguntas.length === 0) {
                return response.json({ titulo: questionario.titulo, avaliacoes: [] });
            }

            let whereClause;
            if (questionario.eh_satisfacao) {
                whereClause = {
                    criador: { empresaId: parseInt(adminEmpresaId) },
                    usuarios: {
                        some: {
                            isFinalizado: true,
                            respostas: { some: { perguntaId: { in: idsDasPerguntas } } }
                        }
                    }
                };
            } else {
                whereClause = {
                    questionarioId: questionarioId,
                    criador: { empresaId: parseInt(adminEmpresaId) }
                };
            }
            
            const avaliacoesComRespostas = await prisma.avaliacao.findMany({
                where: whereClause,
                include: {
                    // Incluímos o _count original aqui
                    _count: {
                        select: { usuarios: true }
                    },
                    criador: { select: { id: true, nome: true, email: true } },
                    usuarios: {
                        where: { isFinalizado: true },
                        orderBy: { finished_at: 'desc' },
                        include: {
                            usuario: { select: { id: true, nome: true, email: true, tipo: true } },
                            respostas: {
                                where: {
                                    perguntaId: {
                                        in: idsDasPerguntas
                                    }
                                },
                                orderBy: { perguntaId: 'asc' },
                                include: {
                                    pergunta: { include: { opcoes: { orderBy: { id: 'asc' } } } }
                                }
                            }
                        }
                    }
                },
                orderBy: { created_at: 'desc' }
            });

            const avaliacoesAjustadas = avaliacoesComRespostas.map(avaliacao => {
                const usuariosComRespostasRelevantes = avaliacao.usuarios.filter(u => u.respostas.length > 0);
                return { 
                    ...avaliacao, 
                    usuarios: usuariosComRespostasRelevantes,

                    _count: {
                        usuarios: usuariosComRespostasRelevantes.length
                    }
                };
            }).filter(avaliacao => avaliacao.usuarios.length > 0);


            const resultadoFinal = {
                titulo: questionario.titulo,
                avaliacoes: avaliacoesAjustadas
            };

            return response.json(resultadoFinal);

        } catch (error) {
            console.error("Erro ao buscar avaliações com respostas:", error);
            if (error.name === 'PrismaClientValidationError') {
                 return response.status(400).json({ message: "Erro na estrutura da consulta ao banco de dados." });
            }
            return response.status(500).json({ message: "Erro interno ao buscar dados das respostas." });
        }
    }
}