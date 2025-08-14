import { prisma } from '../../../database/client.js';

export class IdentifiedStartAvaliacaoController {
  async handle(request, response) {
    const { avaliacaoId: avaliacaoIdParam } = request.params;
    const { nome, email } = request.body;
    const avaliacaoId = parseInt(avaliacaoIdParam, 10);

    if (!nome || !email) {
      return response.status(400).json({ message: "Nome e e-mail são obrigatórios." });
    }

    try {
      // Sempre salvar email em minúsculo
      const emailLower = email.toLowerCase();

      // Cria/atualiza usuário
      const usuario = await prisma.usuario.upsert({
        where: { email: emailLower },
        update: { nome: nome },
        create: {
          nome,
          email: emailLower,
          tipo: 'CLIENTE_PLATAFORMA',
        },
      });

      // Checa se já existe usuAval para esse usuario + avaliacao
      const usuAvalExistente = await prisma.usuAval.findFirst({
        where: {
          avaliacaoId,
          usuarioId: usuario.id
        }
      });

      if (usuAvalExistente) {
        return response.status(409).json({ message: "Avaliação já iniciada para este usuário." });
      }

      // Cria usuAval
      const usuAval = await prisma.usuAval.create({
        data: {
          avaliacaoId,
          usuarioId: usuario.id,
          status: 'INICIADO',
          isFinalizado: false,
          started_at: new Date(),
        },
      });

      // Busca avaliação para retornar dados relevantes ao frontend/teste
      const avaliacao = await prisma.avaliacao.findUnique({
        where: { id: avaliacaoId },
        include: {
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

      // Retorno mais informativo
      const responseData = {
        message: "Avaliação iniciada com sucesso.",
        usuAvalId: usuAval.id,
        avaliacao,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
      };

      return response.status(201).json(responseData);

    } catch (error) {
      console.error("Erro ao iniciar avaliação identificada:", error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}