// ✅ CÓDIGO CORRIGIDO PARA: backend/src/controller/public/avaliacao/StartAvaliacaoController.js
import { prisma } from '../../../database/client.js';

export class StartAvaliacaoController {
    async handle(request, response) {
        // Renomeamos o parâmetro para 'token' para ficar mais claro
        const { avaliacaoId: token } = request.params;
        const { usuarioId, anonymousSessionId } = request.body;

        if (!token) {
            return response.status(400).json({ message: "Token da avaliação na URL é obrigatório." });
        }

        try {
            // ETAPA 1: BUSCAR A AVALIAÇÃO PELO TOKEN
            const avaliacao = await prisma.avaliacao.findUnique({
                where: { token: token }, // <-- MUDANÇA PRINCIPAL AQUI
                include: {
                    criador: { include: { empresa: true } },
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

            if (!avaliacao) {
                return response.status(404).json({ message: "Avaliação não encontrada." });
            }

            // A partir daqui, usamos o ID interno da avaliação, que já temos
            const avaliacaoIdInterno = avaliacao.id;

            // ETAPA 2: VERIFICAR SE JÁ RESPONDEU E CRIAR SESSÃO
            const whereClause = usuarioId
                ? { usuarioId: parseInt(usuarioId) }
                : { anonymousSessionId };

            let usuAval = await prisma.usuAval.findFirst({
                where: {
                    avaliacaoId: avaliacaoIdInterno,
                    ...whereClause
                }
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

            // ETAPA 3: MONTAR E ENVIAR A RESPOSTA PARA O FRONTEND
            const hasResponded = usuAval.isFinalizado;
            if (hasResponded) {
                return response.json({ hasResponded: true });
            }

            const responseData = {
                tituloQuestionario: avaliacao.questionario.titulo,
                nomeEmpresa: avaliacao.criador.empresa.nome,
                perguntas: (avaliacao.questionario.perguntas || [])
                    .filter(quePerg => quePerg.pergunta)
                    .map(quePerg => ({
                        id: quePerg.pergunta.id,
                        enunciado: quePerg.pergunta.enunciado,
                        obrigatoria: quePerg.pergunta.obrigatoria,
                        tipo: quePerg.pergunta.tipos,
                        opcoes: quePerg.pergunta.opcoes || [],
                    })),
                hasResponded: hasResponded,
            };

            return response.status(200).json(responseData);

        } catch (error) {
            console.error("Erro crítico ao iniciar avaliação:", error);
            return response.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}