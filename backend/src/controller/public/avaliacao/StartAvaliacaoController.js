import { prisma } from '../../../database/client.js';

export class StartAvaliacaoController {
    async handle(request, response) {
        const { avaliacaoId: token } = request.params;
        const { usuarioId, anonymousSessionId } = request.body;

        if (!token) {
            return response.status(400).json({ message: "Token da avaliação na URL é obrigatório." });
        }

        try {
            // ETAPA 1: BUSCAR A AVALIAÇÃO PRINCIPAL E A EMPRESA ASSOCIADA
            const avaliacaoPrincipal = await prisma.avaliacao.findUnique({
                where: { token: token },
                include: {
                    criador: { 
                        select: { 
                            empresaId: true, // Pega o ID da empresa para o filtro de segurança
                            empresa: { select: { nome: true } }
                        } 
                    },
                    questionario: {
                        include: {
                            perguntas: {
                                orderBy: { ordem: 'asc' },
                                include: {
                                    pergunta: { include: { opcoes: true } },
                                },
                            },
                        },
                    },
                },
            });

            if (!avaliacaoPrincipal) {
                return response.status(404).json({ message: "Avaliação não encontrada." });
            }

            // Pega o ID da empresa da avaliação principal
            const empresaIdDaAvaliacao = avaliacaoPrincipal.criador.empresaId;
            if (!empresaIdDaAvaliacao) {
                return response.status(500).json({ message: "Não foi possível identificar a empresa desta avaliação." });
            }

            // ETAPA 2: VERIFICAR SE JÁ RESPONDEU E CRIAR SESSÃO (lógica existente)
            const avaliacaoIdInterno = avaliacaoPrincipal.id;
            const whereClause = usuarioId ? { usuarioId: parseInt(usuarioId) } : { anonymousSessionId };
            let usuAval = await prisma.usuAval.findFirst({
                where: { avaliacaoId: avaliacaoIdInterno, ...whereClause }
            });
            if (!usuAval) {
                usuAval = await prisma.usuAval.create({
                    data: {
                        avaliacao: { connect: { id: avaliacaoIdInterno } },
                        status: 'INICIADO',
                        isFinalizado: false,
                        started_at: new Date(),
                        ...(usuarioId ? { usuario: { connect: { id: parseInt(usuarioId) } } } : { anonymousSessionId })
                    }
                });
            }

            if (usuAval.isFinalizado) {
                return response.json({ hasResponded: true });
            }

            // Mapeia as perguntas principais
            let perguntasFinais = (avaliacaoPrincipal.questionario.perguntas || [])
                .filter(quePerg => quePerg.pergunta)
                .map(quePerg => ({
                    id: quePerg.pergunta.id,
                    enunciado: quePerg.pergunta.enunciado,
                    obrigatoria: quePerg.pergunta.obrigatoria,
                    tipo: quePerg.pergunta.tipos,
                    opcoes: quePerg.pergunta.opcoes || [],
                    isSatisfactionQuestion: false,
                }));

            // ✅ ETAPA 3 (CORRIGIDA): BUSCAR O QUESTIONÁRIO DE SATISFAÇÃO DA EMPRESA CORRETA
            const questionarioSatisfacao = await prisma.questionario.findFirst({
                where: {
                    eh_satisfacao: true,
                    ativo: true,
                    // Filtro de segurança: garante que o questionário de satisfação
                    // pertence à mesma empresa da avaliação principal.
                    criador: {
                        empresaId: empresaIdDaAvaliacao
                    }
                },
                include: {
                    perguntas: {
                        orderBy: { ordem: 'asc' },
                        include: {
                            pergunta: { include: { opcoes: true } },
                        },
                    },
                },
            });
            
            // Se encontrou, anexa as perguntas dele
            if (questionarioSatisfacao) {
                const perguntasDeSatisfacao = (questionarioSatisfacao.perguntas || [])
                    .filter(quePerg => quePerg.pergunta)
                    .map(quePerg => ({
                        id: quePerg.pergunta.id,
                        enunciado: quePerg.pergunta.enunciado,
                        obrigatoria: false,
                        tipo: quePerg.pergunta.tipos,
                        opcoes: quePerg.pergunta.opcoes || [],
                        isSatisfactionQuestion: true,
                    }));
                
                if (perguntasDeSatisfacao.length > 0 && perguntasFinais.length > 0) {
                    perguntasFinais.push({
                        id: -1,
                        tipo: 'SEPARADOR',
                        enunciado: 'Avaliação do Usuário',
                        obrigatoria: false,
                        opcoes: [],
                        isSatisfactionQuestion: true,
                    });
                }

                perguntasFinais.push(...perguntasDeSatisfacao);
            }

            // ETAPA FINAL: MONTAR E ENVIAR A RESPOSTA PARA O FRONTEND
            const responseData = {
                tituloQuestionario: avaliacaoPrincipal.questionario.titulo,
                nomeEmpresa: avaliacaoPrincipal.criador.empresa.nome,
                perguntas: perguntasFinais,
                hasResponded: usuAval.isFinalizado,
            };

            return response.status(200).json(responseData);

        } catch (error) {
            console.error("Erro crítico ao iniciar avaliação:", error);
            return response.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}
