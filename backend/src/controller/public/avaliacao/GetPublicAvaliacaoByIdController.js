// backend/src/controller/public/avaliacao/GetPublicAvaliacaoByIdController.js

import { prisma } from '../../../database/client.js';

export class GetPublicAvaliacaoByIdController {
  async handle(request, response) {
    const { id: avaliacaoIdParam } = request.params;
    const avaliacaoId = parseInt(avaliacaoIdParam);

    if (isNaN(avaliacaoId)) {
      return response.status(400).json({ message: "ID da Avaliação inválido." });
    }

    try {
      const avaliacao = await prisma.avaliacao.findUnique({
        where: {
          id: avaliacaoId,
        },
        include: {
          questionario: {
            include: {
              criador: {
                select: {
                  empresa: {
                    select: {
                      nome: true
                    }
                  }
                }
              },
              perguntas: {
                orderBy: {
                  id: 'asc'
                },
                include: {
                  pergunta: {
                    include: {
                      opcoes: {
                        orderBy: {
                          id: 'asc'
                        }
                      }
                    }
                  }
                }
              }
            }
          },

        }
      });

      if (!avaliacao) {
        return response.status(404).json({ message: "Avaliação não encontrada." });
      }
      const dadosParaResponder = {
        avaliacaoId: avaliacao.id,
        semestreAvaliacao: avaliacao.semestre,
        requerLoginCliente: avaliacao.requerLoginCliente,
        nomeEmpresa: avaliacao.questionario?.criador?.empresa?.nome || "Empresa Desconhecida",
        tituloQuestionario: avaliacao.questionario?.titulo || "Questionário Sem Título",
        perguntas: avaliacao.questionario?.perguntas.map(qp => ({
          id: qp.pergunta.id,
          enunciado: qp.pergunta.enunciado,
          tipos: qp.pergunta.tipos,
          opcoes: qp.pergunta.opcoes.map(opt => ({ id: opt.id, texto: opt.texto }))
        })) || []
      };

      return response.json(dadosParaResponder);

    } catch (error) {
      console.error("Erro ao buscar avaliação pública:", error);
      return response.status(500).json({ message: "Erro interno ao buscar dados da avaliação." });
    }
  }
}