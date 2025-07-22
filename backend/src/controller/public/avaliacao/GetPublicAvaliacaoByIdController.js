import { prisma } from '../../../database/client.js';

export class GetPublicAvaliacaoByIdController {
  async handle(request, response) {
    const { id } = request.params;
    const avaliacaoId = parseInt(id, 10);

    if (isNaN(avaliacaoId)) {
      return response.status(400).json({ message: "ID da avaliação inválido." });
    }

    try {
      const avaliacao = await prisma.avaliacao.findUnique({
        where: { id: avaliacaoId },
        include: {
          empresa: true,
          questionario: {
            include: {
              perguntas: {
                orderBy: { ordem: 'asc' },
                include: {
                  pergunta: {
                    include: {
                      opcoes: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // --- INÍCIO DAS VERIFICAÇÕES DE ROBUSTEZ ---

      if (!avaliacao || !avaliacao.isPublica) {
        return response.status(404).json({ message: "Avaliação não encontrada ou não é pública." });
      }

      if (!avaliacao.empresa) {
        return response.status(500).json({ message: "Configuração inválida: A avaliação não está associada a uma empresa." });
      }

      if (!avaliacao.questionario) {
        return response.status(500).json({ message: "Configuração inválida: A avaliação não possui um questionário vinculado." });
      }
      
      // Garante que 'perguntas' seja um array, mesmo que vazio.
      const perguntasDoQuestionario = avaliacao.questionario.perguntas || [];

      // --- FIM DAS VERIFICAÇÕES DE ROBUSTEZ ---

      // Mapeia os dados do banco para o formato esperado pelo frontend
      const responseData = {
        avaliacaoId: avaliacao.id,
        semestreAvaliacao: avaliacao.semestre,
        requerLoginCliente: avaliacao.requer_login,
        nomeEmpresa: avaliacao.empresa.nome,
        tituloQuestionario: avaliacao.questionario.titulo,
        perguntas: perguntasDoQuestionario
          .filter(quePerg => quePerg.pergunta) // Filtra para garantir que a pergunta existe
          .map(quePerg => ({
            id: quePerg.pergunta.id,
            enunciado: quePerg.pergunta.enunciado,
            obrigatoria: quePerg.pergunta.obrigatoria,
            tipo: quePerg.pergunta.tipo,
            opcoes: quePerg.pergunta.opcoes || [], // Garante que opções seja um array
          })),
      };

      return response.json(responseData);

    } catch (error) {
      console.error("Erro detalhado ao buscar dados da avaliação:", error);
      return response.status(500).json({ message: "Erro interno ao buscar dados da avaliação." });
    }
  }
}