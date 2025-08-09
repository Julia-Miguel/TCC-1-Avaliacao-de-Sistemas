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
      const usuario = await prisma.usuario.upsert({
        where: { email: email },
        update: { nome: nome },
        create: {
          nome,
          email,
          tipo: 'CLIENTE_PLATAFORMA',
        },
      });

      const usuAval = await prisma.usuAval.create({
        data: {
          avaliacaoId,
          usuarioId: usuario.id,
          status: 'INICIADO',
          isFinalizado: false,
          started_at: new Date(),
        },
      });

      const avaliacaoCompleta = await prisma.avaliacao.findUnique({
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
      
      const responseData = {
      };

      return response.status(200).json(responseData);

    } catch (error) {
      console.error("Erro ao iniciar avaliação identificada:", error);
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}